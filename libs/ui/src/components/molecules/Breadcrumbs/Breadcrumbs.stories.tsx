import { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Icon, Link, Typography } from '@components';
import { LinkVariant, TypographyVariant } from '@types';
import { defaultTheme } from '@tokens';
import { Breadcrumbs, BreadcrumbsProps } from './';
import {
  defaultActions,
  withStartItemLinkIconActions,
  withStringSeparatorAndAfterLastItemActions,
} from './Breadcrumbs.stories.play';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Molecules/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  argTypes: {
    // Content & Items
    items: {
      description: 'Array of breadcrumb items to be displayed',
      control: 'object',
      table: {
        category: 'Content & Items',
        defaultValue: { summary: '[]' },
      },
    },
    separator: {
      description: 'Custom separator between breadcrumb items',
      control: 'text',
      table: {
        category: 'Content & Items',
        defaultValue: { summary: '/' },
      },
    },
    itemStart: {
      description: 'Custom component to be displayed before the first item',
      control: 'object',
      table: {
        category: 'Content & Items',
      },
    },
    itemEnd: {
      description: 'Custom component to be displayed after the last item',
      control: 'object',
      table: {
        category: 'Content & Items',
      },
    },
    separatorAfterLastItem: {
      description: 'Controls whether to show separator after the last item',
      control: 'boolean',
      table: {
        category: 'Content & Items',
        defaultValue: { summary: 'false' },
      },
    },
    // Appearance
    bordered: {
      description: 'Adds border styling to the breadcrumbs',
      control: 'boolean',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      description: 'Additional CSS class name',
      control: 'text',
      table: {
        category: 'Appearance',
      },
    },
    styles: {
      description: 'Custom styles object for the breadcrumbs',
      control: 'object',
      table: {
        category: 'Appearance',
        type: { summary: 'BoxCssComponentProps<HTMLDivElement>' },
      },
    },
    // Accessibility
    ariaLabel: {
      description: 'Accessibility label for the breadcrumbs navigation',
      control: 'text',
      table: {
        category: 'Accessibility',
        defaultValue: { summary: 'breadcrumb' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Breadcrumbs\` component is a flexible and reusable UI element designed to display a breadcrumb navigation trail with various customization options. This component helps users understand their current location within a website's hierarchy and provides easy navigation.
<br/>
<br/>
It supports custom separators, start and end icons and dynamic items, allowing for a highly customizable breadcrumb experience.
<br/>
<br/>
<h3>Key features include:</h3>
<ul>
<li>
<b>Customizable Separators</b>: Accepts a separator prop, which can be a string or a React element, to be displayed between breadcrumb items.
</li>
<li>
<b>Start and End items</b>: Supports itemStart and itemEnd props to display custom component, it might be Icon, Link or any complex component before the first item and after the last item.
</li>
<li>
<b>Dynamic Items</b>: Accepts an array of items, which can be strings, React elements or a combination of both.
</li>
<li>
<b>Last Item Separator</b>: Controls whether the separator is displayed after the last item using the separatorAfterLastItem prop.
</li>
<li>
<b>Accessibility</b>: Includes an aria-label attribute for accessibility with default value "breadcrumb".
</li>
<li>
<b>Styling</b>: Allows for basic styling customization via className or styles props, with support for hover effects and other interactive styles. Optional border styling using the bordered prop.
</li>
</ul>
        `,
      },
    },
  },
};

export default meta;
const Template: StoryFn<BreadcrumbsProps> = (args) => <Breadcrumbs {...args} />;

const linkAction = action('Breadcrumb item clicked');
const itemsList = [
  <Typography as="div" variant={TypographyVariant.Caption}>
    <Link onClick={fn(() => linkAction('Home'))}>Home</Link>
  </Typography>,
  <Typography as="div" variant={TypographyVariant.Caption}>
    <Link onClick={fn(() => linkAction('Products'))}>Products</Link>
  </Typography>,
  <Typography as="div" variant={TypographyVariant.Caption}>
    <Link onClick={fn(() => linkAction('Category'))}>Category</Link>
  </Typography>,
  <Typography as="div" variant={TypographyVariant.Caption}>
    <Link disabled>Product</Link>
  </Typography>,
];
export const Default = Template.bind({});
Default.args = {
  items: itemsList,
};
Default.play = defaultActions;

export const WithStringSeparatorAndAfterLastItem = Template.bind({});
WithStringSeparatorAndAfterLastItem.args = {
  items: itemsList,
  separator: '/',
  separatorAfterLastItem: true,
};
WithStringSeparatorAndAfterLastItem.play = withStringSeparatorAndAfterLastItemActions;

export const WithIconSeparator = Template.bind({});
WithIconSeparator.args = {
  items: itemsList,
  separator: <Icon name="arrowRight" size="xs" />,
};

export const WithStartItemLinkIcon = Template.bind({});
WithStartItemLinkIcon.args = {
  items: [...itemsList].splice(1),
  separator: <Icon name="arrowRight" size="xs" />,
  itemStart: (
    <Link variant={LinkVariant.Inherit} onClick={fn(() => linkAction('Home'))}>
      <Icon name="info" />
    </Link>
  ),
};
WithStartItemLinkIcon.play = withStartItemLinkIconActions;

export const WithEndItemLinkIconAndAfterLastItem = Template.bind({});
WithEndItemLinkIconAndAfterLastItem.args = {
  items: itemsList,
  separator: <Icon name="arrowRight" size="xs" />,
  separatorAfterLastItem: true,
  itemEnd: (
    <Link variant={LinkVariant.Inherit} onClick={fn(() => linkAction('End Item'))}>
      <Icon name="warning" />
    </Link>
  ),
};

export const WithBorder = Template.bind({});
WithBorder.args = {
  items: [...itemsList].splice(1),
  separator: <Icon name="arrowRight" size="xs" />,
  bordered: true,
  itemStart: (
    <Link variant={LinkVariant.Inherit} onClick={fn(() => linkAction('Home'))}>
      <Icon name="star" />
    </Link>
  ),
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ breadcrumbs: defaultTheme.breadcrumbs }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
