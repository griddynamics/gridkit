import { defaultTheme } from 'gd-design-library/tokens';
import type { DesignCoreTheme } from 'gd-design-core';
import type {} from '../src/index';

type Tag = Extract<keyof HTMLElementTagNameMap, `gd-${string}`>;

type ArgType = {
  table?: Record<string, unknown>;
  [key: string]: unknown;
};

const reactArgTypeSections = {
  Avatar: { badgeColor: 'Badge', backgroundColor: 'Appearance' },
  Badge: { variant: 'Visual Style', appearance: 'Visual Style', size: 'Visual Style', disabled: 'Visual Style' },
  Box: {
    variant: 'Core Props',
    isBordered: 'Visual Style',
    isHighlighted: 'Visual Style',
    withShadowHover: 'Visual Style',
  },
  Button: { variant: 'Visual Style', rounded: 'Visual Style' },
  Checkbox: { size: 'Layout' },
  Icon: { name: 'Icon Selection', size: 'Size & Dimensions', fill: 'Styling & Colors' },
  Image: {
    src: 'Core Properties',
    alt: 'Core Properties',
    width: 'Dimensions',
    height: 'Dimensions',
    caption: 'Content & Display',
    objectFit: 'Styling',
  },
  Input: { variant: 'Core Properties', color: 'Appearance & Styling' },
  InputFile: {
    accept: 'File Handling',
    capture: 'Mobile Features',
    multiple: 'File Handling',
    disabled: 'State',
    isIcon: 'Button Customization',
  },
  Label: { htmlFor: 'Core Properties', styles: 'Styling' },
  Link: {
    variant: 'Core Properties',
    size: 'Appearance',
    underline: 'Appearance',
    cursor: 'Appearance',
    disabled: 'State & Behavior',
    href: 'Core Properties',
    target: 'Navigation & Behavior',
    rel: 'Navigation & Behavior',
    styles: 'Styling',
  },
  Loader: {
    name: 'Appearance',
    variant: 'Layout & Positioning',
    size: 'Appearance',
    rounded: 'Appearance',
    withWrapper: 'Layout & Positioning',
    animationProps: 'Content & Customization',
    styles: 'Custom Styling',
  },
  Menu: { placement: 'Menu Options (Positioning & Dimensions)' },
  SliderDots: { count: 'Core Properties', activeIndex: 'Core Properties' },
  Switch: { checked: 'State', disabled: 'State', isLoading: 'State', label: 'Layout', name: 'Identification' },
  Textarea: {
    name: 'Basics',
    placeholder: 'Basics',
    value: 'Basics',
    defaultValue: 'Basics',
    minHeight: 'Sizing & Layout',
    maxHeight: 'Sizing & Layout',
    disabled: 'Accessibility',
    readOnly: 'Accessibility',
    autoFocus: 'Accessibility',
    resize: 'Behavior',
    rows: 'Sizing & Layout',
    dynamicHeightAdjustment: 'Behavior',
    variant: 'Styling',
    color: 'Styling',
    maxLength: 'Behavior',
    styles: 'Styling',
  },
  Truncate: { lines: 'Truncation', styles: 'Appearance' },
  Typography: {
    variant: 'Appearance',
    as: 'Behavior',
    size: 'Appearance',
    align: 'Layout',
    color: 'Appearance',
    styleVariant: 'Appearance',
  },
} as const;

/** Preserve the semantic control sections defined by the corresponding React story. */
export function sectionedArgTypes<
  Component extends keyof typeof reactArgTypeSections,
  ArgTypes extends Record<string, ArgType>,
>(component: Component, argTypes: ArgTypes): ArgTypes {
  const sections = reactArgTypeSections[component] as Partial<Record<keyof ArgTypes, string>>;
  return Object.fromEntries(
    Object.entries(argTypes).map(([name, argType]) => {
      const category = sections[name];
      return [name, category ? { ...argType, table: { ...argType.table, category } } : argType];
    })
  ) as ArgTypes;
}

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

  return `${markup.join('\n\n')}\n\n<script type="module">\n${setup
    .map((line) => (line ? `  ${line}` : ''))
    .join('\n')}\n</script>`;
}

/** Use the same property-based theme contract as application consumers. */
export function element<T extends Tag>(tag: T, props: Partial<HTMLElementTagNameMap[T]> = {}, text = '') {
  const node = document.createElement(tag);
  Object.assign(node, { theme: defaultTheme as DesignCoreTheme }, props);
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
