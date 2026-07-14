const component = {
  name: 'Accordion',
  import: "import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from 'gd-design-library'",
  description:
    'Collapsible content panels. Supports single or multiple expanded items. Built with AccordionItem / AccordionHeader / AccordionContent subcomponents.',
  a2uiName: 'accordion',
  a2uiSubcomponents: {
    'accordion-item': {
      component: 'AccordionItem',
      props: [
        {
          name: 'children',
          type: 'A2UIComponent[]',
          description: 'AccordionHeader followed by AccordionContent for this item',
          required: true,
        },
        { name: 'className', type: 'string', description: 'Optional CSS class name for the item wrapper' },
        { name: 'margin', type: 'string', description: 'CSS margin around the item (for example "16px 0")' },
        { name: 'padding', type: 'string', description: 'CSS padding inside the item wrapper' },
        { name: 'width', type: 'string', description: 'CSS width for the item wrapper' },
        { name: 'minWidth', type: 'string', description: 'Minimum item width' },
        { name: 'maxWidth', type: 'string', description: 'Maximum item width' },
        { name: 'height', type: 'string', description: 'CSS height for the item wrapper' },
        { name: 'minHeight', type: 'string', description: 'Minimum item height' },
        { name: 'maxHeight', type: 'string', description: 'Maximum item height' },
        { name: 'gap', type: 'string', description: 'CSS gap between nested item content blocks' },
        { name: 'flex', type: 'string', description: 'Flex shorthand for advanced accordion layouts' },
        { name: 'flexDirection', type: 'string', description: 'Flex direction for custom item layouts' },
        { name: 'flexWrap', type: 'string', description: 'Flex wrapping behavior for item content' },
        { name: 'justifyContent', type: 'string', description: 'CSS justify-content value for the item wrapper' },
        { name: 'alignItems', type: 'string', description: 'CSS align-items value for the item wrapper' },
        { name: 'position', type: 'string', description: 'CSS position value such as "relative" or "sticky"' },
        { name: 'top', type: 'string', description: 'Top offset when position is set' },
        { name: 'right', type: 'string', description: 'Right offset when position is set' },
        { name: 'bottom', type: 'string', description: 'Bottom offset when position is set' },
        { name: 'left', type: 'string', description: 'Left offset when position is set' },
        { name: 'zIndex', type: 'string | number', description: 'Stacking order for sticky or layered items' },
        { name: 'overflow', type: 'string', description: 'Overflow behavior for long item content' },
        { name: 'styling', type: 'object', description: 'CSS style overrides for the accordion item wrapper' },
      ],
    },
    'accordion-header': {
      component: 'AccordionHeader',
      props: [
        { name: 'label', type: 'string', description: 'Visible accordion header text', required: true },
        { name: 'icon', type: 'string', description: 'Optional icon name rendered as the expand/collapse indicator' },
        { name: 'className', type: 'string', description: 'Optional CSS class name for the header' },
        { name: 'styling', type: 'object', description: 'CSS style overrides for the header row' },
      ],
    },
    'accordion-content': {
      component: 'AccordionContent',
      props: [
        { name: 'label', type: 'string', description: 'Optional plain-text body content for simple accordion panels' },
        { name: 'value', type: 'string', description: 'Optional secondary body text rendered below the label' },
        { name: 'children', type: 'A2UIComponent[]', description: 'Nested content rendered inside the open panel' },
        { name: 'className', type: 'string', description: 'Optional CSS class name for the content wrapper' },
        { name: 'styling', type: 'object', description: 'CSS style overrides for the accordion content panel' },
      ],
    },
  },
  category: 'Layout & Structure',
  complexity: 'Medium',
  accessibility: 'WCAG 2.1 AA Compliant - includes ARIA attributes (aria-expanded, aria-controls, role=region)',
  performance: 'Optimized with smooth animations',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~3KB gzipped',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  subcomponents: {
    AccordionItem: {
      description:
        'Wrapper for a single accordion entry. Must have unique id prop. Supports all Box layout props (BoxStyles).',
      props: [
        { name: 'id', type: 'string', description: 'Unique identifier for the item', required: true },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Should contain AccordionHeader and AccordionContent',
          required: true,
        },
        { name: 'styles', type: 'CSSProperties', description: 'Custom CSS properties', default: '{}' },
        { name: 'className', type: 'string', description: 'Custom CSS class name', default: '""' },
        // Box Layout Props - Spacing
        { name: 'margin', type: 'string', description: 'Margin around the item (e.g., "16px", "1rem 2rem")' },
        { name: 'marginTop', type: 'string', description: 'Top margin' },
        { name: 'marginRight', type: 'string', description: 'Right margin' },
        { name: 'marginBottom', type: 'string', description: 'Bottom margin' },
        { name: 'marginLeft', type: 'string', description: 'Left margin' },
        { name: 'padding', type: 'string', description: 'Padding inside the item (e.g., "20px", "1rem 2rem")' },
        { name: 'paddingTop', type: 'string', description: 'Top padding' },
        { name: 'paddingRight', type: 'string', description: 'Right padding' },
        { name: 'paddingBottom', type: 'string', description: 'Bottom padding' },
        { name: 'paddingLeft', type: 'string', description: 'Left padding' },
        { name: 'gap', type: 'string', description: 'Gap between flex/grid children' },
        // Box Layout Props - Dimensions
        { name: 'width', type: 'string', description: 'Width of the item (e.g., "100%", "500px")' },
        { name: 'minWidth', type: 'string', description: 'Minimum width' },
        { name: 'maxWidth', type: 'string', description: 'Maximum width (e.g., "600px")' },
        { name: 'height', type: 'string', description: 'Height of the item' },
        { name: 'minHeight', type: 'string', description: 'Minimum height' },
        { name: 'maxHeight', type: 'string', description: 'Maximum height' },
        // Box Layout Props - Flexbox
        { name: 'flex', type: 'string', description: 'Flex shorthand (e.g., "1", "0 0 auto")' },
        { name: 'flexDirection', type: 'string', description: 'Flex direction (row, column)' },
        { name: 'flexWrap', type: 'string', description: 'Flex wrap behavior' },
        { name: 'flexGrow', type: 'string', description: 'Flex grow factor' },
        { name: 'flexShrink', type: 'string', description: 'Flex shrink factor' },
        { name: 'flexBasis', type: 'string', description: 'Flex basis' },
        { name: 'justifyContent', type: 'string', description: 'Justify content alignment' },
        { name: 'alignItems', type: 'string', description: 'Align items' },
        { name: 'alignSelf', type: 'string', description: 'Align self' },
        { name: 'alignContent', type: 'string', description: 'Align content' },
        // Box Layout Props - Position
        { name: 'position', type: 'string', description: 'CSS position (relative, absolute, fixed)' },
        { name: 'top', type: 'string', description: 'Top position offset' },
        { name: 'right', type: 'string', description: 'Right position offset' },
        { name: 'bottom', type: 'string', description: 'Bottom position offset' },
        { name: 'left', type: 'string', description: 'Left position offset' },
        { name: 'zIndex', type: 'string | number', description: 'Z-index stacking order' },
        { name: 'overflow', type: 'string', description: 'Overflow behavior (hidden, auto, scroll)' },
      ],
    },
    AccordionHeader: {
      description: 'Clickable header section with optional expand/collapse icon.',
      props: [
        { name: 'children', type: 'ReactNode', description: 'Header content (title, labels, etc.)', required: true },
        { name: 'expandIcon', type: 'ReactNode', description: 'Icon component to show expand/collapse state' },
        { name: 'styles', type: 'CSSProperties', description: 'Custom CSS properties', default: '{}' },
        { name: 'className', type: 'string', description: 'Custom CSS class name', default: '""' },
      ],
    },
    AccordionContent: {
      description: 'Collapsible content section with smooth animations.',
      props: [
        { name: 'children', type: 'ReactNode', description: 'The collapsible content', required: true },
        { name: 'styles', type: 'CSSProperties', description: 'Custom CSS properties', default: '{}' },
        { name: 'className', type: 'string', description: 'Custom CSS class name', default: '""' },
      ],
    },
  },
  props: [
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description: 'Accordion-item children that define the full accordion structure',
      required: true,
    },
    {
      name: 'allowMultipleExpand',
      type: 'boolean',
      description: 'Whether multiple items can be expanded simultaneously',
      default: false,
    },
    {
      name: 'withoutSeparator',
      type: 'boolean',
      description: 'When true, removes the visual divider lines between accordion items',
    },
    { name: 'isInline', type: 'boolean', description: 'When true, renders the accordion header in an inline layout' },
    { name: 'value', type: 'string[]', description: 'Controlled array of expanded accordion-item IDs' },
    { name: 'defaultValue', type: 'string[]', description: 'Initial array of expanded accordion-item IDs' },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the accordion' },
  ],
  quickStart: {
    basic: `<Accordion>
  <AccordionItem id="item1">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Section 1</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Content 1</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
    controlled: `<Accordion value={expandedItems} onChange={setExpandedItems}>
  <AccordionItem id="item1">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Section 1</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Content 1</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
    multiple: `<Accordion allowMultipleExpand={true}>
  <AccordionItem id="item1">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Section 1</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Content 1</p>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem id="item2">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Section 2</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Content 2</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
    faq: `<Accordion defaultValue={["faq1"]}>
  <AccordionItem id="faq1">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Question 1</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Answer 1</p>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem id="faq2">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Question 2</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Answer 2</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
  },
  commonPatterns: {
    'FAQ Section': {
      code: `<Accordion defaultValue={["faq1"]}>
  <AccordionItem id="faq1">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>How do I get started?</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Follow these steps...</p>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem id="faq2">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>What are the pricing options?</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>We offer three plans...</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      useCase: 'Frequently asked questions with expandable answers',
    },
    'Settings Panel': {
      code: `<Accordion allowMultipleExpand={true}>
  <AccordionItem id="general">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>General Settings</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Basic configuration options</p>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem id="privacy">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Privacy Settings</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Privacy and security options</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      useCase: 'Settings panels where multiple sections can be open simultaneously',
    },
    'Step-by-Step Guide': {
      code: `<Accordion allowMultipleExpand={false}>
  <AccordionItem id="step1">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Step 1: Setup</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Initial setup instructions</p>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem id="step2">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Step 2: Configuration</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Configuration details</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      useCase: 'Progressive disclosure for tutorials and guides',
    },
    'Rich Header Content': {
      code: `<Accordion>
  <AccordionItem id="rich-header">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Icon name="info" />
        <div>
          <h3>Title with Icon and Subtitle</h3>
          <p style={{ fontSize: '12px', color: '#666' }}>Additional context</p>
        </div>
      </div>
    </AccordionHeader>
    <AccordionContent>
      <p>Complex header example</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      useCase: 'Headers with icons, titles, and subtitles for rich visual hierarchy',
    },
    'Nested Accordions': {
      code: `<Accordion>
  <AccordionItem id="parent">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Parent Section</h3>
    </AccordionHeader>
    <AccordionContent>
      <Accordion>
        <AccordionItem id="child1">
          <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
            <h4>Nested Item 1</h4>
          </AccordionHeader>
          <AccordionContent>
            <p>Nested content</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      useCase: 'Hierarchical content organization with multiple levels',
    },
    'Custom Styled Items': {
      code: `<Accordion>
  <AccordionItem id="styled" styles={{ border: '2px solid #0066cc', borderRadius: '8px' }}>
    <AccordionHeader 
      expandIcon={<Icon name="keyboardArrowDown" />}
      styles={{ backgroundColor: '#4CAF50', color: 'white', padding: '16px' }}
    >
      <h3>Styled Header</h3>
    </AccordionHeader>
    <AccordionContent styles={{ backgroundColor: '#f9f9f9', padding: '24px' }}>
      <p>Custom styled content</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      useCase: 'Custom styling for headers and content sections',
    },
    'AccordionItem with Box Layout Props': {
      code: `<Accordion>
  <AccordionItem 
    id="boxstyles-item"
    margin="16px 0"
    padding="20px"
    width="100%"
    maxWidth="600px"
    styles={{ border: '2px solid #4CAF50', borderRadius: '12px' }}
  >
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Item with Box Props</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Using margin, padding, width, and maxWidth props</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      useCase: 'Flexible layout control using Box layout props (spacing, dimensions, positioning)',
    },
    'Flex Layout Accordion Items': {
      code: `<div style={{ display: 'flex', gap: '16px' }}>
  <Accordion>
    <AccordionItem 
      id="flex-item-1" 
      flex="1" 
      minWidth="200px"
      styles={{ border: '1px solid #ddd' }}
    >
      <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
        <h3>Flex Item 1</h3>
      </AccordionHeader>
      <AccordionContent>
        <p>Using flex="1"</p>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
  <Accordion>
    <AccordionItem 
      id="flex-item-2" 
      flex="2" 
      minWidth="300px"
    >
      <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
        <h3>Flex Item 2</h3>
      </AccordionHeader>
      <AccordionContent>
        <p>Using flex="2" - takes more space</p>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</div>`,
      useCase: 'Side-by-side accordions with flexible width distribution',
    },
  },
  examples: [
    `<Accordion defaultValue={["item1"]}>
  <AccordionItem id="item1">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Section 1</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Content 1</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
    `<Accordion value={expandedItems} onChange={setExpandedItems} allowMultipleExpand={true}>
  {accordionItems.map(item => (
    <AccordionItem key={item.id} id={item.id}>
      <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
        <h3>{item.title}</h3>
      </AccordionHeader>
      <AccordionContent>
        <p>{item.content}</p>
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>`,
    `<Accordion withoutSeparator>
  <AccordionItem id="faq1">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Question 1</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Answer 1</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
    `<Accordion isInline>
  <AccordionItem id="inline1">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" size="xs" />}>
      <h3>Inline Accordion</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Content with inline header layout</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
  ],
  troubleshooting: {
    'Items not expanding':
      'Check if value prop is set correctly and onChange handler is provided. Ensure each AccordionItem has a unique id prop.',
    'Multiple items not expanding': 'Set allowMultipleExpand={true} to enable multiple open items',
    'State not updating': 'Use controlled mode with value and onChange props for external state management',
    'Accessibility issues':
      'Ensure proper ARIA attributes and keyboard navigation support. AccordionHeader automatically provides aria-expanded and aria-controls.',
    'Performance issues': 'Use lazy loading for heavy content inside AccordionContent sections',
    'Icon not rotating': 'Ensure expandIcon is passed to AccordionHeader component',
    'Missing id error': 'Each AccordionItem must have a unique id prop for proper state management',
  },
  bestPractices: [
    'ALWAYS import all three subcomponents: Accordion, AccordionItem, AccordionHeader, AccordionContent',
    'ALWAYS provide unique id prop to each AccordionItem for proper state management',
    'Structure: Accordion > AccordionItem > [AccordionHeader, AccordionContent]',
    'Use expandIcon prop on AccordionHeader with Icon component (e.g., <Icon name="keyboardArrowDown" />)',
    'CRITICAL: Use ONLY real icon names from IconsList - keyboardArrowDown, plus, arrowRight, arrowDown, etc.',
    'NEVER use: "add" (use plus), "chevronRight" (use arrowRight), "expandMore" (use arrowDown), "settings", "close"',
    'Use controlled mode (value + onChange) for syncing with URL or external state',
    'Enable allowMultipleExpand for settings panels where multiple sections can be open',
    'Keep AccordionHeader content concise and descriptive for better UX',
    'Defer heavy content rendering in AccordionContent until expanded for performance',
    'Use defaultValue to show the most important items expanded initially',
    'Set withoutSeparator={true} to remove dividers between items when needed',
    'Set isInline={true} to display accordion items header as inline layout',
    'Apply custom styles prop to AccordionItem, AccordionHeader, or AccordionContent for styling',
    'AccordionItem supports Box layout props: margin, padding, width, height, flex, position, etc.',
    'Use different expandIcon options from IconsList: keyboardArrowDown (default), plus (plus/minus), arrowRight (side arrow)',
    'Combine with Icon components in AccordionHeader for visual category indicators',
    'AccordionContent automatically handles smooth height animations',
    'AccordionHeader provides proper ARIA attributes (aria-expanded, aria-controls) automatically',
    'For rich headers, wrap complex content in divs inside AccordionHeader children',
    'Nest Accordions by placing a new Accordion inside AccordionContent for hierarchical data',
    'Accordion includes integrated logging support via useLogger hook - logs render, toggle, and onChange events for debugging',
  ],
};

