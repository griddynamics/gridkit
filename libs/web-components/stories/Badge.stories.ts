import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdBadge, GdTypography } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { formattedSource } from './layout-story-helpers';

type Props = Record<string, unknown>;
type Args = Pick<GdBadge, 'variant' | 'appearance' | 'size' | 'disabled' | 'styles'> & {
  children?: string;
  iconStart?: Node;
  iconEnd?: Node;
} & Record<string, unknown>;

// Building blocks composed by the source stories (Row, Column, Typography, Icon).
// `Typography` without a `variant` renders the inherited `span` variant.
const typography = (text: string) => element('gd-typography', { variant: 'span' } as Partial<GdTypography>, text);
const row = (props: Props, ...children: Node[]) => {
  const node = element('gd-row', props);
  node.append(...children);
  return node;
};
const column = (props: Props, ...children: Node[]) => {
  const node = element('gd-column', props);
  node.append(...children);
  return node;
};
const icon = (name: string, slot: 'icon-start' | 'icon-end') => {
  const node = element('gd-icon', { name, size: 'md' } as Partial<HTMLElementTagNameMap['gd-icon']>);
  node.slot = slot;
  return node;
};
const badge = (props: Props, text: string, ...icons: HTMLElement[]) => {
  const node = element('gd-badge', props as Partial<GdBadge>, text);
  node.append(...icons);
  return node;
};

const storyParameters = (description: string | undefined, source: string, extra: Props = {}) => ({
  ...extra,
  docs: { ...formattedSource(source).docs, ...(description ? { description: { story: description } } : {}) },
});

// The Box style arguments are forwarded to the badge root through its `styles` property.
const boxStyleArgTypes = [
  ['display', 'string'],
  ['overflow', 'string'],
  ['minWidth', 'string'],
  ['width', 'string'],
  ['maxWidth', 'string'],
  ['minHeight', 'string'],
  ['height', 'string'],
  ['maxHeight', 'string'],
  ['margin', 'string'],
  ['marginTop', 'string'],
  ['marginRight', 'string'],
  ['marginBottom', 'string'],
  ['marginLeft', 'string'],
  ['padding', 'string'],
  ['paddingTop', 'string'],
  ['paddingRight', 'string'],
  ['paddingBottom', 'string'],
  ['paddingLeft', 'string'],
  ['zIndex', 'string | number'],
  ['position', 'string'],
  ['top', 'string'],
  ['right', 'string'],
  ['bottom', 'string'],
  ['left', 'string'],
  ['flexDirection', 'string'],
  ['justifyContent', 'string'],
  ['justifySelf', 'string'],
  ['alignItems', 'string'],
  ['alignSelf', 'string'],
  ['alignContent', 'string'],
  ['flexWrap', 'string'],
  ['flex', 'string'],
  ['flexGrow', 'string'],
  ['flexShrink', 'string'],
  ['flexBasis', 'string'],
  ['order', 'string'],
  ['gap', 'string'],
] as const;
const boxStyleNames: readonly string[] = boxStyleArgTypes.map(([name]) => name);
const boxArgTypes = Object.fromEntries(
  boxStyleArgTypes.map(([name, type]) => [
    name,
    {
      description: `CSS ${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)} property`,
      control: 'text',
      table: { category: 'Box Styles', type: { summary: type } },
    },
  ])
);

