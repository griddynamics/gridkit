import { defaultTheme } from 'gd-design-library/tokens';
import type { DesignCoreTheme } from 'gd-design-core';
import type {} from '../src/index';

type Tag = Extract<keyof HTMLElementTagNameMap, `gd-${string}`>;

const sourceKeyProperties: Partial<Record<Tag, readonly string[]>> = {
  'gd-avatar': ['sizeVariant'],
  'gd-button': ['variant', 'rounded'],
  'gd-checkbox': ['size'],
  'gd-input': ['variant', 'color'],
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

function lightDom(node: Element) {
  return Array.from(node.childNodes)
    .map((child) => {
      if (child.nodeType === Node.TEXT_NODE) return escapeHtml(child.textContent ?? '');
      return child instanceof Element ? child.outerHTML : '';
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
    const attributeText = [...attributes]
      .map(([name, value]) => (value === '' ? name : `${name}="${escapeHtml(value)}"`))
      .join(' ');
    const content = lightDom(node);
    markup.push(`<${tag}${attributeText ? ` ${attributeText}` : ''}>${content}</${tag}>`);

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

  return `${markup.join('\n\n')}\n\n<script type="module">\n${setup.map((line) => (line ? `  ${line}` : '')).join('\n')}\n</script>`;
}

/** Use the same property-based theme contract as application consumers. */
export function element<T extends Tag>(tag: T, props: Partial<HTMLElementTagNameMap[T]> = {}, text = '') {
  const node = document.createElement(tag);
  Object.assign(node, { theme: defaultTheme as DesignCoreTheme }, props);
  node.textContent = text;
  return node;
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
