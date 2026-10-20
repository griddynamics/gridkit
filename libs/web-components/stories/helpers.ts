import { action } from 'storybook/actions';
import { defaultTheme } from 'gd-design-library/tokens';
import type { ThemeLike } from '../src/core';
import type {} from '../src/index';

type Tag = Extract<keyof HTMLElementTagNameMap, `gd-${string}`>;

const sourceKeyProperties: Partial<Record<Tag, readonly string[]>> = {
  'gd-avatar': ['sizeVariant'],
  'gd-badge': ['variant', 'appearance', 'size'],
  'gd-box': ['variant', 'isBordered'],
  'gd-button': ['variant', 'rounded'],
  'gd-checkbox': ['size'],
  'gd-input': ['variant', 'color'],
  'gd-image': ['src', 'alt', 'objectFit'],
  'gd-icon': ['name', 'size'],
  'gd-input-file': ['accept', 'multiple'],
  'gd-label': ['htmlFor'],
  'gd-link': ['variant', 'href'],
  'gd-loader': ['name', 'variant', 'size'],
  'gd-separator': ['orientation', 'variant', 'size', 'labelPosition'],
  'gd-skeleton': ['variant', 'width', 'height'],
  'gd-slider': ['min', 'max', 'value'],
  'gd-slider-dots': ['count', 'activeIndex'],
  'gd-switch': ['checked', 'disabled', 'isLoading'],
  'gd-textarea': ['variant', 'color', 'value'],
  'gd-toggle': ['items', 'value'],
  'gd-truncate': ['lines'],
  'gd-wrapper': ['variant', 'as'],
  'gd-select': ['color'],
  'gd-typography': ['variant', 'as', 'size', 'align'],
  'gd-counter': ['min', 'max', 'initial'],
  'gd-menu': ['placement', 'closeOnSelect'],
  'gd-column': ['as', 'align', 'justify', 'gutter', 'isWrap', 'isReversed'],
  'gd-flex-container': ['flexDirection', 'justifyContent', 'gap'],
  'gd-portal': ['wrapperVariant', 'withWrapper', 'blocksScroll', 'WrapperView'],
  'gd-row': ['as', 'align', 'justify', 'gutter', 'isWrap', 'isReversed'],
  'gd-scroll': ['vertical', 'horizontal', 'autoHide'],
};

const sourceEvents: Partial<Record<Tag, readonly string[]>> = {
  'gd-checkbox': ['gd-change'],
  'gd-input': ['gd-input', 'gd-change'],
  'gd-select': ['gd-change'],
  'gd-counter': ['gd-change'],
  'gd-menu': ['gd-change'],
  'gd-image': ['gd-load', 'gd-error'],
  'gd-input-file': ['gd-change'],
  'gd-slider': ['gd-change'],
  'gd-slider-dots': ['gd-change'],
  'gd-switch': ['gd-change'],
  'gd-textarea': ['gd-input', 'gd-change'],
  'gd-toggle': ['gd-change'],
};

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const kebab = (value: string) => value.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);

function equivalent(left: unknown, right: unknown) {
  if (Object.is(left, right)) return true;
  if (typeof left === 'object' && left !== null && typeof right === 'object' && right !== null) {
    try {
      return JSON.stringify(left) === JSON.stringify(right);
    } catch {
      return false;
    }
  }
  return false;
}

function formattedAttributes(attributes: Map<string, string>, indent: number) {
  const values = [...attributes].map(([name, value]) => (value === '' ? name : `${name}="${escapeHtml(value)}"`));
  if (!values.length) return '';
  if (values.length <= 2 && values.join(' ').length <= 72) return ` ${values.join(' ')}`;
  const spacing = '  '.repeat(indent + 1);
  return `\n${values.map((value) => `${spacing}${value}`).join('\n')}\n${'  '.repeat(indent)}`;
}

