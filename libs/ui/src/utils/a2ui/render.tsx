import { cloneElement, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Box, Typography } from '@components';
import type { A2UIActionDefinition, A2UIComponent } from '../../ai';
import { A2UI_COMPONENT_MAP } from '../../ai';
import type { DispatchAction, RenderableA2UISpec, Renderer, A2UICustomComponentDefinition } from './types';
import { ROOT_TEST_ID } from './constants';
import { getMergedComponentStyles, getComponentText } from './helpers';
import { renderers } from './renderers';

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
  renderChildren: (children?: A2UIComponent[]) => ReactNode[],
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

export function renderA2UISpec(
  spec?: RenderableA2UISpec | null,
  actions?: A2UIActionDefinition[],
  customComponents?: A2UICustomComponentDefinition[]
): ReactNode {
  if (!spec?.ui?.components?.length) {
    return null;
  }

  const dispatchAction = actions?.length ? createDispatchAction(spec, actions) : undefined;

  const customRenderers = customComponents?.length ? createCustomRendererMap(customComponents) : undefined;

  const renderChildren = (children?: A2UIComponent[]) =>
    (children || []).map((child) => {
      const renderedChild = renderA2UIComponent(child, renderChildren, dispatchAction, customRenderers);

      if (renderedChild == null) {
        return null;
      }

      if (isValidElement(renderedChild)) {
        return cloneElement(renderedChild as ReactElement<Record<string, unknown>>, {
          key: child.id,
          'data-a2ui-component-id': child.id,
          'data-a2ui-component-type': child.type,
        });
      }

      return <Fragment key={child.id}>{renderedChild}</Fragment>;
    });

  return renderLayout(spec, renderChildren(spec.ui.components));
}
