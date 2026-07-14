import { useState, useCallback, PropsWithChildren } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Rating, RatingProps } from '@components';
import { defaultTheme } from '@tokens';
import {
  maxValueCustom10Actions,
  preSelectedValueActions,
  readOnlyActions,
  withCustomOnChangeControlActions,
} from './Rating.stories.play';

const meta = {
  title: 'Molecules/Rating',
  component: Rating,
  tags: ['autodocs', 'ecommerce'],
  argTypes: {
    max: {
      description: 'Maximum rating value that can be selected',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '5' },
      },
    },
    value: {
      description: 'Current rating value',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    readOnly: {
      description: 'When true, rating becomes non-interactive',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onChange: {
      description: 'Callback function triggered when rating changes',
      table: {
        type: { summary: '(value: number) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    styles: {
      description: 'CSS properties applied to the rating container',
      table: {
        type: { summary: 'React.CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    size: {
      description: 'Size variant of the rating component',
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: '"md"' },
      },
    },
    alignItems: {
      description: 'Alignment of rating items within container',
      table: {
        type: { summary: '"start" | "center" | "end"' },
        defaultValue: { summary: '"center"' },
      },
    },
    gap: {
      description: 'Space between rating items',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: '8' },
      },
    },
    color: {
      description: 'Color scheme for rating items',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"primary"' },
      },
    },
    className: {
      description: 'Additional CSS class names',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Rating\` component is a versatile UI element used to gather feedback or display evaluation scores through numeric or symbolic ratings (e.g., stars).
<br/>
It is designed to enhance user experience by providing an intuitive and interactive way to review or visualize ratings within an application.
<br/>
<br/>
<h3>Key features include:</h3>
<ul>
<li>
<b>Customizable Rating Scale</b> – Supports configuring the maximum rating value (e.g., 5 stars, 10 points), making it adaptable for various use cases like product reviews or detailed evaluations.
</li>
<li>
<b>Interactive Ratings</b> – Allows users to select their rating dynamically by interacting with symbols, offering hover and focus states for guidance.
</li>
<li>
<b>Read-Only Mode</b> – Displays static, non-interactive ratings for scenarios such as showing aggregated review values, ideal for dashboards or product listings.
</li>
<li>
<b>Custom Symbols</b> – Supports customizable icons or emojis (e.g., hearts, thumbs, etc.) to better align with application design and branding requirements.
</li>
<li>
<b>Partial Ratings</b> – Enable fractional ratings for more precision, such as 4.5 stars or 7.8 points, automatically rounded based on configuration.
</li>
<li>
<b>Real-Time Feedback</b> – Offers immediate visual feedback during user interaction, improving the rating selection experience by conveying their current selection dynamically.
</li>
<li>
<b>Style Customization</b> – Fully customizable styles, including overrides for colors, spacing, animations, and layout, ensuring seamless integration with your design system.
</li>
<li>
<b>Accessibility-Focused</b> – Built with accessibility in mind, supporting keyboard navigation and screen reader descriptions for a more inclusive user interface.
</li>
<li>
<b>Pre-Selected and Default States</b> – Define initial ratings or pre-selected values to guide users or provide a default suggestion for the rating.
</li>
</ul>
<br/>
<h3>Layout Props:</h3>
<ul>
<li><b>Spacing</b>
<ul>
<li>Gap between rating items</li>
<li>Padding around container</li>
</ul>
</li>
<li><b>Dimensions</b>
<ul>
<li>Size variants affect item dimensions</li>
<li>Responsive scaling</li>
</ul>
</li>
<li><b>Alignment</b> - Horizontal layout with customizable alignment</li>
</ul>
        `,
      },
    },
  },
} as Meta<typeof Rating>;

export default meta;
const Template: StoryFn<PropsWithChildren<RatingProps>> = (args) => <Rating {...args} />;

export const PreSelectedValue = Template.bind({});
PreSelectedValue.args = {
  max: 5,
  value: 3,
  readOnly: false,
};
PreSelectedValue.play = preSelectedValueActions;

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  max: 5,
  value: 3.5,
  readOnly: true,
};
ReadOnly.play = readOnlyActions;

export const MaxValueCustom10 = Template.bind({});
MaxValueCustom10.args = {
  max: 10,
  value: 3,
  readOnly: false,
};
MaxValueCustom10.play = maxValueCustom10Actions;

export const WithCustomOnChangeControl: StoryFn<RatingProps> = (arg) => {
  const [value, setValue] = useState(0);
  const handleRatingChange = useCallback((newValue: number) => {
    action('Rating Changed')(newValue);
    setValue(newValue);
  }, []);

  return <Rating {...arg} value={value} onChange={handleRatingChange} />;
};
WithCustomOnChangeControl.play = withCustomOnChangeControlActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ rating: defaultTheme.rating }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
