import { defaultTheme } from 'gd-design-library/tokens';
import type { DesignCoreTheme } from 'gd-design-core';
import type { ArgTypes as StorybookArgTypes } from '@storybook/web-components-vite';
import { action } from 'storybook/actions';
import type {} from '../src/index';
import { reactStorybookArgTypes } from './react-storybook-arg-types.generated';

type Tag = Extract<keyof HTMLElementTagNameMap, `gd-${string}`>;

type ArgType = {
  table?: Record<string, unknown>;
  [key: string]: unknown;
};

/** Preserve the complete control table defined by the corresponding React story. */
export function sectionedArgTypes<
  Component extends keyof typeof reactStorybookArgTypes,
  ArgTypes extends Record<string, ArgType>,
>(component: Component, _argTypes: ArgTypes): StorybookArgTypes {
  void _argTypes;
  const source = reactStorybookArgTypes[component] as Record<string, ArgType>;
  return Object.fromEntries(
    Object.keys(source).map((name) => {
      const sourceArgType = source[name];
      return [
        name,
        sourceArgType.control === undefined ? { ...sourceArgType, control: { disable: true } } : sourceArgType,
      ];
    })
  ) as StorybookArgTypes;
}

const sourceKeyProperties: Partial<Record<Tag, readonly string[]>> = {
  'gd-avatar': ['sizeVariant'],
  'gd-badge': ['variant', 'appearance', 'size'],
  'gd-box': ['variant', 'isBordered'],
  'gd-button': ['variant', 'rounded', 'isLoading'],
  'gd-checkbox': ['size'],
  'gd-input': ['variant', 'color'],
  'gd-image': ['src', 'alt', 'objectFit'],
  'gd-icon': ['name', 'size'],
  'gd-input-file': ['accept', 'multiple'],
  'gd-label': ['htmlFor', 'color', 'ariaLabel'],
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

function sourceElement(node: Element) {
  const clone = node.cloneNode(true) as Element;
  const applyEffectiveAttributes = (source: Element, target: Element) => {
    if (source.localName.startsWith('gd-')) {
      const tag = source.localName as Tag;
      const current = source as unknown as HTMLElement & Record<string, unknown>;
      const baseline = document.createElement(tag) as unknown as HTMLElement & Record<string, unknown>;
      const constructor = customElements.get(tag) as
        | (CustomElementConstructor & {
            elementProperties?: Map<PropertyKey, { attribute?: boolean | string; state?: boolean }>;
          })
        | undefined;
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
        if (!attribute || !['string', 'number', 'boolean'].includes(typeof value)) continue;
        if (typeof value === 'boolean') {
          if (value) target.setAttribute(attribute, '');
        } else target.setAttribute(attribute, String(value));
      }
    }
    const sourceChildren = Array.from(source.children);
    const targetChildren = Array.from(target.children);
    sourceChildren.forEach((child, index) => {
      const targetChild = targetChildren[index];
      if (targetChild) applyEffectiveAttributes(child, targetChild);
    });
  };
  applyEffectiveAttributes(node, clone);
  return clone.outerHTML;
}

function lightDom(node: Element) {
  return Array.from(node.childNodes)
    .map((child) => {
      if (child.nodeType === Node.TEXT_NODE) return escapeHtml(child.textContent ?? '');
      return child instanceof Element ? sourceElement(child) : '';
    })
    .join('')
    .trim();
}

/** Produce consumer-ready source from the custom elements rendered by a story.
 * Storybook cannot infer useful source from our imperative DOM render functions. */
export function storySource(canvas: HTMLElement | undefined, fallback: string) {
  if (!canvas) return fallback;
  const nodes = Array.from(canvas.querySelectorAll<HTMLElement>('*')).filter((node) =>
    node.localName.startsWith('gd-')
  );
  if (!nodes.length) return fallback;

  const markup = lightDom(canvas);
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

  return `${markup}\n\n<script type="module">\n${setup.map((line) => (line ? `  ${line}` : '')).join('\n')}\n</script>`;
}

/** Use the same property-based theme contract as application consumers. */
export function element<T extends Tag>(tag: T, props: Partial<HTMLElementTagNameMap[T]> = {}, text = '') {
  const node = document.createElement(tag);
  Object.assign(node, { theme: defaultTheme as DesignCoreTheme }, props);
  node.textContent = text;
  for (const eventName of sourceEvents[tag] ?? []) {
    node.addEventListener(eventName, (event) => action(eventName)((event as CustomEvent<unknown>).detail));
  }
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
  if (typeof value === 'function') return tokenNode(value(), indent);

  if (typeof value !== 'object' || value === null) {
    const text = document.createElement('span');
    text.style.color = '#545454';
    text.textContent = JSON.stringify(value);
    return text;
  }

  const node = document.createElement('div');
  node.style.margin = '2px 0';
  for (const [key, childValue] of Object.entries(value)) {
    const line = document.createElement('div');
    line.style.cssText = `display:block;margin:2px 0;padding-left:${(indent + 1) * 12}px`;
    const keyElement = document.createElement('span');
    keyElement.style.cssText = 'color:#0d52a5;margin-right:6px';
    keyElement.textContent = `"${key}" :`;
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

/** Each render owns its output and listeners; no state leaks between stories. */
export function observed(node: HTMLElement, eventName: string, initial: unknown) {
  const section = document.createElement('section');
  section.style.cssText = 'display:grid;gap:16px;max-width:480px;font-family:"Fira Sans",sans-serif';
  const output = document.createElement('output');
  output.setAttribute('aria-label', 'Last event');
  output.textContent = JSON.stringify(initial);
  node.addEventListener(eventName, (event) => {
    output.textContent = JSON.stringify((event as CustomEvent<unknown>).detail);
  });
  section.append(node, output);
  return section;
}

export const items = [
  { name: 'Alpha', value: 'a' },
  { name: 'Beta', value: 'b' },
  { name: 'Gamma', value: 'c' },
];

export const portrait =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%2391b8d8"/%3E%3Ccircle cx="32" cy="24" r="13" fill="%23f1c7a5"/%3E%3Cpath d="M8 64c3-18 14-27 24-27s21 9 24 27" fill="%233e6184"/%3E%3C/svg%3E';

/** Framework-neutral equivalent of the React stories' Row / Column layout. */
export function stack(direction: 'row' | 'column', gap: string, ...children: Node[]) {
  const node = document.createElement('div');
  node.style.display = 'flex';
  node.style.flexDirection = direction;
  node.style.gap = gap;
  if (direction === 'row') node.style.alignItems = 'center';
  node.append(...children);
  return node;
}