const compositionTips: string[] = [
  'STRUCTURE: Always use Accordion > AccordionItem (with id) > AccordionHeader + AccordionContent',
  'IMPORT: Always import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from gd-design-library',
  'IDS: Each AccordionItem must have a unique id prop for state management',
  'ICONS: Pass expandIcon={<Icon name="keyboardArrowDown" />} to AccordionHeader for expand indicators',
  'ICONS LIST: ONLY use real icon names from IconsList: keyboardArrowDown, plus, arrowRight, arrowDown, minus, etc.',
  'ICONS CRITICAL: Do NOT use: "add" (use plus), "chevronRight" (use arrowRight), "expandMore" (use arrowDown)',
  'BOX PROPS: AccordionItem now supports all Box layout props (margin, padding, width, height, flex, position, etc.)',
  'Use controlled value for syncing expanded state with URL or external state',
  'Enable allowMultipleExpand={true} for settings panels where multiple sections can be open',
  'Set withoutSeparator={true} to remove visual dividers between AccordionItems',
  'Set isInline={true} to display accordion items header as inline layout for compact designs',
  'Use AccordionHeader children for titles - wrap in h3, h4 tags for semantic HTML',
  'Place all collapsible content inside AccordionContent component',
  'Defer heavy content rendering in AccordionContent until expanded for performance',
  'Use Accordion defaultValue={["id1", "id2"]} to show important items expanded initially',
  'Apply allowMultipleExpand={false} for step-by-step guides or wizards (single item open)',
  'Combine Icon components in AccordionHeader for visual category indicators',
  'Use styles prop on AccordionItem for custom borders, backgrounds, or spacing',
  'Apply styles prop on AccordionHeader for custom header colors and padding',
  'Set styles prop on AccordionContent for custom content backgrounds and spacing',
  'Use margin prop on AccordionItem for spacing between items (e.g., margin="16px 0")',
  'Apply padding prop on AccordionItem for internal spacing (e.g., padding="20px")',
  'Set width and maxWidth on AccordionItem for responsive layouts (e.g., width="100%" maxWidth="600px")',
  'Use flex prop on AccordionItem for flexible layouts (e.g., flex="1" in a flex container)',
  'Apply minWidth on AccordionItem to prevent items from becoming too narrow',
  'Set position and zIndex on AccordionItem for layered or sticky positioning',
  'Use gap prop on AccordionItem when it contains flex/grid children',
  'Apply overflow prop on AccordionItem to control content overflow behavior',
  'Use different expandIcon options from IconsList: keyboardArrowDown (default), plus (plus/minus), arrowRight (side arrow), arrowDown (simple arrow)',
  'For rich headers, wrap complex JSX in divs inside AccordionHeader children',
  'Nest Accordions by placing new Accordion inside AccordionContent for hierarchical data',
  'Use Accordion onChange to track analytics for which sections users expand',
  'Apply Accordion value={[]} to programmatically collapse all items when needed',
  'Combine Accordion with InlineNotification inside AccordionContent for contextual alerts',
  'Use Accordion within Card components for organized settings sections',
  'Apply Accordion for FAQ sections - defaultValue on first question for better UX',
  'Set Accordion allowMultipleExpand based on viewport (true desktop, false mobile)',
  'Use Accordion onChange with localStorage to persist user expansion preferences',
  'Apply Accordion for progressive disclosure of complex forms in AccordionContent',
  'Combine Accordion with loading Skeleton inside AccordionContent while fetching',
  'Use Accordion in sidebars for collapsible navigation menu categories',
  'Apply consistent Typography components in AccordionHeader for title styling',
  'Set Accordion defaultValue based on user role or permissions for personalized UX',
  'Use Accordion with search/filter to highlight and expand matching sections',
  'Apply Accordion onChange to update URL hash for deep-linkable sections',
  'Combine Accordion with Form components in AccordionContent for multi-step workflows',
  'Use Accordion value with useEffect to expand items based on route or query params',
  'Apply max-height and Scroll inside AccordionContent for very long content',
  'Set AccordionHeader with flex layout for complex headers with icons and subtitles',
  'Use Accordion for documentation with code examples in expandable AccordionContent',
  'Apply Accordion for changelog or release notes with versions as items',
  'Combine Accordion with Tooltip on AccordionHeader for additional context',
  'Use Accordion for product features with detailed descriptions in AccordionContent',
  'Apply Accordion with focus management to move focus when items expand',
  'Set Accordion with print styles to show all AccordionContent expanded when printing',
  'Use Accordion for comparison tables with detailed specs in AccordionContent',
  'Apply Accordion for terms and conditions with sections as expandable items',
  'Combine Accordion with router integration to maintain expansion state during navigation',
  'Use Accordion for configuration panels with grouped settings in sections',
  'Apply AccordionContent with nested components like Lists, Tables, or Forms',
  'Set className prop on subcomponents for CSS-in-JS or styled-components integration',
  'Use AccordionHeader without expandIcon for minimalist designs',
  'Accordion includes integrated logging support via useLogger hook - configure LoggerProvider to enable debug logging for component behavior, state changes, and user interactions',
];

export default { component, compositionTips };
