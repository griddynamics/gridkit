const slotNames = {
  children: 'default',
  iconStart: 'icon-start',
  iconEnd: 'icon-end',
  adornmentStart: 'adornment-start',
  adornmentEnd: 'adornment-end',
  initiator: 'initiator',
  content: 'content',
  emptyItemsResult: 'empty-items-result',
  fallbackComponent: 'fallback',
  placeholder: 'placeholder',
};

const eventNames = {
  onClick: 'click',
  onBlur: 'blur',
  onFocus: 'focus',
  onKeyDown: 'keydown',
  onChange: 'gd-change',
  onValueChange: 'gd-change',
  onCounterChange: 'gd-change',
  onDotClick: 'gd-change',
  onSelect: 'gd-change',
};

function translateString(value) {
  return value
    .replaceAll('React.CSSProperties', 'Partial<CSSStyleDeclaration>')
    .replaceAll('CSSProperties', 'Partial<CSSStyleDeclaration>')
    .replaceAll('ReactNode', 'Node | string')
    .replaceAll('ReactElement', 'Element')
    .replaceAll('ElementType', 'keyof HTMLElementTagNameMap')
    .replace(/(?:React\.)?(?:Change|Focus|Keyboard|Mouse)Event<[^>]+>/g, 'Event')
    .replaceAll('React.MouseEvent', 'MouseEvent')
    .replaceAll('ReactEventHandler', 'EventListener')
    .replace(/React components?/gi, 'custom elements')
    .replace(/React elements?/gi, 'DOM elements')
    .replace(/React content/gi, 'slotted content')
    .replace(/React nodes?/gi, 'DOM nodes')
    .replace(/Tailwind CSS|Tailwind/g, 'utility CSS')
    .replaceAll('keyof HTMLElementTagNameMap | keyof HTMLElementTagNameMap', 'keyof HTMLElementTagNameMap');
}

function translateValue(value) {
  if (typeof value === 'string') return translateString(value);
  if (Array.isArray(value)) return value.map(translateValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, translateValue(child)]));
}

function slotArgType(source, slot) {
  const label = slot === 'default' ? 'default slot' : `slot="${slot}"`;
  return {
    ...source,
    description: `${translateString(
      source.description ?? 'Content rendered by the component.'
    )} Web Components provide this content through the ${label}.`,
    control: { disable: true },
    type: { name: 'other', value: label },
    table: {
      ...source.table,
      type: { summary: label },
    },
  };
}

function eventArgType(source, eventName) {
  const custom = eventName.startsWith('gd-');
  const type = custom ? `CustomEvent dispatched as "${eventName}"` : `native "${eventName}" event`;
  return {
    ...source,
    description: `${translateString(
      source.description ?? 'Event notification.'
    )} Listen for the ${type} with addEventListener().`,
    control: { disable: true },
    type: { name: 'function', value: custom ? 'EventListener<CustomEvent>' : 'EventListener' },
    table: {
      ...source.table,
      type: { summary: custom ? `CustomEvent ("${eventName}")` : `Event ("${eventName}")` },
    },
  };
}

export function translateStorybookMetadata(metadata) {
  return Object.fromEntries(
    Object.entries(metadata).map(([component, argTypes]) => [
      component,
      Object.fromEntries(
        Object.entries(argTypes).map(([name, raw]) => {
          const source = translateValue(raw);
          if (slotNames[name]) return [name, slotArgType(source, slotNames[name])];
          if (eventNames[name]) return [name, eventArgType(source, eventNames[name])];
          if (name === 'WrapperView' || name === 'as' || name.endsWith('As')) {
            source.description = `${
              source.description ?? 'Rendered element.'
            } Use a native HTML tag name in the Web Component API.`;
            source.table = { ...source.table, type: { summary: 'keyof HTMLElementTagNameMap' } };
          }
          return [name, source];
        })
      ),
    ])
  );
}
