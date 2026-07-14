import { ComponentType } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import {
  Column,
  InlineNotification,
  Row,
  type ButtonProps,
  type CardImageProps,
  type CardTextProps,
  type ColumnProps,
  type CounterProps,
  type PriceProps,
  type RatingProps,
  type RowProps,
} from '@components';
import { defaultTheme } from '@tokens';
import type { CardWishlistProps, CardBadgeProps } from './Card.types';

import {
  withVerticalCardActions,
  withHorizontalCardActions,
  myCardWithFallbackImageActions,
} from './Card.stories.play';

import { Card } from './';

const meta: Meta<typeof Card> = {
  title: 'Organisms/Card',
  component: Card,
  tags: ['autodocs', 'ecommerce'],
  argTypes: {
    // Layout & Appearance
    variant: {
      description: 'Layout variant of the card - vertical or horizontal',
      table: {
        category: 'Layout & Appearance',
        defaultValue: { summary: 'vertical' },
        type: { summary: 'CardVariant' },
      },
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
    },
    isBordered: {
      description: 'Adds border styling to the card',
      table: {
        category: 'Layout & Appearance',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      control: { type: 'boolean' },
    },
    isHighlighted: {
      description: 'Applies highlight styling to the card (outline on hover)',
      table: {
        category: 'Layout & Appearance',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      control: { type: 'boolean' },
    },
    withShadowHover: {
      description: 'Adds box shadow on hover for elevation/lift effect',
      table: {
        category: 'Layout & Appearance',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      control: { type: 'boolean' },
    },
    // Spacing & Layout
    gutter: {
      description: 'Space between child elements',
      table: {
        category: 'Spacing & Layout',
        defaultValue: { summary: '0' },
        type: { summary: 'string' },
      },
      control: { type: 'text' },
    },
    padding: {
      description: 'Internal padding of the card',
      table: {
        category: 'Spacing & Layout',
        defaultValue: { summary: '0' },
        type: { summary: 'string' },
      },
      control: { type: 'text' },
    },
    // Dimensions
    width: {
      description: 'Fixed width of the card',
      table: {
        category: 'Dimensions',
        defaultValue: { summary: 'auto' },
        type: { summary: 'string' },
      },
      control: { type: 'text' },
    },
    height: {
      description: 'Fixed height of the card',
      table: {
        category: 'Dimensions',
        defaultValue: { summary: 'auto' },
        type: { summary: 'string' },
      },
      control: { type: 'text' },
    },
    maxWidth: {
      description: 'Maximum width constraint for the card',
      table: {
        category: 'Dimensions',
        defaultValue: { summary: 'none' },
        type: { summary: 'string' },
      },
      control: { type: 'text' },
    },
    maxHeight: {
      description: 'Maximum height constraint for the card',
      table: {
        category: 'Dimensions',
        defaultValue: { summary: 'none' },
        type: { summary: 'string' },
      },
      control: { type: 'text' },
    },
    overflow: {
      description: 'Controls how content overflow is handled',
      table: {
        category: 'Dimensions',
        defaultValue: { summary: 'visible' },
        type: { summary: 'string' },
      },
      control: { type: 'text' },
    },
    // Accessibility
    tabIndex: {
      description: 'Tab index for keyboard navigation',
      table: {
        category: 'Accessibility',
        type: { summary: 'number' },
      },
      control: { type: 'number' },
    },
    // Content
    children: {
      description: 'Card content elements',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
    styles: {
      description: 'Custom styles object for the card',
      control: 'object',
      table: {
        category: 'Appearance',
        type: { summary: 'BoxCssComponentProps<HTMLDivElement>' },
      },
    },

    minWidth: {
      description: 'CSS min-width property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    minHeight: {
      description: 'CSS min-height property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },

    // Box Props - Spacing
    margin: {
      description: 'CSS margin property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    marginTop: {
      description: 'CSS margin-top property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    marginRight: {
      description: 'CSS margin-right property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    marginBottom: {
      description: 'CSS margin-bottom property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    marginLeft: {
      description: 'CSS margin-left property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    paddingTop: {
      description: 'CSS padding-top property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    paddingRight: {
      description: 'CSS padding-right property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    paddingBottom: {
      description: 'CSS padding-bottom property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    paddingLeft: {
      description: 'CSS padding-left property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    // Box Props - Flexbox
    position: {
      description: 'CSS position property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexDirection: {
      description: 'CSS flex-direction property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    justifyContent: {
      description: 'CSS justify-content property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    alignItems: {
      description: 'CSS align-items property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    alignContent: {
      description: 'CSS align-content property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexWrap: {
      description: 'CSS flex-wrap property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flex: {
      description: 'CSS flex property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexGrow: {
      description: 'CSS flex-grow property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexShrink: {
      description: 'CSS flex-shrink property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexBasis: {
      description: 'CSS flex-basis property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    order: {
      description: 'CSS order property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    gap: {
      description: 'CSS gap property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Card\` component is a versatile container UI element designed for displaying related content in a cohesive layout.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Layout Variants</b>
  <ul>
  <li>Vertical - Stack content vertically</li>
  <li>Horizontal - Arrange content horizontally</li>
  </ul>
  </li>
  <li>
  <b>Content Components</b>
  <ul>
  <li>Images with customizable dimensions</li>
  <li>Titles and descriptions</li>
  <li>Price displays with old/new values</li>
  <li>Rating indicators</li>
  <li>Action buttons</li>
  <li>Counter controls</li>
  </ul>
  </li>
  <li><b>Styling Options</b> - Borders, highlights, dimensions</li>
  <li><b>Responsive Layout</b> - Adapts to different screen sizes</li>
  <li><b>Content Organization</b> - Row/Column layout containers</li>
  </ul>
  <br/>
  <h3>Subcomponents:</h3>
  <ul>
  <li><b>Card.Image</b> - Image display with size control</li>
  <li><b>Card.Title</b> - Heading with size variants</li>
  <li><b>Card.Description</b> - Text content with formatting</li>
  <li><b>Card.Price</b> - Price display with optional comparison</li>
  <li><b>Card.Rating</b> - Star rating with optional label</li>
  <li><b>Card.Button</b> - Action trigger button</li>
  <li><b>Card.Counter</b> - Quantity selector</li>
  <li><b>Card.Wishlist</b> - Favorite/wishlist toggle button</li>
  <li><b>Card.Badge</b> - Status/label badge overlay</li>
  <li><b>Card.Row</b> - Horizontal content container</li>
  <li><b>Card.Column</b> - Vertical content container</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width/height</code>: Fixed dimensions</li>
  <li><code>maxWidth/maxHeight</code>: Size limits</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>gutter</code>: Element spacing</li>
  <li><code>padding</code>: Internal spacing</li>
  </ul>
  </li>
  <li><code>overflow</code>: Content overflow handling</li>
  </ul>
        `,
      },
    },
  },
  subcomponents: {
    Image: Card.Image as ComponentType<CardImageProps>,
    Title: Card.Title as ComponentType<CardTextProps>,
    Description: Card.Description as ComponentType<CardTextProps>,
    Price: Card.Price as ComponentType<PriceProps>,
    Rating: Card.Rating as ComponentType<RatingProps>,
    Button: Card.Button as ComponentType<ButtonProps>,
    Counter: Card.Counter as ComponentType<CounterProps>,
    Row: Card.Row as ComponentType<ColumnProps>,
    Column: Card.Column as ComponentType<RowProps>,
    Wishlist: Card.Wishlist as ComponentType<CardWishlistProps>,
    Badge: Card.Badge as ComponentType<CardBadgeProps>,
  },
} as Meta<typeof Card>;

export default meta;

export const WithBuildInComponents: StoryFn = () => {
  const buttonClickAction = action('Card button clicked');
  const counterClickAction = action('Counter button clicked');

  return (
    <Column gutter={64}>
      <Row gutter={64} align="start">
        <Card width="330px" gap="16px" isBordered>
          <Card.Image src="https://picsum.photos/150/150" />
          <Card.Column padding="0 16px 16px" gutter="16px">
            <Card.Row>
              <Card.Title>Card Title</Card.Title>
              <Card.Description>
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </Card.Description>
            </Card.Row>
            <Card.Rating value={1} label="3.5/5(18) stars" />
            <Card.Column gutter="32px">
              <Card.Row justify="between">
                <Card.Price currentValue="20$" oldValue="17$" />
                <Card.Counter onCounterChange={counterClickAction} />
              </Card.Row>
              <Card.Button onClick={buttonClickAction}>More Info</Card.Button>
            </Card.Column>
          </Card.Column>
        </Card>

        <Card width="94px" isHighlighted>
          <Card.Image src="https://picsum.photos/150/150" />
          <Card.Row padding="8px">
            <Card.Title sizeVariant="sm">Card Title</Card.Title>
            <Card.Description sizeVariant="sm">
              Some quick example text to build on the card title and make up the bulk of the card's content.
            </Card.Description>
            <Card.Price sizeVariant="sm" currentValue="20$" />
            <Card.Rating value={2} label="3.5/5(18) stars" sizeVariant="sm" />
          </Card.Row>
        </Card>
      </Row>
      <Row gutter={64} align="start">
        <Card width="684px" variant="horizontal" isBordered>
          <Card.Image src="https://picsum.photos/150/150" width={212} />
          <Card.Column padding="16px" gutter="16px" justify="between">
            <Card.Row>
              <Card.Title cardVariant="horizontal">Card Title</Card.Title>
              <Card.Description cardVariant="horizontal">
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </Card.Description>
              <Card.Description cardVariant="horizontal" as="div" color="text.caption">
                ID 5463728
              </Card.Description>
            </Card.Row>
            <Card.Rating value={1} label="3.5/5(18) stars" />
            <Card.Row justify="between">
              <Card.Price currentValue="20$" oldValue="17$" />
              <Card.Button onClick={buttonClickAction}>More Info</Card.Button>
            </Card.Row>
          </Card.Column>
        </Card>

        <Card width="360px" variant="horizontal" isHighlighted withShadowHover>
          <Card.Image src="https://picsum.photos/150/150" width={94} />
          <Card.Column padding="8px 16px" gutter="8px">
            <Card.Row>
              <Card.Title sizeVariant="sm">Card Title</Card.Title>
              <Card.Description sizeVariant="sm">
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </Card.Description>
              <Card.Description cardVariant="horizontal" sizeVariant="sm" as="div" color="text.caption">
                ID 5463728
              </Card.Description>
            </Card.Row>
            <Card.Row justify="between">
              <Card.Price sizeVariant="sm" currentValue="20$" />
              <Card.Rating value={4} label="3.5/5(18) stars" sizeVariant="sm" />
            </Card.Row>

            <Card.Counter sizeVariant="sm" onCounterChange={counterClickAction} />
          </Card.Column>
        </Card>
      </Row>
      <Row gutter={64} align="start">
        <Card width="684px" variant="horizontal" isBordered>
          <Card.Image src="https://picsum.photos/150/150" width={212} />
          <Card.Row padding="16px" justify="between" gutter="16px" isWrap={false}>
            <Card.Column gutter="16px">
              <Card.Row>
                <Card.Title>Card Title</Card.Title>
                <Card.Description cardVariant="horizontal">
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </Card.Description>
                <Card.Description as="div" cardVariant="horizontal" color="text.caption">
                  ID 5463728
                </Card.Description>
              </Card.Row>

              <Card.Description cardVariant="horizontal" as="div">
                Color: blue
                <br />
                Size: 12
              </Card.Description>

              <Card.Counter cardVariant="horizontal" onCounterChange={counterClickAction} />
            </Card.Column>
            <Card.Column>
              <Card.Price cardVariant="horizontal" currentValue="20$" oldValue="49$" />
              <Card.Rating cardVariant="horizontal" value={3.7} />
            </Card.Column>
          </Card.Row>
        </Card>
      </Row>
    </Column>
  );
};

export const WithVerticalCard: StoryFn = (args) => {
  return (
    <Column gutter={64}>
      <Row gutter={64} align="start">
        <Card width="330px" gap="16px" isBordered>
          <Card.Image src="https://picsum.photos/150/150" />
          <Card.Column padding="0 16px 16px" gutter="16px">
            <Card.Row>
              <Card.Title>Card Title</Card.Title>
              <Card.Description>
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </Card.Description>
            </Card.Row>
            <Card.Rating value={1} label="3.5/5(18) stars" />
            <Card.Column gutter="32px">
              <Card.Row justify="between">
                <Card.Price currentValue="20$" oldValue="17$" />
                <Card.Counter onCounterChange={args['counterClickAction']} />
              </Card.Row>
              <Card.Button onClick={args['buttonClickAction']}>More Info</Card.Button>
            </Card.Column>
          </Card.Column>
        </Card>
      </Row>
    </Column>
  );
};
WithVerticalCard.args = {
  buttonClickAction: fn(),
  counterClickAction: fn(),
};
WithVerticalCard.play = withVerticalCardActions;

export const WithHorizontalCard: StoryFn = (args) => {
  return (
    <Column gutter={64}>
      <Row gutter={64} align="start">
        <Card width="684px" variant="horizontal" isBordered>
          <Card.Image src="https://picsum.photos/150/150" width={212} />
          <Card.Row padding="16px" justify="between" gutter="16px" isWrap={false}>
            <Card.Column gutter="16px">
              <Card.Row>
                <Card.Title>Card Title</Card.Title>
                <Card.Description cardVariant="horizontal">
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </Card.Description>
                <Card.Description as="div" cardVariant="horizontal" color="text.caption" data-testid="card-product-sku">
                  ID 5463728
                </Card.Description>
              </Card.Row>

              <Card.Description cardVariant="horizontal" as="div" data-testid="card-product-variant">
                Color: blue
                <br />
                Size: 12
              </Card.Description>

              <Card.Counter cardVariant="horizontal" onCounterChange={args['counterClickAction']} />
            </Card.Column>
            <Card.Column>
              <Card.Price cardVariant="horizontal" currentValue="20$" oldValue="49$" />
              <Card.Rating cardVariant="horizontal" value={3.7} />
            </Card.Column>
          </Card.Row>
        </Card>
      </Row>
    </Column>
  );
};
WithHorizontalCard.args = {
  buttonClickAction: fn(),
  counterClickAction: fn(),
};
WithHorizontalCard.play = withHorizontalCardActions;

export const MyCardWithFallbackImage: StoryFn = (args) => {
  return (
    <Card {...args}>
      <Card.Image
        src="https://picsum.photosss/150/150"
        fallbackComponent={<InlineNotification variant="error">Something wrong with image</InlineNotification>}
      ></Card.Image>
      <Card.Column padding="0 16px 16px" gutter="16px">
        <Card.Row>
          <Card.Title>Card Title</Card.Title>
        </Card.Row>
        <Card.Row>
          <Card.Description>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </Card.Description>
        </Card.Row>
      </Card.Column>
    </Card>
  );
};
MyCardWithFallbackImage.play = myCardWithFallbackImageActions;

export const WithWishlistAndBadge: StoryFn = () => {
  return (
    <Column gutter={64}>
      <Row gutter={64} align="start">
        <Card width="330px" gap="16px" isBordered>
          <div style={{ position: 'relative' }}>
            <Card.Image src="https://picsum.photos/330/200?random=20" />
            <Card.Wishlist isActive={false} onToggle={action('Wishlist toggled')} ariaLabel="Add to wishlist" />
            <Card.Badge variant="primary" appearance="filled">
              New
            </Card.Badge>
          </div>
          <Card.Column padding="0 16px 16px" gutter="16px">
            <Card.Title>Product with Wishlist</Card.Title>
            <Card.Description>This card demonstrates the Wishlist toggle and Badge overlay features.</Card.Description>
            <Card.Price currentValue="$49.99" oldValue="$79.99" />
          </Card.Column>
        </Card>

        <Card width="330px" gap="16px" isBordered>
          <div style={{ position: 'relative' }}>
            <Card.Image src="https://picsum.photos/330/200?random=21" />
            <Card.Wishlist isActive={true} onToggle={action('Wishlist toggled')} ariaLabel="Remove from wishlist" />
            <Card.Badge variant="quaternary" appearance="filled">
              Sale
            </Card.Badge>
          </div>
          <Card.Column padding="0 16px 16px" gutter="16px">
            <Card.Title>Wishlisted Product</Card.Title>
            <Card.Description>This card shows an active wishlist state and sale badge.</Card.Description>
            <Card.Rating value={4} label="4.0/5 (42)" />
            <Card.Price currentValue="$29.99" oldValue="$59.99" />
          </Card.Column>
        </Card>
      </Row>
    </Column>
  );
};
WithWishlistAndBadge.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story:
        'Cards with `Card.Wishlist` toggle button and `Card.Badge` overlay. Wishlist shows a heart icon that toggles active state. Badge displays status labels like "New" or "Sale".',
    },
    source: {
      code: `<Card width="330px" isBordered>
  <div style={{ position: 'relative' }}>
    <Card.Image src="/product.jpg" />
    <Card.Wishlist isActive={false} onToggle={() => {}} ariaLabel="Add to wishlist" />
    <Card.Badge variant="primary" appearance="filled">New</Card.Badge>
  </div>
  <Card.Column padding="0 16px 16px" gutter="16px">
    <Card.Title>Product Title</Card.Title>
    <Card.Price currentValue="$49.99" />
  </Card.Column>
</Card>`,
    },
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ card: defaultTheme.card }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
