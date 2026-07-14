const component = {
  name: 'Card',
  import: "import { Card } from 'gd-design-library'",
  description:
    'Content container. Groups related UI. Supports border, highlight, and shadow-hover states. ALWAYS set both padding and gutter on the card root.',
  a2uiName: 'card',
  a2uiSubcomponents: {
    'card-row': {
      component: 'Card.Row',
      props: [
        { name: 'children', type: 'A2UIComponent[]', description: 'card-* subcomponent types only' },
        { name: 'gutter', type: 'string', description: 'CSS gap between children (e.g. "8px")' },
        { name: 'align', type: 'string', enum: ['start', 'center', 'end', 'stretch'] as const },
        { name: 'justify', type: 'string', enum: ['start', 'center', 'end', 'space-between', 'space-around'] as const },
        { name: 'isWrap', type: 'boolean', description: 'allow wrapping — NOT "wrap"', default: false },
        { name: 'padding', type: 'string', description: 'CSS padding' },
        { name: 'styling', type: 'object', description: 'CSS style overrides' },
      ],
    },
    'card-column': {
      component: 'Card.Column',
      props: [
        { name: 'children', type: 'A2UIComponent[]', description: 'card-* subcomponent types only' },
        { name: 'gutter', type: 'number', description: 'vertical gap in pixels (e.g. 12) — NOT a CSS string' },
        { name: 'align', type: 'string', enum: ['start', 'center', 'end', 'stretch'] as const },
        { name: 'justify', type: 'string', enum: ['start', 'center', 'end', 'space-between', 'space-around'] as const },
        { name: 'isWrap', type: 'boolean', description: 'allow wrapping' },
        { name: 'padding', type: 'string', description: 'CSS inner padding (e.g. "16px", "0 16px 16px")' },
        { name: 'styling', type: 'object', description: 'CSS style overrides' },
      ],
    },
    'card-title': {
      component: 'Card.Title',
      props: [
        { name: 'label', type: 'string', description: 'title text' },
        { name: 'size', type: 'string', enum: ['sm'] as const, description: 'compact variant; omit for default' },
        { name: 'styling', type: 'object', description: 'CSS style overrides' },
      ],
    },
    'card-description': {
      component: 'Card.Description',
      props: [
        { name: 'label', type: 'string', description: 'description text' },
        { name: 'size', type: 'string', enum: ['sm'] as const, description: 'compact variant; omit for default' },
        { name: 'styling', type: 'object', description: 'CSS style overrides' },
      ],
    },
    'card-image': {
      component: 'Card.Image',
      props: [
        {
          name: 'attributes',
          type: 'object',
          description: '{ src: string, alt: string, width?: number, height?: number } — width/height are numbers',
        },
        { name: 'styling', type: 'object', description: 'CSS style overrides' },
      ],
    },
    'card-price': {
      component: 'Card.Price',
      props: [
        {
          name: 'attributes',
          type: 'object',
          description:
            '{ currentValue: string, oldValue?: string, currencySymbol: string, currencySymbolPosition?: "before"|"after" }',
        },
        { name: 'size', type: 'string', enum: ['sm'] as const, description: 'compact variant; omit for default' },
        { name: 'styling', type: 'object', description: 'CSS style overrides' },
      ],
    },
    'card-button': {
      component: 'Card.Button',
      props: [
        { name: 'label', type: 'string', description: 'button text' },
        { name: 'variant', type: 'string', enum: ['primary', 'secondary', 'tertiary', 'outlined', 'text'] as const },
        { name: 'size', type: 'string', enum: ['sm'] as const, description: 'compact variant; omit for default' },
        { name: 'disabled', type: 'boolean' },
        { name: 'actions', type: 'string[]', description: 'action IDs to trigger on click' },
        { name: 'styling', type: 'object', description: 'CSS style overrides' },
      ],
    },
    'card-counter': {
      component: 'Card.Counter',
      props: [
        { name: 'attributes', type: 'object', description: '{ initial?: number, min?: number, max?: number }' },
        { name: 'disabled', type: 'boolean' },
        { name: 'size', type: 'string', enum: ['sm'] as const, description: 'compact variant; omit for default' },
        { name: 'actions', type: 'string[]', description: 'action IDs triggered when counter changes' },
      ],
    },
    'card-rating': {
      component: 'Card.Rating',
      props: [
        { name: 'value', type: 'number', description: 'rating value (0–5)' },
        { name: 'label', type: 'string', description: 'accessible label (e.g. "4.5/5 (120 reviews)")' },
        { name: 'size', type: 'string', enum: ['sm'] as const, description: 'compact variant; omit for default' },
        { name: 'styling', type: 'object', description: 'CSS style overrides' },
      ],
    },
  },
  category: 'Layout & Structure',
  subcomponents: {
    'Card.Row': {
      description:
        'Horizontal row layout inside Card. Maps to the Row component. Use for price+counter rows or action groups.',
      props: ['gutter (string CSS)', 'align', 'justify', 'isWrap (boolean — NOT "wrap")', 'padding', 'styles'],
    },
    'Card.Column': {
      description:
        'Vertical stack layout inside Card. Maps to the Column component. Use to wrap title/description/price/button sections.',
      props: [
        'gutter (number in px, e.g. 12)',
        'align',
        'justify',
        'isWrap (boolean)',
        'padding (CSS string)',
        'styles',
      ],
    },
    'Card.Counter': {
      description:
        'Quantity counter/stepper inside Card (CardCounter). Use attributes.initial for starting value — NOT "value".',
      props: ['initial (number via attributes)', 'min', 'max', 'isDisabled', 'sizeVariant ("default"|"sm")'],
    },
    'Card.Image': {
      description: 'Image thumbnail inside Card (CardImage). width and height are numbers, not CSS strings.',
      props: [
        'src',
        'alt',
        'width (number)',
        'height (number)',
        'fallbackComponent',
        'sizeVariant ("default"|"sm")',
        'styles',
      ],
    },
    'Card.Price': {
      description: 'Price display inside Card (CardPrice). Wraps the Price component with card-specific sizing.',
      props: [
        'currentValue',
        'oldValue',
        'currencySymbol',
        'currencySymbolPosition ("before"|"after")',
        'sizeVariant ("default"|"sm")',
        'styles',
      ],
    },
    'Card.Button': {
      description:
        'Full-width action button inside Card (CardButton). Default variant is "outlined". Use actions[] to wire up A2UI interactions.',
      props: [
        'variant (ButtonVariant)',
        'fullWidth (always true)',
        'sizeVariant ("default"|"sm")',
        'disabled',
        'onClick',
        'styles',
      ],
    },
    'Card.Title': {
      description: 'Primary heading inside Card (CardTitle). Renders as h6 (default) or body1 (sm).',
      props: ['children', 'sizeVariant ("default"|"sm")', 'styleVariant', 'styles'],
    },
    'Card.Description': {
      description: 'Secondary body text inside Card (CardDescription).',
      props: ['children', 'sizeVariant ("default"|"sm")', 'styleVariant', 'styles'],
    },
    'Card.Rating': {
      description:
        'Star rating display inside Card (CardRating). Read-only by default. Accepts an optional text label.',
      props: [
        'value (number 0–5)',
        'label (string)',
        'sizeVariant ("default"|"sm")',
        'size',
        'readOnly (default true)',
        'styles',
      ],
    },
  },
  complexity: 'Low',
  accessibility: 'WCAG 2.1 AA Compliant',
  performance: 'Lightweight',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~1KB gzipped',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    {
      name: 'variant',
      type: 'string',
      description: 'Layout variant of the card',
      enum: ['vertical', 'horizontal'] as const,
      default: 'vertical',
    },
    { name: 'isBordered', type: 'boolean', description: 'Adds border styling to the card', default: false },
    {
      name: 'isHighlighted',
      type: 'boolean',
      description: 'Applies outline on hover for selection state',
      default: false,
    },
    {
      name: 'withShadowHover',
      type: 'boolean',
      description: 'Adds elevation shadow on hover (requires styling.backgroundColor)',
      default: false,
    },
    {
      name: 'padding',
      type: 'string',
      description: 'REQUIRED inner padding (e.g. "16px"; use "0" when card-image is first child)',
      required: true,
    },
    {
      name: 'gutter',
      type: 'string',
      description: 'REQUIRED gap between direct card children (e.g. "12px")',
      required: true,
    },
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description:
        'Card subcomponents (card-row, card-column, card-image, card-title, card-description, card-price, card-button, card-counter, card-rating)',
      required: true,
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the card container' },
  ],
  quickStart: {
    basic: '<Card padding="16px">Content here</Card>',
    bordered: '<Card isBordered padding="20px">Bordered content</Card>',
    horizontal: '<Card variant="horizontal" padding="16px"><Image /><Content /></Card>',
    highlighted: '<Card isHighlighted padding="16px">Important content</Card>',
    interactive:
      '<Card withShadowHover padding="20px" styles={{ cursor: "pointer", backgroundColor: "#fff" }}>Hover me</Card>',
    combined:
      '<Card isBordered withShadowHover padding="20px" styles={{ cursor: "pointer", backgroundColor: "#fff" }}>Interactive card</Card>',
    scrollable: '<Card overflow="auto" maxHeight="300px">Scrollable content</Card>',
  },
  commonPatterns: {
    'E-commerce Product Card (Vertical)': {
      code: '<Card width="330px" gutter="16px" isBordered><Card.Image src={productImage} /><Card.Column padding="0 16px 16px" gutter="16px"><Card.Title>Product Name</Card.Title><Card.Description>Product description</Card.Description><Card.Rating value={4} label="4.5/5 (120)" /><Card.Row justify="between"><Card.Price currentValue="29.99" oldValue="39.99" currencySymbol="$" /><Card.Counter onCounterChange={handleQuantity} /></Card.Row><Card.Button onClick={handleAddToCart}>Add to Cart</Card.Button></Card.Column></Card>',
      useCase: 'Full-featured vertical product cards with image, price, rating, quantity selector, and action button',
    },
    'Horizontal Media Card': {
      code: '<Card width="684px" variant="horizontal" isBordered><Card.Image src={mediaImage} width={212} /><Card.Column padding="16px" gutter="16px" justify="between"><Card.Row><Card.Title>Media Title</Card.Title><Card.Description>Detailed description of the media content</Card.Description></Card.Row><Card.Rating value={5} label="5/5 (89)" /><Card.Row justify="between"><Card.Price currentValue="49.99" currencySymbol="$" /><Card.Button onClick={handleAction}>More Info</Card.Button></Card.Row></Card.Column></Card>',
      useCase: 'Horizontal layout for media content with image and detailed information side-by-side',
    },
    'Compact Interactive Card': {
      code: '<Card width="360px" variant="horizontal" isHighlighted withShadowHover><Card.Image src={thumbnail} width={94} /><Card.Column padding="8px 16px" gutter="8px"><Card.Title sizeVariant="sm">Compact Title</Card.Title><Card.Description sizeVariant="sm">Brief description</Card.Description><Card.Row justify="between"><Card.Price sizeVariant="sm" currentValue="15" currencySymbol="$" /><Card.Rating value={4} sizeVariant="sm" /></Card.Row></Card.Column></Card>',
      useCase: 'Small interactive cards with hover effects, ideal for list views or dashboards',
    },
    'Simple Content Card': {
      code: '<Card isBordered padding="20px" gutter="16px"><Typography variant="h5">Section Title</Typography><Typography>Content text for information display</Typography></Card>',
      useCase: 'Basic content cards for forms, info sections, or general content grouping',
    },
    'Clickable Card with Shadow': {
      code: '<Card width="300px" withShadowHover padding="20px" styles={{ cursor: "pointer", backgroundColor: "#fff" }}><Typography variant="h6">Dashboard Metric</Typography><Typography variant="h4">1,234</Typography><Typography color="text.caption">+12% this month</Typography></Card>',
      useCase: 'Interactive dashboard cards with shadow elevation on hover for metrics or KPIs',
    },
    'Combined Effects Card': {
      code: '<Card isBordered withShadowHover padding="20px" width="280px" styles={{ cursor: "pointer", backgroundColor: "#fff" }}><Typography variant="h6">Action Card</Typography><Typography>Click to perform action with rich visual feedback</Typography></Card>',
      useCase: 'Cards with both border and shadow hover for maximum interactive feedback',
    },
    'EU Product Card (European pricing)': {
      code: '<Card width="330px" gutter="16px" isBordered><Card.Image src={productImage} /><Card.Column padding="0 16px 16px" gutter="16px"><Card.Title>Produktname</Card.Title><Card.Description>Produktbeschreibung</Card.Description><Card.Rating value={4} label="4.5/5 (120)" /><Card.Row justify="between"><Card.Price currentValue="29,99" oldValue="39,99" currencySymbol="€" currencySymbolPosition="after" /><Card.Counter onCounterChange={handleQuantity} /></Card.Row><Card.Button onClick={handleAddToCart}>In den Warenkorb</Card.Button></Card.Column></Card>',
      useCase:
        'Product card with European price format — symbol after value with space (e.g. "29,99 €"). Use currencySymbolPosition="after" for EU locales.',
    },
  },
  examples: [
    '<Card width="330px" gutter="16px" isBordered><Card.Image src={imgUrl} /><Card.Column padding="0 16px 16px" gutter="16px"><Card.Title>Product Name</Card.Title><Card.Description>Product description text</Card.Description><Card.Price currentValue="20" currencySymbol="$" /><Card.Button onClick={handleClick}>Add to Cart</Card.Button></Card.Column></Card>',
    '<Card width="330px" gutter="16px" isBordered><Card.Image src={imgUrl} /><Card.Column padding="0 16px 16px" gutter="16px"><Card.Title>Nom du produit</Card.Title><Card.Description>Description du produit</Card.Description><Card.Price currentValue="29,99" oldValue="39,99" currencySymbol="€" currencySymbolPosition="after" /><Card.Button onClick={handleClick}>Ajouter au panier</Card.Button></Card.Column></Card>',
    '<Card width="684px" variant="horizontal" isBordered><Card.Image src={imgUrl} width={212} /><Card.Column padding="16px" gutter="16px"><Card.Title>Title</Card.Title><Card.Description>Description</Card.Description><Card.Rating value={4} label="4/5 stars" /></Card.Column></Card>',
    '<Card width="360px" variant="horizontal" isHighlighted withShadowHover><Card.Image src={imgUrl} width={94} /><Card.Column padding="8px 16px" gutter="8px"><Card.Title sizeVariant="sm">Interactive Card</Card.Title><Card.Description sizeVariant="sm">Hover for shadow effect</Card.Description><Card.Price sizeVariant="sm" currentValue="15" currencySymbol="$" /></Card.Column></Card>',
    '<Card isBordered padding="20px" gutter="16px"><div>Simple content card</div><div>With multiple lines</div></Card>',
    '<Card width="300px" withShadowHover padding="20px" styles={{ cursor: "pointer", backgroundColor: "#fff" }}><Typography variant="h6">Clickable Card</Typography><Typography>This card lifts on hover</Typography></Card>',
  ],
  troubleshooting: {
    'Content overflowing': 'Use overflow="auto" with maxHeight to create scrollable areas',
    'Card too wide on large screens': 'Set maxWidth to limit card width on large displays',
    'Inconsistent spacing': 'Use consistent padding and gutter values across similar cards',
    'Horizontal layout not working': 'Ensure Card has enough width and children are properly structured',
    'Border not showing': 'Check if isBordered prop is set to true',
    'Shadow hover not visible': 'Ensure backgroundColor is set (e.g., "#fff") for better shadow visibility',
    'Hover effects not working': 'Check that cursor: "pointer" is set in styles for interactive cards',
  },
  bestPractices: [
    'ALWAYS set both padding and gutter on the Card root — never omit either prop.',
    'Content-only cards: padding="16px" or "20px", gutter="12px" or "16px".',
    'Cards with Card.Image first: padding="0" (image edge-to-edge), gutter="0"; set padding on Card.Column below.',
    'Use consistent padding values (16px, 20px, 24px) across your application',
    'Set maxWidth for cards to maintain readable content width on large screens',
    'Use isBordered for visual separation between different content sections',
    'Apply isHighlighted for selected or important content states (outline on hover)',
    'Use withShadowHover for clickable/interactive cards to provide elevation feedback',
    'Combine withShadowHover with backgroundColor="#fff" for better shadow visibility',
    'Apply cursor: "pointer" in styles when using withShadowHover for interactive cards',
    'Use variant="horizontal" for media cards with images and text',
    'Set overflow="auto" with maxHeight for scrollable content areas',
    'Apply tabIndex={0} for interactive cards that can be focused',
    'Combine isBordered and withShadowHover for rich interactive feedback on clickable cards',
  ],
};

