import { PropsWithChildren } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { SizeVariant, TypographyStyleVariant } from '@types';
import { Column, List, Typography } from '@components';

import { InlineNotification, InlineNotificationProps } from './';
import { COMPONENT_NAME } from './constants';
import {
  defaultInlineNotificationActions,
  errorInlineNotificationActions,
  infoInlineNotificationActions,
  successInlineNotificationActions,
  warningInlineNotificationActions,
  withCustomContentActions,
} from './InlineNotification.stories.play';

const meta: Meta<typeof InlineNotification> = {
  title: 'Molecules/Inline Notification',
  component: InlineNotification,
  argTypes: {
    variant: {
      description: 'The visual style variant of the notification',
      table: {
        defaultValue: { summary: 'info' },
        type: { summary: "'info' | 'success' | 'warning' | 'error'" },
      },
    },
    children: {
      description: 'The content to be displayed within the notification',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`InlineNotification\` component is a versatile element for displaying contextual messages and notifications.
<br/>
<br/>
<h3>Key Features:</h3>
<ul>
<li>
<b>Message Variants</b>
<ul>
<li>Success - Positive confirmations</li>
<li>Error - Error messages and failures</li>
<li>Warning - Cautionary notices</li>
<li>Info - Informational messages</li>
</ul>
</li>
<li>
<b>Content Flexibility</b>
<ul>
<li>Simple text messages</li>
<li>Complex content with custom components</li>
<li>Lists and structured information</li>
</ul>
</li>
<li><b>Accessibility</b> – ARIA attributes for screen readers</li>
<li><b>Theming</b> – Customizable colors and styles</li>
<li><b>Responsive Layout</b> – Adapts to container width</li>
</ul>
<br/>
<h3>Layout Props:</h3>
<ul>
<li><b>Spacing</b>
<ul>
<li><code>margin</code>: Overall spacing</li>
<li><code>padding</code>: Internal spacing</li>
</ul>
</li>
<li><b>Display</b>
<ul>
<li>Inline block layout</li>
<li>Flexible width adaptation</li>
</ul>
</li>
</ul>`,
      },
    },
  },
};

export default meta;
const Template: StoryFn<PropsWithChildren<InlineNotificationProps>> = (args) => <InlineNotification {...args} />;

export const InfoInlineNotification = Template.bind({});
InfoInlineNotification.args = {
  children: `Info ${COMPONENT_NAME}`,
  variant: 'info',
};
InfoInlineNotification.play = infoInlineNotificationActions;

export const SuccessInlineNotification = Template.bind({});
SuccessInlineNotification.args = {
  children: `Success ${COMPONENT_NAME}`,
  variant: 'success',
};
SuccessInlineNotification.play = successInlineNotificationActions;

export const WarningInlineNotification = Template.bind({});
WarningInlineNotification.args = {
  children: `Warning ${COMPONENT_NAME}`,
  variant: 'warning',
};
WarningInlineNotification.play = warningInlineNotificationActions;

export const ErrorInlineNotification = Template.bind({});
ErrorInlineNotification.args = {
  children: `Error ${COMPONENT_NAME}`,
  variant: 'error',
};
ErrorInlineNotification.play = errorInlineNotificationActions;

export const DefaultInlineNotification = Template.bind({});
DefaultInlineNotification.args = {
  children: `Default ${COMPONENT_NAME}`,
};
DefaultInlineNotification.play = defaultInlineNotificationActions;

export const WithCustomContent: StoryFn = () => {
  const items = ['Check your email for the instructions', 'Update outdated information', 'Contact your administrator'];
  return (
    <InlineNotification>
      <Column>
        <Typography>Actions Required!</Typography>
        <List
          variant="unordered-dot"
          items={items.map((item) => (
            <Typography styleVariant={TypographyStyleVariant.Small} size={SizeVariant.Xs}>
              {item}
            </Typography>
          ))}
        />
      </Column>
    </InlineNotification>
  );
};
WithCustomContent.play = withCustomContentActions;

export const DefaultTokens: StoryFn = () => (
  <TokenViewer tokens={{ inlineNotification: defaultTheme.inlineNotification }} />
);
DefaultTokens.parameters = {
  layout: 'padded',
};
