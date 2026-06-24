import { PropsWithChildren } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Typography, Button, Row, Column } from '@components';
import { LayoutType, TypographyVariant } from '@types';
import { defaultTheme } from '@tokens';

import { Carousel } from './Carousel';
import { CarouselProps } from './Carousel.types';
import {
  defaultActions,
  layoutVerticalActions,
  withCustomContentActions,
  withNavigationDotsActions,
  withoutNavigationArrowsActions,
} from './Carousel.stories.play';

const meta: Meta<typeof Carousel> = {
  title: 'Organisms/Carousel',
  component: Carousel,
  args: {},
  argTypes: {
    layout: {
      description: 'Determines the scroll direction of the carousel',
      table: {
        type: { summary: 'LayoutType' },
        defaultValue: { summary: 'LayoutType.Horizontal' },
      },
    },
    showArrows: {
      description: 'Controls the visibility of navigation arrows',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showDots: {
      description: 'Controls the visibility of navigation dots',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      description: 'Content to be displayed within carousel slides',
      table: {
        type: { summary: 'ReactNode[]' },
      },
    },
  },
  tags: ['autodocs', 'ecommerce'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Carousel\` component is a highly flexible UI element designed for displaying a series of content in a scrollable container.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Layout Options</b>
  <ul>
  <li>Horizontal scrolling</li>
  <li>Vertical scrolling</li>
  <li>Responsive design</li>
  </ul>
  </li>
  <li>
  <b>Navigation Controls</b>
  <ul>
  <li>Arrow navigation</li>
  <li>Dot indicators</li>
  <li>Touch/swipe support</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – ARIA attributes and keyboard navigation</li>
  <li><b>Customization</b> – Flexible styling and layout options</li>
  <li><b>Content Support</b> – Images, custom components, mixed content</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width/height</code>: Container size</li>
  <li><code>slideWidth/slideHeight</code>: Individual slide dimensions</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>gap</code>: Space between slides</li>
  <li><code>padding</code>: Internal spacing</li>
  <li><code>margin</code>: External spacing</li>
  </ul>
  </li>
  <li><code>overflow</code>: Slide overflow behavior</li>
  </ul>
        `,
      },
    },
  },
};

export default meta;
const Template: StoryFn<PropsWithChildren<CarouselProps>> = (args) => <Carousel {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: [
    <Carousel.Slide key="slide-1">
      <Carousel.Image src="https://picsum.photos/1200/280?random=1" />
    </Carousel.Slide>,
    <Carousel.Slide key="slide-2">
      <Carousel.Image src="https://picsum.photos/1200/280?random=2" />
    </Carousel.Slide>,
  ],
};
Default.play = defaultActions;

export const LayoutHorizontal = Template.bind({});
LayoutHorizontal.args = {
  layout: LayoutType.Horizontal,
  children: [
    <Carousel.Slide key="slide-1">
      <Carousel.Image src="https://picsum.photos/1200/280?random=3" />
    </Carousel.Slide>,
    <Carousel.Slide key="slide-2">
      <Carousel.Image src="https://picsum.photos/1200/280?random=4" />
    </Carousel.Slide>,
  ],
};

export const LayoutVertical = Template.bind({});
LayoutVertical.args = {
  layout: LayoutType.Vertical,
  styles: {
    height: '280px',
  },
  children: [
    <Carousel.Slide key="slide-1">
      <Carousel.Image src="https://picsum.photos/1200/280?random=5" />
    </Carousel.Slide>,
    <Carousel.Slide key="slide-2">
      <Carousel.Image src="https://picsum.photos/1200/280?random=6" />
    </Carousel.Slide>,
  ],
};
LayoutVertical.play = layoutVerticalActions;

export const WithoutNavigationArrows = Template.bind({});
WithoutNavigationArrows.args = {
  showArrows: false,
  children: [
    <Carousel.Slide key="slide-1">
      <Carousel.Image src="https://picsum.photos/1200/280?random=7" />
    </Carousel.Slide>,
    <Carousel.Slide key="slide-2">
      <Carousel.Image src="https://picsum.photos/1200/280?random=8" />
    </Carousel.Slide>,
  ],
};
WithoutNavigationArrows.play = withoutNavigationArrowsActions;

export const WithNavigationDots = Template.bind({});
WithNavigationDots.args = {
  showDots: true,
  children: [
    <Carousel.Slide key="slide-1">
      <Carousel.Image src="https://picsum.photos/1200/280?random=9" />
    </Carousel.Slide>,
    <Carousel.Slide key="slide-2">
      <Carousel.Image src="https://picsum.photos/1200/280?random=10" />
    </Carousel.Slide>,
  ],
};
WithNavigationDots.play = withNavigationDotsActions;

export const ResponsiveBehavior = Template.bind({});
ResponsiveBehavior.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
};
ResponsiveBehavior.args = {
  children: [
    <Carousel.Slide key="slide-1">
      <Carousel.Image src="https://picsum.photos/1200/280?random=11" />
    </Carousel.Slide>,
    <Carousel.Slide key="slide-2">
      <Carousel.Image src="https://picsum.photos/1200/280?random=12" />
    </Carousel.Slide>,
  ],
};

export const WithCustomContent = Template.bind({});
WithCustomContent.args = {
  children: [
    <Row justify="center" align="center" key="slide-1">
      <Column align="center">
        <Typography variant={TypographyVariant.H2}>Title</Typography>
        <Typography variant={TypographyVariant.Body1}>Text</Typography>
        <Button>More Info</Button>
      </Column>
    </Row>,
    <Carousel.Slide key="slide-2">
      <Carousel.Image src="https://picsum.photos/1200/280?random=13" />
    </Carousel.Slide>,
    <Carousel.Slide key="slide-3">
      <Carousel.Image src="https://picsum.photos/1200/280?random=14" />
    </Carousel.Slide>,
  ],
};
WithCustomContent.play = withCustomContentActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ carousel: defaultTheme.carousel }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
