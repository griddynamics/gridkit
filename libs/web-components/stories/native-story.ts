import type { Meta, StoryObj, ArgTypes } from '@storybook/web-components-vite';
import { defaultTheme } from 'gd-design-library/tokens';
import { defaultTokenViewer } from './helpers';

type Props = Record<string, unknown>;
type Recipe = { tag: string; props: Props; children: unknown[] };
type SourceStory = {
  args?: Props;
  render?: (args: Props) => unknown;
  parameters?: Props;
  name?: string;
  tags?: string[];
};
export const Fragment = 'Fragment';
export function demo(tag: string, props: Props | null, ...children: unknown[]): Recipe {
  return { tag, props: props ?? {}, children };
}

const layoutProps = new Set([
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'gap',
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'flex',
  'alignItems',
  'justifyContent',
]);
const slots: Record<string, string> = {
  iconStart: 'icon-start',
  iconEnd: 'icon-end',
  fallbackComponent: 'fallback',
  adornmentStart: 'adornment-start',
  adornmentEnd: 'adornment-end',
};
function cssValue(key: string, value: unknown) {
  return typeof value === 'number' && !['flex', 'fontWeight', 'opacity', 'zIndex', 'lineHeight'].includes(key)
    ? `${value}px`
    : String(value);
}

/** Render source example recipes using real gd-* elements, never React. */
export function renderDemo(value: unknown): Node {
  if (value instanceof Node) return value;
  if (value == null || typeof value === 'boolean') return document.createTextNode('');
  if (Array.isArray(value)) {
    const fragment = document.createDocumentFragment();
    fragment.append(...value.map(renderDemo));
    return fragment;
  }
  if (typeof value !== 'object') return document.createTextNode(String(value));
  const { tag, props, children } = value as Recipe;
  if (!tag) throw new Error('A story child has no native recipe mapping');
  if (tag === Fragment) return renderDemo(children);
  if (tag === 'TokenViewer') return defaultTokenViewer(Object.keys(props.tokens as Props)[0]);
  const layout = tag === 'Row' || tag === 'Column';
  const node = document.createElement(layout ? 'div' : tag);
  const custom = tag.startsWith('gd-');
  const target = node as unknown as Props;
  const styles: Record<string, string | number> = {};
  if (custom) target.theme = defaultTheme;
  if (layout) {
    const align = String(props.align ?? 'stretch');
    const justify = String(props.justify ?? 'start');
    Object.assign(node.style, {
      display: 'flex',
      flexDirection: tag === 'Row' ? 'row' : 'column',
      flexWrap: 'wrap',
      alignItems: align === 'start' || align === 'end' ? `flex-${align}` : align,
      justifyContent:
        justify === 'between'
          ? 'space-between'
          : justify === 'start' || justify === 'end'
            ? `flex-${justify}`
            : justify,
      gap: cssValue('gap', props.gutter ?? 0),
    });
    if (tag === 'Column') node.style.maxWidth = '100%';
  }
  for (const [key, val] of Object.entries(props)) {
    if (val === undefined || key === 'children' || key === 'key') continue;
    if (slots[key]) {
      if (val == null) continue;
      const child = renderDemo(val);
      const slotNode = child instanceof HTMLElement ? child : document.createElement('span');
      if (slotNode !== child) slotNode.append(child);
      slotNode.slot = slots[key];
      node.append(slotNode);
    } else if (key === 'buttonProps' && tag === 'gd-input-file') target.buttonVariant = (val as Props).variant;
    else if (key === 'WrapperView' && tag === 'gd-loader') target.wrapperAs = val;
    else if (key === 'styles' || key === 'style') Object.assign(styles, val);
    else if (layoutProps.has(key) && (layout || !(key in node))) styles[key] = cssValue(key, val);
    else if (/^on[A-Z]/.test(key) && typeof val === 'function') {
      const callback = val as (value: unknown) => void;
      const customEvent = ['onValueChange', 'onCounterChange', 'onChange', 'onDotClick'].includes(key) && custom;
      node.addEventListener(customEvent ? 'gd-change' : key.slice(2).toLowerCase(), (event) => {
        const detail = (event as CustomEvent<Props>).detail;
        callback(customEvent ? (detail?.checked ?? detail?.value ?? detail?.index ?? detail) : event);
      });
    } else if (key.startsWith('aria-') || key.startsWith('data-') || key === 'role')
      node.setAttribute(key, String(val));
    else if (key === 'ariaLabel') {
      node.setAttribute('aria-label', String(val));
      if (custom) target.ariaLabel = val;
    } else if (layout && ['gutter', 'align', 'justify'].includes(key)) continue;
    else target[key] = val;
  }
  if (custom) target.styles = { ...((target.styles as Props) ?? {}), ...styles };
  else
    for (const [key, val] of Object.entries(styles))
      node.style.setProperty(
        key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`),
        cssValue(key, val)
      );
  const content = children.length ? children : props.children;
  if (content !== undefined && content !== null) node.append(renderDemo(content));
  return node;
}

function nativeParameters(parameters: Props | undefined) {
  if (!parameters) return parameters;
  const docs = parameters.docs as Props | undefined;
  const descriptions = docs?.description as Record<string, string> | undefined;
  if (!descriptions) return parameters;
  return {
    ...parameters,
    docs: {
      ...docs,
      description: Object.fromEntries(
        Object.entries(descriptions).map(([key, text]) => [
          key,
          text.replace(/\s*(?:<br\/?>\s*)*<h3>🧩[\s\S]*$/, '').replace(/React component/g, 'component'),
        ])
      ),
    },
  };
}

export function nativeMeta(
  source: SourceStory & { title?: string; component?: string },
  argTypes: ArgTypes
): Meta<Props> {
  return {
    title: source.title,
    tags: source.tags,
    args: source.args,
    parameters: nativeParameters(source.parameters),
    argTypes,
    render: (args) => renderDemo(demo(source.component!, args)) as HTMLElement,
  };
}

export function nativeStory(
  source: SourceStory | ((args: Props) => unknown),
  meta: Meta<Props>,
  displayName?: string
): StoryObj<Props> {
  const story = source as SourceStory;
  const render = typeof source === 'function' ? source : story.render;
  return {
    ...story,
    args: story.args,
    parameters: nativeParameters(story.parameters),
    tags: story.tags,
    ...(displayName ? { name: displayName } : {}),
    ...(render ? { render: (args: Props) => renderDemo(render(args)) as HTMLElement } : { render: meta.render }),
  } as StoryObj<Props>;
}
