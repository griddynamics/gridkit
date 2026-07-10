import { cloneElement, isValidElement, memo, type ReactElement, type ReactNode } from 'react';
import { Box, Typography } from '@components';
import type { A2UIActionDefinition, A2UIComponent } from '../../ai';
import { A2UI_COMPONENT_MAP } from '../../ai';
import type { DispatchAction, RenderableA2UISpec, Renderer, A2UICustomComponentDefinition } from './types';
import { ROOT_TEST_ID } from './constants';
import { getMergedComponentStyles, getComponentText } from './helpers';
import { renderers } from './renderers';

type RenderChildren = (children?: A2UIComponent[]) => ReactNode[];

function renderFallback(component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) {
  const text = getComponentText(component);

  return (
    <Box key={component.id} styles={getMergedComponentStyles(component)}>
      {text ? <Typography>{text}</Typography> : null}
      {renderChildren(component.children)}
    </Box>
  );
}

function renderA2UIComponent(
  component: A2UIComponent,
  renderChildren: RenderChildren,
  dispatchAction?: DispatchAction,
  customRenderers?: Record<string, Renderer>
): ReactNode {
  if (component.visible === false) {
    return null;
  }

  const builtInRenderer = renderers[component.type as keyof typeof renderers];

  if (builtInRenderer) {
    return builtInRenderer(component, renderChildren, dispatchAction);
  }

  if (component.type in A2UI_COMPONENT_MAP) {
    return renderFallback(component, renderChildren);
  }

  const customRenderer = customRenderers?.[component.type];

  return customRenderer
    ? customRenderer(component, renderChildren, dispatchAction)
    : renderFallback(component, renderChildren);
}

type A2UINodeProps = {
  component: A2UIComponent;
  renderChildren: RenderChildren;
  dispatchAction?: DispatchAction;
  customRenderers?: Record<string, Renderer>;
} & Record<string, unknown>;

/**
 * Wrapping the per-node dispatch in React.memo lets React skip re-rendering a whole
 * A2UI subtree when its `component` (and the shared dispatchAction/customRenderers/
 * renderChildren references) are unchanged — e.g. when a consumer patches only part
 * of a spec in place rather than fully regenerating it.
 *
 * Extra props beyond the four above are forwarded onto the rendered element as-is:
 * some compound components (e.g. AccordionItem) clone their `children` to inject
 * state-derived props like `isOpen`, and those must reach the real underlying element,
 * not be swallowed by this wrapper. Forwarding them also means React.memo's default
 * shallow comparison correctly detects such injected props changing and re-renders.
 */
const A2UINode = memo(function A2UINode({
  component,
  renderChildren,
  dispatchAction,
  customRenderers,
  ...extraProps
}: A2UINodeProps) {
  const renderedChild = renderA2UIComponent(component, renderChildren, dispatchAction, customRenderers);

  if (renderedChild == null) {
    return null;
  }

  if (isValidElement(renderedChild)) {
    return cloneElement(renderedChild as ReactElement<Record<string, unknown>>, {
      ...extraProps,
      'data-a2ui-component-id': component.id,
      'data-a2ui-component-type': component.type,
    });
  }

  return <>{renderedChild}</>;
});