const meta = {
  title: 'Atoms/Badge',
  component: 'gd-badge',
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Badge content (text or elements, default slot)',
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'Node' },
      },
    },
    variant: {
      description: 'Visual style variant of the badge',
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary'],
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'primary' },
        type: { summary: 'BadgeVariant' },
      },
    },
    disabled: {
      description: 'Whether the badge is disabled',
      control: { type: 'boolean' },
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    appearance: {
      description: 'Visual appearance/style of the badge (filled, filledLight, outline, outlineFilledLight)',
      control: { type: 'select' },
      options: ['outline', 'outlineFilledLight', 'filled', 'filledLight'],
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'filled' },
        type: { summary: 'BadgeAppearance' },
      },
    },
    size: {
      description: 'Size of the badge (xs, sm, md, lg)',
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'md' },
        type: { summary: 'BadgeSize' },
      },
    },
    iconStart: {
      description: 'Icon element to display at the start of the badge (icon-start slot)',
      control: false,
      table: {
        category: 'Icons',
        type: { summary: 'Node' },
      },
    },
    iconEnd: {
      description: 'Icon element to display at the end of the badge (icon-end slot)',
      control: false,
      table: {
        category: 'Icons',
        type: { summary: 'Node' },
      },
    },

    // Box Styles
    styles: {
      description: 'CSSObject for custom inline styles',
      control: false,
      table: {
        category: 'Box Styles',
        type: { summary: 'CSSObject' },
      },
    },
    ...boxArgTypes,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`Badge\` component is used to display small pieces of information, such as status indicators, counts, or labels.

<h3>Key Features:</h3>
<ul>
<li><b>Variants:</b> Primary, Secondary, Tertiary, Quaternary, Quinary</li>
<li><b>Appearances:</b> Filled, FilledLight, Outline, OutlineFilledLight</li>
<li><b>Sizes:</b> Extra Small (xs), Small (sm), Medium (md), Large (lg)</li>
<li><b>Icons:</b> Support for start and end icons</li>
<li><b>Disabled:</b> Support for disabled state</li>
<li><b>Flexible:</b> Consumes Box styles for full layout control</li>
</ul>
        `,
      },
    },
  },
  render: ({ children, iconStart, iconEnd, styles, ...props }: Args) => {
    const box = Object.fromEntries(
      Object.entries(props).filter(([name, value]) => boxStyleNames.includes(name) && value)
    );
    const own = Object.fromEntries(Object.entries(props).filter(([name]) => !boxStyleNames.includes(name)));
    const node = badge({ ...own, styles: { ...box, ...(styles ?? {}) } }, children ?? '');
    if (iconStart) node.append(iconStart);
    if (iconEnd) node.append(iconEnd);
    return node;
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
  parameters: storyParameters(undefined, `<gd-badge>Badge</gd-badge>`),
};

export const Sizes: Story = {
  render: () =>
    row(
      { gap: '16px', alignItems: 'center' },
      badge({ size: 'xs' }, 'Extra Small'),
      badge({ size: 'sm' }, 'Small'),
      badge({ size: 'md' }, 'Medium'),
      badge({ size: 'lg' }, 'Large')
    ),
  parameters: storyParameters(
    'Badge component in all available sizes: extra small, small, medium, and large.',
    `<gd-row gap="16px" align-items="center">
  <gd-badge size="xs">Extra Small</gd-badge>
  <gd-badge size="sm">Small</gd-badge>
  <gd-badge size="md">Medium</gd-badge>
  <gd-badge size="lg">Large</gd-badge>
</gd-row>`
  ),
};

const variantRow = (
  label: string,
  variant: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary',
  name: string,
  plainFirst = false
) =>
  row(
    { gap: '16px', alignItems: 'center' },
    typography(`${label}:`),
    plainFirst ? badge({}, name) : badge({ variant, appearance: 'filled' }, name),
    badge({ variant, appearance: 'filledLight' }, `${name} Light`),
    badge({ variant, appearance: 'outline' }, `${name} Outline`),
    badge({ variant, appearance: 'outlineFilledLight' }, `${name} Outline Filled Light`)
  );

const variantSource = (variant: string, name: string, plainFirst = false) => `  <gd-row gap="16px" align-items="center">
    <gd-typography variant="span">${name}:</gd-typography>
    ${
      plainFirst
        ? `<gd-badge>${name}</gd-badge>`
        : `<gd-badge variant="${variant}" appearance="filled">${name}</gd-badge>`
    }
    <gd-badge variant="${variant}" appearance="filledLight">${name} Light</gd-badge>
    <gd-badge variant="${variant}" appearance="outline">${name} Outline</gd-badge>
    <gd-badge variant="${variant}" appearance="outlineFilledLight">${name} Outline Filled Light</gd-badge>
  </gd-row>`;