function formattedElement(node: Element, rootAttributes?: Map<string, string>, indent = 0): string {
  const spacing = '  '.repeat(indent);
  const attributes =
    rootAttributes ?? new Map(Array.from(node.attributes).map(({ name, value }) => [name, value] as const));
  const opening = `${spacing}<${node.localName}${formattedAttributes(attributes, indent)}>`;
  const children = Array.from(node.childNodes).filter(
    (child) => child.nodeType !== Node.TEXT_NODE || Boolean(child.textContent?.trim())
  );
  if (!children.length) return `${opening}</${node.localName}>`;
  if (children.every((child) => child.nodeType === Node.TEXT_NODE)) {
    return `${opening}${escapeHtml(
      children
        .map((child) => child.textContent ?? '')
        .join('')
        .trim()
    )}</${node.localName}>`;
  }
  const content = children
    .map((child) => {
      if (child.nodeType === Node.TEXT_NODE)
        return `${'  '.repeat(indent + 1)}${escapeHtml(child.textContent?.trim() ?? '')}`;
      if (child.nodeType === Node.COMMENT_NODE)
        return `${'  '.repeat(indent + 1)}<!--${child.textContent?.trim() ?? ''}-->`;
      return child instanceof Element ? formattedElement(child, undefined, indent + 1) : '';
    })
    .filter(Boolean)
    .join('\n');
  return `${opening}\n${content}\n${spacing}</${node.localName}>`;
}

function isNestedCustomElement(node: Element, canvas: HTMLElement) {
  let parent = node.parentElement;
  while (parent && parent !== canvas) {
    if (parent.localName.startsWith('gd-')) return true;
    parent = parent.parentElement;
  }
  return false;
}

/** Produce consumer-ready source from the custom elements rendered by a story.
 * Storybook cannot infer useful source from our imperative DOM render functions. */
export function storySource(canvas: HTMLElement | undefined, fallback: string) {
  if (!canvas) return fallback;
  const nodes = Array.from(canvas.querySelectorAll<HTMLElement>('*')).filter((node) =>
    node.localName.startsWith('gd-')
  );
  if (!nodes.length) return fallback;

  const markup: string[] = [];
  const setup: string[] = ["import 'web-components';", "import { defaultTheme } from 'gd-design-library/tokens';", ''];
  nodes.forEach((node, index) => {
    const tag = node.localName as Tag;
    const baseline = document.createElement(tag) as unknown as HTMLElement & Record<string, unknown>;
    const current = node as unknown as HTMLElement & Record<string, unknown>;
    const constructor = customElements.get(tag) as
      | (CustomElementConstructor & {
          elementProperties?: Map<PropertyKey, { attribute?: boolean | string; state?: boolean }>;
        })
      | undefined;
    const attributes = new Map(Array.from(node.attributes).map(({ name, value }) => [name, value]));
    const assignments: Array<[string, unknown]> = [];
    for (const [property, options] of constructor?.elementProperties ?? []) {
      if (typeof property !== 'string' || property === 'theme' || options.state || property.startsWith('_')) continue;
      const value = current[property];
      const requiredForUnderstanding = sourceKeyProperties[tag]?.includes(property) ?? false;
      if (!requiredForUnderstanding && equivalent(value, baseline[property])) continue;
      const attribute =
        options.attribute === false
          ? false
          : typeof options.attribute === 'string'
            ? options.attribute
            : kebab(property);
      if (attribute && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
        if (typeof value === 'boolean') {
          if (value) attributes.set(attribute, '');
          else if (!equivalent(value, baseline[property])) assignments.push([property, value]);
        } else attributes.set(attribute, String(value));
      } else if (typeof value !== 'function' && value !== undefined) assignments.push([property, value]);
    }
    if (!isNestedCustomElement(node, canvas)) markup.push(formattedElement(node, attributes));

    const variable = nodes.length === 1 ? 'component' : `component${index + 1}`;
    const sameTagIndex = nodes.slice(0, index).filter((candidate) => candidate.localName === tag).length;
    setup.push(
      nodes.length === 1
        ? `const ${variable} = document.querySelector('${tag}');`
        : `const ${variable} = document.querySelectorAll('${tag}')[${sameTagIndex}];`
    );
    setup.push(`${variable}.theme = defaultTheme;`);
    for (const [property, value] of assignments)
      setup.push(`${variable}.${property} = ${JSON.stringify(value, null, 2)};`);
    for (const eventName of sourceEvents[tag] ?? []) {
      setup.push(`${variable}.addEventListener('${eventName}', (event) => {`, '  console.log(event.detail);', '});');
    }
    setup.push('');
  });

  const formattedSetup = setup.flatMap((line) =>
    line ? line.split('\n').map((nestedLine) => `  ${nestedLine}`) : ['']
  );
  return `${markup.join('\n\n')}\n\n<script type="module">\n${formattedSetup.join('\n')}\n</script>`;
}

