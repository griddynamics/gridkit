import type { BoxStyleValue, LayoutStyles } from '../src';

export interface BoxStoryArgs {
  display?: BoxStyleValue;
  overflow?: BoxStyleValue;
  border?: BoxStyleValue;
  minWidth?: BoxStyleValue;
  width?: BoxStyleValue;
  maxWidth?: BoxStyleValue;
  minHeight?: BoxStyleValue;
  height?: BoxStyleValue;
  maxHeight?: BoxStyleValue;
  margin?: BoxStyleValue;
  marginTop?: BoxStyleValue;
  marginRight?: BoxStyleValue;
  marginBottom?: BoxStyleValue;
  marginLeft?: BoxStyleValue;
  padding?: BoxStyleValue;
  paddingTop?: BoxStyleValue;
  paddingRight?: BoxStyleValue;
  paddingBottom?: BoxStyleValue;
  paddingLeft?: BoxStyleValue;
  zIndex?: BoxStyleValue;
  position?: BoxStyleValue;
  top?: BoxStyleValue;
  right?: BoxStyleValue;
  bottom?: BoxStyleValue;
  left?: BoxStyleValue;
  flexDirection?: BoxStyleValue;
  justifyContent?: BoxStyleValue;
  justifySelf?: BoxStyleValue;
  alignItems?: BoxStyleValue;
  alignSelf?: BoxStyleValue;
  alignContent?: BoxStyleValue;
  flexWrap?: BoxStyleValue;
  flex?: BoxStyleValue;
  flexGrow?: BoxStyleValue;
  flexShrink?: BoxStyleValue;
  flexBasis?: BoxStyleValue;
  order?: BoxStyleValue;
  gap?: BoxStyleValue;
  styles?: LayoutStyles;
}

const groups = {
  'Layout & Sizing': ['minWidth', 'width', 'maxWidth', 'minHeight', 'height', 'maxHeight'],
  Spacing: [
    'margin',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'padding',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
  ],
  Flexbox: [
    'flexDirection',
    'justifyContent',
    'justifySelf',
    'alignItems',
    'alignSelf',
    'alignContent',
    'flexWrap',
    'flex',
    'flexGrow',
    'flexShrink',
    'flexBasis',
    'order',
    'gap',
  ],
  'Position & Display': ['display', 'overflow', 'border', 'zIndex', 'position', 'top', 'right', 'bottom', 'left'],
} as const;

export const boxArgTypes = Object.fromEntries(
  Object.entries(groups).flatMap(([group, properties]) =>
    properties.map((propertyName) => [
      propertyName,
      {
        control: propertyName === 'display' ? 'select' : 'text',
        ...(propertyName === 'display' ? { options: ['block', 'flex', 'inline', 'inline-flex', 'grid', 'none'] } : {}),
        description: `CSS ${propertyName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)} property`,
        table: { category: `Box Styles - ${group}`, type: { summary: 'string | number' } },
      },
    ])
  )
);

boxArgTypes.styles = {
  control: 'object',
  description: 'Custom CSS styles applied last, after component and Box styles',
  table: { category: 'Custom Styling', type: { summary: 'CSSProperties' } },
};

export const flexElementArgTypes = {
  align: {
    control: 'select',
    options: ['start', 'center', 'end', 'stretch', 'flex-start', 'flex-end'],
    description: 'Cross-axis alignment of items',
    table: { category: 'Box Styles - Flexbox', defaultValue: { summary: 'stretch' } },
  },
  justify: {
    control: 'select',
    options: ['start', 'center', 'end', 'between', 'around', 'flex-start', 'flex-end', 'space-between', 'space-around'],
    description: 'Main-axis distribution of items',
    table: { category: 'Box Styles - Flexbox', defaultValue: { summary: 'start' } },
  },
  gutter: {
    control: 'text',
    description: 'Space between child elements; numbers are converted to pixels',
    table: { category: 'Box Styles - Flexbox', defaultValue: { summary: '0' }, type: { summary: 'number | string' } },
  },
  isWrap: {
    control: 'boolean',
    description: 'Enable wrapping of child elements',
    table: { category: 'Box Styles - Flexbox', defaultValue: { summary: 'true' } },
  },
  isReversed: {
    control: 'boolean',
    description: 'Reverse the visual order of child elements',
    table: { category: 'Box Styles - Flexbox', defaultValue: { summary: 'false' } },
  },
} as const;

export const formattedSource = (code: string) => ({
  docs: {
    source: {
      code: code.trim(),
      language: 'html',
      transform: (source: string) => source,
    },
  },
});