const variantsRender = () =>
  column(
    { gap: '16px' },
    variantRow('Primary', 'primary', 'Primary', true),
    variantRow('Secondary', 'secondary', 'Secondary'),
    variantRow('Tertiary', 'tertiary', 'Tertiary'),
    variantRow('Quaternary', 'quaternary', 'Quaternary'),
    variantRow('Quinary', 'quinary', 'Quinary')
  );

export const Variants: Story = {
  render: variantsRender,
  parameters: storyParameters(
    'All badge variants and options displayed together.',
    `<gd-column gap="16px">
${variantSource('primary', 'Primary', true)}
${variantSource('secondary', 'Secondary')}
${variantSource('tertiary', 'Tertiary')}
${variantSource('quaternary', 'Quaternary')}
${variantSource('quinary', 'Quinary')}
</gd-column>`
  ),
};

export const WithIcons: Story = {
  render: () =>
    row(
      { gap: '16px', alignItems: 'center' },
      badge({}, 'With Start Icon', icon('success', 'icon-start')),
      badge({ variant: 'secondary' }, 'With End Icon', icon('warning', 'icon-end')),
      badge(
        { variant: 'tertiary', appearance: 'filled' },
        'Both Icons',
        icon('info', 'icon-start'),
        icon('arrowRight', 'icon-end')
      ),
      badge({ variant: 'quaternary' }, 'Quaternary with Icon', icon('error', 'icon-start')),
      badge({ variant: 'quinary' }, 'Quinary with Icon', icon('accountCircle', 'icon-start'))
    ),
  parameters: storyParameters(
    'Badges with start and end icons.',
    `<gd-row gap="16px" align-items="center">
  <gd-badge>
    <gd-icon slot="icon-start" name="success" size="md"></gd-icon>
    With Start Icon
  </gd-badge>
  <gd-badge variant="secondary">
    <gd-icon slot="icon-end" name="warning" size="md"></gd-icon>
    With End Icon
  </gd-badge>
  <gd-badge variant="tertiary" appearance="filled">
    <gd-icon slot="icon-start" name="info" size="md"></gd-icon>
    <gd-icon slot="icon-end" name="arrowRight" size="md"></gd-icon>
    Both Icons
  </gd-badge>
  <gd-badge variant="quaternary">
    <gd-icon slot="icon-start" name="error" size="md"></gd-icon>
    Quaternary with Icon
  </gd-badge>
  <gd-badge variant="quinary">
    <gd-icon slot="icon-start" name="accountCircle" size="md"></gd-icon>
    Quinary with Icon
  </gd-badge>
</gd-row>`
  ),
};

export const WithBoxStyles: Story = {
  render: () =>
    row(
      { gap: '16px', alignItems: 'center' },
      badge({ appearance: 'outline', styles: { margin: '8px' } }, 'With Margin'),
      badge({ variant: 'secondary', appearance: 'outline', styles: { padding: '12px 24px' } }, 'Custom Padding'),
      badge(
        {
          variant: 'tertiary',
          appearance: 'outline',
          styles: { width: '200px', justifyContent: 'center' },
        },
        'Fixed Width'
      )
    ),
  parameters: storyParameters(
    'Badges with custom Box styles for layout control.',
    `<gd-row gap="16px" align-items="center">
  <gd-badge appearance="outline" id="margin">With Margin</gd-badge>
  <gd-badge variant="secondary" appearance="outline" id="padding">Custom Padding</gd-badge>
  <gd-badge variant="tertiary" appearance="outline" id="width">Fixed Width</gd-badge>
</gd-row>

<script type="module">
  document.getElementById('margin').styles = { margin: '8px' };
  document.getElementById('padding').styles = { padding: '12px 24px' };
  document.getElementById('width').styles = { width: '200px', justifyContent: 'center' };
</script>`
  ),
};