/** Use the same property-based theme contract as application consumers. */
export function element<T extends Tag>(tag: T, props: Partial<HTMLElementTagNameMap[T]> = {}, text = '') {
  const node = document.createElement(tag);
  Object.assign(node, { theme: defaultTheme as ThemeLike }, props);
  node.textContent = text;
  return node;
}

const tokenViewerStyles = `
  font-family: monospace;
  font-size: 14px;
  background: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
  white-space: pre-wrap;
  overflow-x: auto;
  color: #333;
  max-height: 800px;
`;

function tokenNode(value: unknown, indent = 0): HTMLElement {
  if (typeof value !== 'object' || value === null) {
    const text = document.createElement('span');
    text.style.color = '#545454';
    // Function tokens are shown as the JSON of their (theme-less) result, on one line.
    text.textContent = JSON.stringify(typeof value === 'function' ? value() : value);
    return text;
  }

  const node = document.createElement('div');
  node.style.margin = '2px 0';
  for (const [key, childValue] of Object.entries(value)) {
    const line = document.createElement('div');
    line.style.cssText = `display:block;margin:2px 0;padding-left:${(indent + 1) * 12}px`;
    const keyElement = document.createElement('span');
    keyElement.style.cssText = 'color:#0d52a5;margin-right:6px';
    keyElement.append('"', key, '" :');
    line.append(keyElement);

    if (typeof childValue === 'object' && childValue !== null) {
      keyElement.style.cursor = 'pointer';
      keyElement.tabIndex = 0;
      keyElement.setAttribute('role', 'button');
      keyElement.setAttribute('aria-expanded', 'true');
      const brace = document.createElement('span');
      brace.style.cssText = 'color:#545454;user-select:none';
      brace.textContent = '{';
      const content = tokenNode(childValue, indent + 1);
      const closingBrace = document.createElement('span');
      closingBrace.style.cssText = 'color:#545454;user-select:none';
      closingBrace.textContent = ' } ';
      const toggle = () => {
        const expanded = keyElement.getAttribute('aria-expanded') === 'true';
        keyElement.setAttribute('aria-expanded', String(!expanded));
        brace.textContent = expanded ? '{...}' : '{';
        content.hidden = expanded;
        closingBrace.hidden = expanded;
      };
      keyElement.addEventListener('click', toggle);
      keyElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      });
      line.append(brace, content, closingBrace);
    } else {
      line.append(tokenNode(childValue, indent + 1));
    }
    node.append(line);
  }
  return node;
}

/** Render the same default-theme branch shown by the React Storybook TokenViewer. */
export function defaultTokenViewer(
  label: string,
  themeToken: keyof typeof defaultTheme = label as keyof typeof defaultTheme
) {
  const viewer = document.createElement('div');
  viewer.style.cssText = tokenViewerStyles;
  viewer.tabIndex = 0;
  viewer.setAttribute('role', 'region');
  viewer.setAttribute('aria-label', 'Token viewer');
  viewer.append(tokenNode({ [label]: defaultTheme[themeToken] }));
  return viewer;
}

/** Log a native event to Storybook's Actions panel. The canvas stays identical to the story it mirrors:
 * the source stories render no event output, so none is added to the DOM. */
export function observed(node: HTMLElement, eventName: string, _initial?: unknown) {
  node.addEventListener(eventName, (event) => action(eventName)((event as CustomEvent<unknown>).detail));
  return node;
}

export const items = [
  { name: 'Alpha', value: 'a' },
  { name: 'Beta', value: 'b' },
  { name: 'Gamma', value: 'c' },
];

export const portrait =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%2391b8d8"/%3E%3Ccircle cx="32" cy="24" r="13" fill="%23f1c7a5"/%3E%3Cpath d="M8 64c3-18 14-27 24-27s21 9 24 27" fill="%233e6184"/%3E%3C/svg%3E';
