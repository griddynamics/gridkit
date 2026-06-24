import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { TokenViewer } from '@stories/components/TokenViewer';
import { Row, Column, Typography } from '@components';
import { TypographyVariant } from '@types';
import { defaultTheme } from '@tokens';
import { Price } from './Price';
import {
  defaultActions,
  withOldPriceActions,
  customClassActions,
  withDecimalsActions,
  largePriceActions,
  freePriceActions,
  europeanConventionActions,
  europeanLargePriceActions,
} from './Price.stories.play';

const meta: Meta<typeof Price> = {
  title: 'Molecules/Price',
  component: Price,

  tags: ['autodocs', 'ecommerce'],
  parameters: {
    docs: {
      description: {
        component: `
  The \`Price\` component is a specialized UI element for displaying price information in e-commerce applications.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Price Display</b>
  <ul>
  <li>Displays current price prominently</li>
  <li>Optional old price with strikethrough styling</li>
  <li>Flexible formatting for different currencies</li>
  </ul>
  </li>
  <li>
  <b>Currency Formatting</b>
  <ul>
  <li>US convention: symbol before value — <code>$99.99</code></li>
  <li>EU convention: symbol after value with space — <code>99,99 €</code></li>
  <li>Controlled via <code>currencySymbolPosition</code> prop (<code>"before"</code> | <code>"after"</code>)</li>
  </ul>
  </li>
  <li>
  <b>Styling</b>
  <ul>
  <li>Themed color variants</li>
  <li>Customizable through className prop</li>
  <li>Responsive text sizing</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – Semantic markup for price information</li>
  <li><b>Theming</b> – Consistent styling with design system</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Spacing</b>
  <ul>
  <li>Automatic spacing between prices</li>
  <li>Configurable margins through className</li>
  </ul>
  </li>
  <li><b>Typography</b>
  <ul>
  <li>Predefined font sizes for prices</li>
  <li>Semantic text hierarchy</li>
  </ul>
  </li>
  </ul>
          `,
      },
    },
  },
  argTypes: {
    // Price Data
    currentValue: {
      control: 'text',
      description:
        'Current price value to be displayed. Pre-format according to locale: US `"29.99"` or `"1,299"`; EU `"29,99"` or `"1 299"`.',
      table: {
        category: 'Price Data',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    oldValue: {
      control: 'text',
      description: 'Optional original price shown with strikethrough. Same format rules as `currentValue`.',
      table: {
        category: 'Price Data',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // Currency
    currencySymbol: {
      control: 'text',
      description:
        'Currency symbol (e.g. `"$"`, `"€"`, `"£"`, `"zł"`). Position is controlled by `currencySymbolPosition`.',
      table: {
        category: 'Currency',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    currencySymbolPosition: {
      control: 'radio',
      options: ['before', 'after'],
      description:
        'Where the currency symbol appears relative to the value. ' +
        '`"before"` (default): symbol precedes the value — e.g. `$99.99`. ' +
        '`"after"`: symbol follows the value with a space — e.g. `99,99 €`. Use `"after"` for European locales.',
      table: {
        category: 'Currency',
        type: { summary: "'before' | 'after'" },
        defaultValue: { summary: "'before'" },
      },
    },

    // Styling
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
      table: {
        category: 'Styling',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size variant controlling font size of the price display',
      table: {
        category: 'Styling',
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: '"md"' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Price>;

export const Default: Story = {
  args: {
    currentValue: '100',
    currencySymbol: '$',
  },
};
Default.play = defaultActions;

export const WithOldPrice: Story = {
  args: {
    currentValue: '100',
    oldValue: '150',
    currencySymbol: '$',
  },
};
WithOldPrice.play = withOldPriceActions;

export const CustomClass: Story = {
  args: {
    currentValue: '100',
    currencySymbol: '$',
    className: 'custom-class',
  },
};
CustomClass.play = customClassActions;

export const WithDecimals: Story = {
  args: {
    currentValue: '99.99',
    oldValue: '129.99',
    currencySymbol: '$',
  },
};
WithDecimals.play = withDecimalsActions;

export const LargePrice: Story = {
  args: {
    currentValue: '1,234.56',
    oldValue: '2,345.67',
    currencySymbol: '$',
  },
};
LargePrice.play = largePriceActions;

export const FreePrice: Story = {
  args: {
    currentValue: 'Free',
    oldValue: '50.00',
    currencySymbol: '$',
  },
};
FreePrice.play = freePriceActions;

/**
 * European convention: currency symbol placed **after** the value with a space.
 * Comma is used as the decimal separator and space as the thousands separator.
 * Example output: `99,99 €`
 */
export const EuropeanConvention: Story = {
  name: 'European Convention (€ after)',
  args: {
    currentValue: '99,99',
    oldValue: '149,99',
    currencySymbol: '€',
    currencySymbolPosition: 'after',
  },
};
EuropeanConvention.play = europeanConventionActions;

/**
 * European large price: space as thousands separator, comma as decimal, symbol after.
 * Example output: `1 299,99 €`
 */
export const EuropeanLargePrice: Story = {
  name: 'European Large Price (1 299,99 €)',
  args: {
    currentValue: '1 299,99',
    oldValue: '1 499,99',
    currencySymbol: '€',
    currencySymbolPosition: 'after',
  },
};
EuropeanLargePrice.play = europeanLargePriceActions;

export const SizeVariants: StoryFn = () => (
  <Column gap="16px">
    <Row gap="16px" alignItems="center">
      <Typography variant={TypographyVariant.Body2}>Small:</Typography>
      <Price currentValue="$99.99" oldValue="$149.99" size="sm" />
    </Row>
    <Row gap="16px" alignItems="center">
      <Typography variant={TypographyVariant.Body2}>Medium (Default):</Typography>
      <Price currentValue="$99.99" oldValue="$149.99" size="md" />
    </Row>
    <Row gap="16px" alignItems="center">
      <Typography variant={TypographyVariant.Body2}>Large:</Typography>
      <Price currentValue="$99.99" oldValue="$149.99" size="lg" />
    </Row>
  </Column>
);
SizeVariants.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story:
        'Price component supports three size variants: `sm`, `md` (default), and `lg`, which control the font size of both current and old price values.',
    },
    source: {
      code: `<Price currentValue="$99.99" oldValue="$149.99" size="sm" />
<Price currentValue="$99.99" oldValue="$149.99" size="md" />
<Price currentValue="$99.99" oldValue="$149.99" size="lg" />`,
    },
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ price: defaultTheme.price }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