const disabledRow = (label: string, ...badges: HTMLElement[]) =>
  row({ gap: '16px', alignItems: 'center' }, typography(label), ...badges);
const disabledBadge = (props: Props, text: string, ...icons: HTMLElement[]) =>
  badge({ appearance: 'filled', ...props, disabled: true }, text, ...icons);

export const Disabled: Story = {
  render: () =>
    column(
      { gap: '16px' },
      disabledRow(
        'All Variants Disabled:',
        disabledBadge({ variant: 'primary' }, 'Primary'),
        disabledBadge({ variant: 'secondary' }, 'Secondary'),
        disabledBadge({ variant: 'tertiary' }, 'Tertiary'),
        disabledBadge({ variant: 'quaternary' }, 'Quaternary'),
        disabledBadge({ variant: 'quinary' }, 'Quinary')
      ),
      disabledRow(
        'All Appearances Disabled:',
        disabledBadge({ variant: 'primary', appearance: 'filled' }, 'Filled'),
        disabledBadge({ variant: 'primary', appearance: 'filledLight' }, 'Filled Light'),
        disabledBadge({ variant: 'primary', appearance: 'outline' }, 'Outline'),
        disabledBadge({ variant: 'primary', appearance: 'outlineFilledLight' }, 'Outline Filled Light')
      ),
      disabledRow(
        'Sizes Disabled:',
        disabledBadge({ variant: 'primary', size: 'xs' }, 'Extra Small'),
        disabledBadge({ variant: 'primary', size: 'sm' }, 'Small'),
        disabledBadge({ variant: 'primary', size: 'md' }, 'Medium'),
        disabledBadge({ variant: 'primary', size: 'lg' }, 'Large'),
        disabledBadge({ variant: 'primary' }, 'With Icon', icon('check', 'icon-start'))
      )
    ),
  parameters: storyParameters(
    'Badge component in disabled state across all variants, appearances, and sizes.',
    `<gd-column gap="16px">
  <gd-row gap="16px" align-items="center">
    <gd-typography variant="span">All Variants Disabled:</gd-typography>
    <gd-badge variant="primary" appearance="filled" disabled>Primary</gd-badge>
    <gd-badge variant="secondary" appearance="filled" disabled>Secondary</gd-badge>
    <gd-badge variant="tertiary" appearance="filled" disabled>Tertiary</gd-badge>
    <gd-badge variant="quaternary" appearance="filled" disabled>Quaternary</gd-badge>
    <gd-badge variant="quinary" appearance="filled" disabled>Quinary</gd-badge>
  </gd-row>
  <gd-row gap="16px" align-items="center">
    <gd-typography variant="span">All Appearances Disabled:</gd-typography>
    <gd-badge variant="primary" appearance="filled" disabled>Filled</gd-badge>
    <gd-badge variant="primary" appearance="filledLight" disabled>Filled Light</gd-badge>
    <gd-badge variant="primary" appearance="outline" disabled>Outline</gd-badge>
    <gd-badge variant="primary" appearance="outlineFilledLight" disabled>Outline Filled Light</gd-badge>
  </gd-row>
  <gd-row gap="16px" align-items="center">
    <gd-typography variant="span">Sizes Disabled:</gd-typography>
    <gd-badge variant="primary" appearance="filled" size="xs" disabled>Extra Small</gd-badge>
    <gd-badge variant="primary" appearance="filled" size="sm" disabled>Small</gd-badge>
    <gd-badge variant="primary" appearance="filled" size="md" disabled>Medium</gd-badge>
    <gd-badge variant="primary" appearance="filled" size="lg" disabled>Large</gd-badge>
    <gd-badge variant="primary" appearance="filled" disabled>
      <gd-icon slot="icon-start" name="check" size="md"></gd-icon>
      With Icon
    </gd-badge>
  </gd-row>
</gd-column>`
  ),
};

export const WithAccessibility: Story = {
  ...Variants,
  parameters: {
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
  tags: ['a11y'],
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('badge'),
  parameters: { layout: 'padded' },
};