function renderLayout(spec: RenderableA2UISpec, children: ReactNode[]) {
  const layout = spec.ui.layout;
  const spacing = layout?.spacing ?? '0px';
  const alignItems =
    layout?.alignment === 'start' ? 'flex-start' : layout?.alignment === 'end' ? 'flex-end' : layout?.alignment;
  const justifyContent =
    layout?.justification === 'start'
      ? 'flex-start'
      : layout?.justification === 'end'
        ? 'flex-end'
        : layout?.justification;

  if (layout?.type === 'grid') {
    return (
      <Box
        data-testid={ROOT_TEST_ID}
        display="grid"
        gap={spacing}
        alignItems={alignItems}
        justifyContent={justifyContent}
        styles={{
          width: '100%',
          gridTemplateColumns: `repeat(${layout.gridColumns || 1}, minmax(0, 1fr))`,
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      data-testid={ROOT_TEST_ID}
      display="flex"
      gap={spacing}
      flexDirection={layout?.type === 'horizontal' ? 'row' : 'column'}
      alignItems={alignItems}
      justifyContent={justifyContent}
      styles={{ width: '100%' }}
    >
      {children}
    </Box>
  );
}

export const A2UI_RENDERER_COMPONENT_TYPES = Object.freeze(
  (Object.keys(A2UI_COMPONENT_MAP) as (keyof typeof A2UI_COMPONENT_MAP)[]).filter((type) => type in renderers)
);

function createFirstByKeyMap<T>(items: T[], getKey: (item: T) => string): Map<string, T> {
  const itemsByKey = new Map<string, T>();

  for (const item of items) {
    const key = getKey(item);

    if (!itemsByKey.has(key)) {
      // Preserve Array.find semantics: the first matching item wins.
      itemsByKey.set(key, item);
    }
  }

  return itemsByKey;
}

function createDispatchAction(spec: RenderableA2UISpec, definitions: A2UIActionDefinition[]): DispatchAction {
  const specActionsById = createFirstByKeyMap(spec.ui.actions ?? [], (action) => action.id);
  const definitionsByType = createFirstByKeyMap(definitions, (definition) => definition.type);

  return (actionId, extraPayload) => {
    const specAction = specActionsById.get(actionId);

    if (!specAction) {
      return false;
    }

    const handler = definitionsByType.get(specAction.type)?.handler;

    if (!handler) {
      return false;
    }

    const mergedAction = extraPayload
      ? { ...specAction, payload: { ...(specAction.payload ?? {}), ...extraPayload } }
      : specAction;

    handler(mergedAction);
    return true;
  };
}

function createCustomRendererMap(
  customComponents: A2UICustomComponentDefinition[]
): Record<string, Renderer> | undefined {
  const customRendererMap: Record<string, Renderer> = {};

  for (const customComponent of customComponents) {
    if (customComponent.type in A2UI_COMPONENT_MAP || customComponent.type in customRendererMap) {
      continue;
    }

    customRendererMap[customComponent.type] = customComponent.renderer;
  }

  return Object.keys(customRendererMap).length > 0 ? customRendererMap : undefined;
}

// The caches below give `dispatchAction`, `customRenderers`, and `renderChildren` stable
// object identity across separate `renderA2UISpec` calls whose `spec.ui`/`actions`/
// `customComponents` inputs are themselves unchanged by reference. Without this, those
// three values would be freshly allocated on every call, and A2UINode's React.memo could
// never bail out — even for a `component` whose reference genuinely didn't change.
const dispatchActionCache = new WeakMap<RenderableA2UISpec['ui'], WeakMap<A2UIActionDefinition[], DispatchAction>>();

function getCachedDispatchAction(spec: RenderableA2UISpec, definitions: A2UIActionDefinition[]): DispatchAction {
  let byDefinitions = dispatchActionCache.get(spec.ui);
  if (!byDefinitions) {
    byDefinitions = new WeakMap();
    dispatchActionCache.set(spec.ui, byDefinitions);
  }

  let dispatchAction = byDefinitions.get(definitions);
  if (!dispatchAction) {
    dispatchAction = createDispatchAction(spec, definitions);
    byDefinitions.set(definitions, dispatchAction);
  }

  return dispatchAction;
}

const customRendererMapCache = new WeakMap<A2UICustomComponentDefinition[], Record<string, Renderer> | undefined>();

function getCachedCustomRendererMap(
  customComponents: A2UICustomComponentDefinition[]
): Record<string, Renderer> | undefined {
  if (customRendererMapCache.has(customComponents)) {
    return customRendererMapCache.get(customComponents);
  }

  const customRendererMap = createCustomRendererMap(customComponents);
  customRendererMapCache.set(customComponents, customRendererMap);

  return customRendererMap;
}

const NO_DISPATCH_ACTION = {} as DispatchAction;
const NO_CUSTOM_RENDERERS = {} as Record<string, Renderer>;

const renderChildrenCache = new WeakMap<
  DispatchAction | typeof NO_DISPATCH_ACTION,
  WeakMap<Record<string, Renderer> | typeof NO_CUSTOM_RENDERERS, RenderChildren>
>();

function getCachedRenderChildren(
  dispatchAction: DispatchAction | undefined,
  customRenderers: Record<string, Renderer> | undefined
): RenderChildren {
  const dispatchKey = dispatchAction ?? NO_DISPATCH_ACTION;
  const customKey = customRenderers ?? NO_CUSTOM_RENDERERS;

  let byCustomRenderers = renderChildrenCache.get(dispatchKey);
  if (!byCustomRenderers) {
    byCustomRenderers = new WeakMap();
    renderChildrenCache.set(dispatchKey, byCustomRenderers);
  }

  let renderChildren = byCustomRenderers.get(customKey);
  if (!renderChildren) {
    function newRenderChildren(children?: A2UIComponent[]): ReactNode[] {
      return (children || []).map((child) => (
        <A2UINode
          key={child.id}
          component={child}
          renderChildren={newRenderChildren}
          dispatchAction={dispatchAction}
          customRenderers={customRenderers}
        />
      ));
    }

    renderChildren = newRenderChildren;
    byCustomRenderers.set(customKey, renderChildren);
  }

  return renderChildren;
}

export function renderA2UISpec(
  spec?: RenderableA2UISpec | null,
  actions?: A2UIActionDefinition[],
  customComponents?: A2UICustomComponentDefinition[]
): ReactNode {
  if (!spec?.ui?.components?.length) {
    return null;
  }

  const dispatchAction = actions?.length ? getCachedDispatchAction(spec, actions) : undefined;

  const customRenderers = customComponents?.length ? getCachedCustomRendererMap(customComponents) : undefined;

  const renderChildren = getCachedRenderChildren(dispatchAction, customRenderers);

  return renderLayout(spec, renderChildren(spec.ui.components));
}