const compositionTips: string[] = [
  'ALWAYS set both padding and gutter on the Card root — both are required, never omit them.',
  'Content-only card: padding="16px" gutter="12px" — card children laid out with consistent spacing.',
  'Card with image: padding="0" gutter="0" — image stretches edge-to-edge; set padding on Card.Column below the image.',
  'Apply Card isBordered={true} to visually separate different content sections on a page.',
  'Set Card variant="horizontal" for media cards with image on one side and content on the other.',
  'Use Card variant="vertical" (default) for form containers and stacked content layouts.',
  'Use Card isHighlighted={true} to indicate active, selected, or important content sections (outline on hover).',
  'Apply Card withShadowHover={true} for clickable cards to provide elevation feedback on hover.',
  'Combine Card withShadowHover with styles={{ cursor: "pointer", backgroundColor: "#fff" }} for interactive cards.',
  'Use Card isBordered withShadowHover for rich visual feedback on clickable card elements.',
  'Set Card maxWidth="600px" or similar to maintain readable content width on large screens.',
  'Apply Card overflow="auto" with maxHeight for scrollable content areas within fixed layouts.',
  'Apply Card width="100%" with maxWidth for responsive cards that adapt to container.',
  'Set Card tabIndex={0} when card is clickable or interactive for keyboard accessibility.',
  'Use nested Cards with different isBordered states for hierarchical content organization.',
  'Apply Card with consistent padding values across the app for unified content presentation.',
  'Combine Card isHighlighted with hover states for interactive card selection patterns.',
  'Use Card overflow="hidden" to clip content and maintain clean edges with images.',
  'Set Card height with overflow="scroll" for fixed-height scrollable content panels.',
  'Apply Card variant="horizontal" with FlexContainer children for complex layouts.',
  'Use Card as container for related Input fields in multi-step forms.',
  'Combine multiple Cards with consistent gutter in Column for card list layouts.',
  'Apply Card isBordered={false} for subtle content grouping without visual boundaries.',
  'Use Card with elevation/shadow styles in styles prop for depth and hierarchy.',
  'Set Card minHeight to maintain consistent card sizes in grid layouts.',
  'Apply Card with background color in styles for themed content sections.',
  'Wrap form content into Card and vertical stack (Column) with comfortable gap (12-20px).',
  'When using Card.Row or Card.Column, the wrapping prop is isWrap (boolean); do not use wrap.',
  'Card subcomponents (Title, Description, Price, Rating, Button, Image, Counter) accept sizeVariant={CardSizeVariant.Default|CardSizeVariant.Sm} only.',
  'Card.Image width and height props are numbers (e.g., width={96}) — do not pass strings.',
  'Card.Counter uses initial for the starting value; there is no value prop.',
  'Use Card.Price currencySymbolPosition="after" for European locales — places the symbol after the value with a space (e.g. "29,99 €"). Default "before" renders "$29.99".',
];

export default { component, compositionTips };
