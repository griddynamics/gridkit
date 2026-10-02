// Generated from libs/ui/src/components/atoms/Badge/Badge.stories.tsx. Run npm run generate:web-component-stories.
// Native DOM recipes only: no React runtime or React component implementation is imported.
import { demo, Fragment } from '../native-story';
import { defaultTheme } from 'gd-design-library/tokens';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
const COMPONENT_NAME = 'Badge';
const Badge = 'gd-badge';
const Row = 'Row';
const Column = 'Column';
const Typography = 'gd-typography';
const Icon = 'gd-icon';
const TokenViewer = 'TokenViewer';
const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
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
};
export default meta;
export const Default = {
  args: {
    children: 'Badge',
  },
  parameters: {
    docs: {
      source: {},
    },
  },
};
export const Sizes = {
  render: () =>
    demo(
      Row,
      { gap: '16px', alignItems: 'center' },
      demo(Badge, { size: 'xs' }, 'Extra Small'),
      demo(Badge, { size: 'sm' }, 'Small'),
      demo(Badge, { size: 'md' }, 'Medium'),
      demo(Badge, { size: 'lg' }, 'Large')
    ),
  parameters: {
    docs: {
      description: {
        story: 'Badge component in all available sizes: extra small, small, medium, and large.',
      },
      source: {},
    },
  },
};
export const Variants = {
  render: () =>
    demo(
      Column,
      { gap: '16px' },
      demo(
        Row,
        { gap: '16px', alignItems: 'center' },
        demo(Typography, null, 'Primary:'),
        demo(Badge, null, 'Primary'),
        demo(Badge, { variant: 'primary', appearance: 'filledLight' }, 'Primary Light'),
        demo(Badge, { variant: 'primary', appearance: 'outline' }, 'Primary Outline'),
        demo(Badge, { variant: 'primary', appearance: 'outlineFilledLight' }, 'Primary Outline Filled Light')
      ),
      demo(
        Row,
        { gap: '16px', alignItems: 'center' },
        demo(Typography, null, 'Secondary:'),
        demo(Badge, { variant: 'secondary', appearance: 'filled' }, 'Secondary'),
        demo(Badge, { variant: 'secondary', appearance: 'filledLight' }, 'Secondary Light'),
        demo(Badge, { variant: 'secondary', appearance: 'outline' }, 'Secondary Outline'),
        demo(Badge, { variant: 'secondary', appearance: 'outlineFilledLight' }, 'Secondary Outline Filled Light')
      ),
      demo(
        Row,
        { gap: '16px', alignItems: 'center' },
        demo(Typography, null, 'Tertiary:'),
        demo(Badge, { variant: 'tertiary', appearance: 'filled' }, 'Tertiary'),
        demo(Badge, { variant: 'tertiary', appearance: 'filledLight' }, 'Tertiary Light'),
        demo(Badge, { variant: 'tertiary', appearance: 'outline' }, 'Tertiary Outline'),
        demo(Badge, { variant: 'tertiary', appearance: 'outlineFilledLight' }, 'Tertiary Outline Filled Light')
      ),
      demo(
        Row,
        { gap: '16px', alignItems: 'center' },
        demo(Typography, null, 'Quaternary:'),
        demo(Badge, { variant: 'quaternary', appearance: 'filled' }, 'Quaternary'),
        demo(Badge, { variant: 'quaternary', appearance: 'filledLight' }, 'Quaternary Light'),
        demo(Badge, { variant: 'quaternary', appearance: 'outline' }, 'Quaternary Outline'),
        demo(Badge, { variant: 'quaternary', appearance: 'outlineFilledLight' }, 'Quaternary Outline Filled Light')
      ),
      demo(
        Row,
        { gap: '16px', alignItems: 'center' },
        demo(Typography, null, 'Quinary:'),
        demo(Badge, { variant: 'quinary', appearance: 'filled' }, 'Quinary'),
        demo(Badge, { variant: 'quinary', appearance: 'filledLight' }, 'Quinary Light'),
        demo(Badge, { variant: 'quinary', appearance: 'outline' }, 'Quinary Outline'),
        demo(Badge, { variant: 'quinary', appearance: 'outlineFilledLight' }, 'Quinary Outline Filled Light')
      )
    ),
  parameters: {
    docs: {
      description: {
        story: 'All badge variants and options displayed together.',
      },
      source: {},
    },
  },
};
export const WithIcons = {
  render: () =>
    demo(
      Row,
      { gap: '16px', alignItems: 'center' },
      demo(Badge, { iconStart: demo(Icon, { name: 'success', size: 'md' }) }, 'With Start Icon'),
      demo(Badge, { variant: 'secondary', iconEnd: demo(Icon, { name: 'warning', size: 'md' }) }, 'With End Icon'),
      demo(
        Badge,
        {
          variant: 'tertiary',
          appearance: 'filled',
          iconStart: demo(Icon, { name: 'info', size: 'md' }),
          iconEnd: demo(Icon, { name: 'arrowRight', size: 'md' }),
        },
        'Both Icons'
      ),
      demo(
        Badge,
        { variant: 'quaternary', iconStart: demo(Icon, { name: 'error', size: 'md' }) },
        'Quaternary with Icon'
      ),
      demo(
        Badge,
        { variant: 'quinary', iconStart: demo(Icon, { name: 'accountCircle', size: 'md' }) },
        'Quinary with Icon'
      )
    ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with start and end icons.',
      },
      source: {},
    },
  },
};
export const WithBoxStyles = {
  render: () =>
    demo(
      Row,
      { gap: '16px', alignItems: 'center' },
      demo(Badge, { appearance: 'outline', margin: '8px' }, 'With Margin'),
      demo(Badge, { variant: 'secondary', appearance: 'outline', padding: '12px 24px' }, 'Custom Padding'),
      demo(
        Badge,
        { variant: 'tertiary', appearance: 'outline', width: '200px', justifyContent: 'center' },
        'Fixed Width'
      )
    ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with custom Box styles for layout control.',
      },
      source: {},
    },
  },
};
export const Disabled = {
  render: () =>
    demo(
      Column,
      { gap: '16px' },
      demo(
        Row,
        { gap: '16px', alignItems: 'center' },
        demo(Typography, null, 'All Variants Disabled:'),
        demo(Badge, { variant: 'primary', appearance: 'filled', disabled: true }, 'Primary'),
        demo(Badge, { variant: 'secondary', appearance: 'filled', disabled: true }, 'Secondary'),
        demo(Badge, { variant: 'tertiary', appearance: 'filled', disabled: true }, 'Tertiary'),
        demo(Badge, { variant: 'quaternary', appearance: 'filled', disabled: true }, 'Quaternary'),
        demo(Badge, { variant: 'quinary', appearance: 'filled', disabled: true }, 'Quinary')
      ),
      demo(
        Row,
        { gap: '16px', alignItems: 'center' },
        demo(Typography, null, 'All Appearances Disabled:'),
        demo(Badge, { variant: 'primary', appearance: 'filled', disabled: true }, 'Filled'),
        demo(Badge, { variant: 'primary', appearance: 'filledLight', disabled: true }, 'Filled Light'),
        demo(Badge, { variant: 'primary', appearance: 'outline', disabled: true }, 'Outline'),
        demo(Badge, { variant: 'primary', appearance: 'outlineFilledLight', disabled: true }, 'Outline Filled Light')
      ),
      demo(
        Row,
        { gap: '16px', alignItems: 'center' },
        demo(Typography, null, 'Sizes Disabled:'),
        demo(Badge, { variant: 'primary', appearance: 'filled', size: 'xs', disabled: true }, 'Extra Small'),
        demo(Badge, { variant: 'primary', appearance: 'filled', size: 'sm', disabled: true }, 'Small'),
        demo(Badge, { variant: 'primary', appearance: 'filled', size: 'md', disabled: true }, 'Medium'),
        demo(Badge, { variant: 'primary', appearance: 'filled', size: 'lg', disabled: true }, 'Large'),
        demo(
          Badge,
          {
            variant: 'primary',
            appearance: 'filled',
            disabled: true,
            iconStart: demo(Icon, { name: 'check', size: 'md' }),
          },
          'With Icon'
        )
      )
    ),
  parameters: {
    docs: {
      description: {
        story: 'Badge component in disabled state across all variants, appearances, and sizes.',
      },
      source: {},
    },
  },
};
export const WithAccessibility = {
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
export const DefaultTokens = () => demo(TokenViewer, { tokens: { badge: defaultTheme.badge } });
DefaultTokens.parameters = {
  layout: 'padded',
};
