import { useRef, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';

import { Button, Column, DropdownItem, Row, Typography, Box, Modal, type SelectOnSelect } from '@components';

import { Menu, type MenuRef } from './';
import {
  closeOnSelectActions,
  defaultActions,
  withEditAndDeleteModalsActions,
  withRefControlActions,
} from './Menu.stories.play';

const MENU_ITEMS = [
  { name: 'Profile', value: 'profile' },
  { name: 'Settings', value: 'settings' },
  { name: 'Logout', value: 'logout' },
];

const meta = {
  title: 'Molecules/Menu',
  component: Menu,
  tags: ['autodocs'],
  argTypes: {
    // ============================================================================
    // Content & Trigger
    // ============================================================================
    children: {
      description: 'Trigger element that opens the menu when clicked (button, text, icon, etc.)',
      table: {
        category: 'Content & Trigger',
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
      control: { type: 'text' },
    },
    content: {
      description: 'Menu content to be rendered inside the dropdown (typically DropdownItem components)',
      table: {
        category: 'Content & Trigger',
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // ============================================================================
    // Behavior & Interaction
    // ============================================================================
    onSelect: {
      description: 'Callback fired when a menu item is selected. Receives the selected item data',
      table: {
        category: 'Behavior & Interaction',
        type: {
          summary: '(props: OnSelectProps) => void',
          detail: 'OnSelectProps = { event: SyntheticBaseEvent, data: { name: string, value: unknown }',
        },
        defaultValue: { summary: 'undefined' },
      },
      action: 'selected',
    },
    closeOnSelect: {
      description:
        'Whether to close the menu when an option is clicked. Set to false to keep menu open for multiple selections',
      table: {
        category: 'Behavior & Interaction',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
      control: { type: 'boolean' },
    },
    itemIdentifier: {
      description: 'Function to extract unique identifier from menu items for selection tracking',
      table: {
        category: 'Behavior & Interaction',
        type: { summary: '(item: unknown) => string | number' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // ============================================================================
    // Menu Options (Positioning & Dimensions)
    // ============================================================================
    placement: {
      description: 'Position of the menu relative to the trigger. Defaults to "bottom-right" if not specified',
      table: {
        category: 'Menu Options (Positioning & Dimensions)',
        type: { summary: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'" },
        defaultValue: { summary: "'bottom-right'" },
      },
      control: { type: 'select' },
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    },
    offsetX: {
      description:
        'Horizontal distance in pixels between the menu and the trigger element. Used for positioning calculations',
      table: {
        category: 'Menu Options (Positioning & Dimensions)',
        type: { summary: 'number' },
        defaultValue: { summary: '4' },
      },
      control: { type: 'number' },
    },
    offsetY: {
      description:
        'Vertical distance in pixels between the menu and the trigger element. Used for positioning calculations',
      table: {
        category: 'Menu Options (Positioning & Dimensions)',
        type: { summary: 'number' },
        defaultValue: { summary: '4' },
      },
      control: { type: 'number' },
    },
    minHeight: {
      description:
        'Minimum height constraint for the menu dropdown in pixels. Used for dynamic height calculations based on available viewport space',
      table: {
        category: 'Menu Options (Positioning & Dimensions)',
        type: { summary: 'number' },
        defaultValue: { summary: '80' },
      },
      control: { type: 'number' },
    },
    maxHeight: {
      description:
        'Maximum height constraint for the menu dropdown in pixels. Used for dynamic height calculations based on available viewport space',
      table: {
        category: 'Menu Options (Positioning & Dimensions)',
        type: { summary: 'number' },
        defaultValue: { summary: '400' },
      },
      control: { type: 'number' },
    },

    // ============================================================================
    // Box Styles - Layout & Sizing
    // ============================================================================
    width: {
      description: 'Sets the width of the menu container',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string' },
      },
    },
    height: {
      description: 'Sets the height of the menu container',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string' },
      },
    },
    minWidth: {
      description: 'CSS min-width property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },
    maxWidth: {
      description: 'CSS max-width property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },

    // ============================================================================
    // Box Styles - Spacing
    // ============================================================================
    margin: {
      description: 'CSS margin property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    marginTop: {
      description: 'CSS margin-top property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    marginRight: {
      description: 'CSS margin-right property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    marginBottom: {
      description: 'CSS margin-bottom property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    marginLeft: {
      description: 'CSS margin-left property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    padding: {
      description: 'CSS padding property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    paddingTop: {
      description: 'CSS padding-top property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    paddingRight: {
      description: 'CSS padding-right property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    paddingBottom: {
      description: 'CSS padding-bottom property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    paddingLeft: {
      description: 'CSS padding-left property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },

    // ============================================================================
    // Box Styles - Flexbox
    // ============================================================================
    flexDirection: {
      description: 'CSS flex-direction property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    justifyContent: {
      description: 'CSS justify-content property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    justifySelf: {
      description: 'CSS justify-self property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    alignItems: {
      description: 'CSS align-items property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    alignSelf: {
      description: 'CSS align-self property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    alignContent: {
      description: 'CSS align-content property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    flexWrap: {
      description: 'CSS flex-wrap property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    flexGrow: {
      description: 'CSS flex-grow property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    flexShrink: {
      description: 'CSS flex-shrink property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    flexBasis: {
      description: 'CSS flex-basis property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    flex: {
      description: 'CSS flex property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    order: {
      description: 'CSS order property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    gap: {
      description: 'CSS gap property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },

    // ============================================================================
    // Box Styles - Position & Display
    // ============================================================================
    display: {
      control: { type: 'select' },
      options: ['block', 'flex', 'inline', 'inline-flex', 'grid', 'none'],
      description: 'CSS display property to control the layout behavior',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Position & Display',
      },
    },
    position: {
      description: 'CSS position property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string' },
      },
    },
    top: {
      description: 'CSS top property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string | number' },
      },
    },
    right: {
      description: 'CSS right property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string | number' },
      },
    },
    bottom: {
      description: 'CSS bottom property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string | number' },
      },
    },
    left: {
      description: 'CSS left property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string | number' },
      },
    },
    overflow: {
      description: 'CSS overflow property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string' },
      },
    },
    zIndex: {
      description: 'CSS z-index property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string | number' },
      },
    },

    // ============================================================================
    // Custom Styling
    // ============================================================================
    styles: {
      description: 'Custom CSS styles object to be applied to the menu dropdown container',
      table: {
        category: 'Custom Styling',
        type: { summary: 'CSSObject' },
        defaultValue: { summary: 'undefined' },
      },
      control: { type: 'object' },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Menu\` component is a flexible dropdown menu that provides a list of selectable options with various interaction patterns.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li><b>Interactive Behavior</b>
  <ul>
  <li>Click outside to close</li>
  <li>Item selection handling</li>
  <li>Keyboard navigation support</li>
  <li>Optional menu persistence with <code>closeOnSelect={false}</code></li>
  <li>Public API via ref (<code>open()</code>, <code>close()</code>, <code>toggle()</code>)</li>
  </ul>
  </li>
  <li><b>Positioning</b>
  <ul>
  <li>Explicit positioning with <code>placement</code> prop (<code>"top-left"</code>, <code>"top-right"</code>, <code>"bottom-left"</code>, <code>"bottom-right"</code>)</li>
  <li>Default placement is <code>"bottom-right"</code> when not specified</li>
  <li>Accurate corner positioning aligned to trigger edges</li>
  <li>Scroll-aware positioning calculations</li>
  </ul>
  </li>
  <li><b>Box Layout Support</b>
  <ul>
  <li>Full Box component props support for flexible layout control</li>
  <li>Use <code>margin</code>, <code>padding</code>, <code>position</code>, <code>flex</code>, <code>gap</code>, and more for precise positioning and spacing</li>
  <li>Dimensions: <code>width</code>, <code>height</code>, <code>minWidth</code>, <code>minHeight</code>, <code>maxWidth</code>, <code>maxHeight</code></li>
  </ul>
  </li>
  <li><b>Customization</b>
  <ul>
  <li>Custom trigger elements</li>
  <li>Flexible content rendering</li>
  <li>Theme customization</li>
  </ul>
  </li>
  <li><b>Accessibility</b>
  <ul>
  <li>ARIA attributes</li>
  <li>Keyboard navigation</li>
  <li>Focus management</li>
  </ul>
  </li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Positioning</b>
  <ul>
  <li><code>placement</code>: Menu position relative to trigger</li>
  <li><code>offsetX</code>: Horizontal distance in pixels between menu and trigger (default: 4)</li>
  <li><code>offsetY</code>: Vertical distance in pixels between menu and trigger (default: 4)</li>
  <li><code>minHeight</code>: Minimum height constraint in pixels (default: 80)</li>
  <li><code>maxHeight</code>: Maximum height constraint in pixels (default: 400)</li>
  </ul>
  </li>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width/height</code>: Exact dimensions</li>
  <li><code>minWidth</code>: Minimum width constraint</li>
  <li><code>maxWidth</code>: Maximum width constraint</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin/padding</code>: Overall spacing</li>
  <li><code>marginTop/paddingTop</code>: Top spacing</li>
  <li><code>marginRight/paddingRight</code>: Right spacing</li>
  <li><code>marginBottom/paddingBottom</code>: Bottom spacing</li>
  <li><code>marginLeft/paddingLeft</code>: Left spacing</li>
  </ul>
  </li>
  <li><b>Flexbox</b>
  <ul>
  <li><code>flexDirection</code>, <code>justifyContent</code>, <code>alignItems</code>, <code>flexWrap</code></li>
  <li><code>flex</code>, <code>flexGrow</code>, <code>flexShrink</code>, <code>flexBasis</code></li>
  <li><code>gap</code>, <code>order</code></li>
  </ul>
  </li>
  <li><b>Position & Display</b>
  <ul>
  <li><code>display</code>: Layout behavior</li>
  <li><code>position</code>, <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code></li>
  <li><code>overflow</code>, <code>zIndex</code></li>
  </ul>
  </li>
  <li><b>Styling</b>
  <ul>
  <li><code>styles</code>: Custom CSS styles object</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;

const Template: StoryFn = (args) => {
  const MenuContent = () => (
    <>
      {MENU_ITEMS.map((item) => (
        <DropdownItem {...item} key={item.value} />
      ))}
    </>
  );

  return (
    <Menu {...args} content={<MenuContent />}>
      Menu
    </Menu>
  );
};

export const Default = Template.bind({});
Default.args = {
  onSelect: fn(action('Menu item selected')),
};
Default.parameters = {
  docs: {
    source: {
      code: `
import { Menu, DropdownItem } from 'gd-design-library';

const MENU_ITEMS = [
  { name: 'Profile', value: 'profile' },
  { name: 'Settings', value: 'settings' },
  { name: 'Logout', value: 'logout' },
];

const MenuContent = () => (
  <>
    {MENU_ITEMS.map((item) => (
      <DropdownItem {...item} key={item.value} />
    ))}
  </>
);

const Example = () => {
  return (
    <Menu
      onSelect={(props) => {
        console.log('Selected:', props.data);
      }}
      content={<MenuContent />}
    >
      Menu
    </Menu>
  );
};
`,
    },
  },
};
Default.play = defaultActions;

export const CloseOnSelectFalse = Template.bind({});
CloseOnSelectFalse.args = {
  closeOnSelect: false,
  onSelect: action('Menu item selected (menu stays open)'),
};
CloseOnSelectFalse.parameters = {
  docs: {
    description: {
      story: 'Menu with `closeOnSelect={false}` - menu stays open after selecting items, allowing multiple selections.',
    },
    source: {
      code: `
import { Menu, DropdownItem } from 'gd-design-library';

const MENU_ITEMS = [
  { name: 'Profile', value: 'profile' },
  { name: 'Settings', value: 'settings' },
  { name: 'Logout', value: 'logout' },
];

const MenuContent = () => (
  <>
    {MENU_ITEMS.map((item) => (
      <DropdownItem {...item} key={item.value} />
    ))}
  </>
);

const Example = () => {
  return (
    <Menu
      closeOnSelect={false}
      onSelect={(props) => {
        console.log('Selected:', props.data);
      }}
      content={<MenuContent />}
    >
      Menu (Stays Open)
    </Menu>
  );
};
`,
    },
  },
};
CloseOnSelectFalse.play = closeOnSelectActions;

export const Placement: StoryFn = (args) => {
  const MenuContent = () => (
    <>
      {MENU_ITEMS.map((item) => (
        <DropdownItem {...item} key={item.value} />
      ))}
    </>
  );
  return (
    <Menu
      {...args}
      onSelect={(data) => {
        action('Selected')(data);
      }}
      content={<MenuContent />}
    >
      Menu (Placement)
    </Menu>
  );
};
Placement.parameters = {
  docs: {
    description: {
      story: 'Menu with `placement="top-left"` - menu appears above and aligned to the left of the trigger.',
    },
    source: {
      code: `
import { Menu, DropdownItem } from 'gd-design-library';

const MENU_ITEMS = [
  { name: 'Profile', value: 'profile' },
  { name: 'Settings', value: 'settings' },
  { name: 'Logout', value: 'logout' },
];

const MenuContent = () => (
  <>
    {MENU_ITEMS.map((item) => (
      <DropdownItem {...item} key={item.value} />
    ))}
  </>
);

const Example = () => {
  return (
    <Menu
      placement="top-left"
      onSelect={(props) => {
        console.log('Selected:', props.data);
      }}
      content={<MenuContent />}
    >
      Menu (Placement)
    </Menu>
  );
};
`,
    },
  },
};

export const WithRefControl: StoryFn = () => {
  const menuRef = useRef<MenuRef | null>(null);
  const onSelect: SelectOnSelect = fn((props) => {
    action('Selected:')(props);
  });

  const MenuContent = () => (
    <>
      {MENU_ITEMS.map((item) => (
        <DropdownItem {...item} key={item.value} />
      ))}
    </>
  );

  return (
    <Column gap="16px">
      <Row gap="8px">
        <Button variant="secondary" onClick={(e) => menuRef.current?.open(e.target)}>
          Open Menu
        </Button>
        <Button variant="outlined" onClick={(e) => menuRef.current?.close(e.target)}>
          Close Menu
        </Button>
      </Row>
      <Row gap="8px">
        <Menu ref={menuRef} onSelect={onSelect} content={<MenuContent />}>
          <Typography styleVariant="bold">Menu (Controlled via Ref)</Typography>
        </Menu>
      </Row>
    </Column>
  );
};
WithRefControl.parameters = {
  docs: {
    description: {
      story:
        'Menu controlled via ref API - demonstrates programmatic control using `ref.open()` and `ref.close()` methods. Pass `event.target` as the parameter to identify API-controlled interactions, which helps distinguish programmatic control from user interactions.',
    },
    source: {
      code: `
import { useRef } from 'react';
import { Button, Column, Menu, DropdownItem, MenuRef, Row, Typography } from 'gd-design-library';

const MENU_ITEMS = [
  { name: 'Profile', value: 'profile' },
  { name: 'Settings', value: 'settings' },
  { name: 'Logout', value: 'logout' },
];

const MenuContent = () => (
  <>
    {MENU_ITEMS.map((item) => (
      <DropdownItem {...item} key={item.value} />
    ))}
  </>
);

const Example = () => {
  const menuRef = useRef<MenuRef>(null);

  return (
    <Column gap="16px">
      <Row gap="8px">
        <Button 
          variant="secondary" 
          onClick={(e) => menuRef.current?.open(e.target)}
        >
          Open Menu
        </Button>
        <Button 
          variant="outlined" 
          onClick={(e) => menuRef.current?.close(e.target)}
        >
          Close Menu
        </Button>
      </Row>
      <Row gap="8px">
        <Menu ref={menuRef} onSelect={onSelect} content={<MenuContent />}>
          <Typography styleVariant="bold">Menu (Controlled via Ref)</Typography>
        </Menu>
      </Row>
    </Column>
  );
};
`,
    },
  },
};
WithRefControl.play = withRefControlActions;

export const WithOffset: StoryFn = (args) => {
  const MenuContent = () => (
    <>
      {MENU_ITEMS.map((item) => (
        <DropdownItem {...item} key={item.value} />
      ))}
    </>
  );
  return (
    <Menu
      {...args}
      onSelect={(data) => {
        action('Selected')(data);
      }}
      content={<MenuContent />}
    >
      Menu (Custom Offset)
    </Menu>
  );
};
WithOffset.args = {
  offsetX: 12,
  offsetY: 8,
  onSelect: action('Menu item selected'),
};
WithOffset.parameters = {
  docs: {
    description: {
      story:
        'Menu with custom `offsetX={12}` and `offsetY={8}` - controls the horizontal and vertical distance in pixels between the menu and trigger element. Defaults are 4 pixels for both. Use `offsetX` for horizontal spacing and `offsetY` for vertical spacing.',
    },
    source: {
      code: `
import { Menu, DropdownItem } from 'gd-design-library';

const MENU_ITEMS = [
  { name: 'Profile', value: 'profile' },
  { name: 'Settings', value: 'settings' },
  { name: 'Logout', value: 'logout' },
];

const MenuContent = () => (
  <>
    {MENU_ITEMS.map((item) => (
      <DropdownItem {...item} key={item.value} />
    ))}
  </>
);

const Example = () => {
  return (
    <Menu
      offsetX={12}
      offsetY={8}
      onSelect={(props) => {
        console.log('Selected:', props.data);
      }}
      content={<MenuContent />}
    >
      Menu (Custom Offset)
    </Menu>
  );
};
`,
    },
  },
};

export const WithHeightConstraints: StoryFn = (args) => {
  const longMenuItems = [
    { name: 'Profile', value: 'profile' },
    { name: 'Settings', value: 'settings' },
  ];

  const MenuContent = () => (
    <>
      {longMenuItems.map((item) => (
        <DropdownItem {...item} key={item.value} />
      ))}
    </>
  );
  return (
    <Box minHeight="100vh">
      <Menu
        {...args}
        onSelect={(data) => {
          action('Selected')(data);
        }}
        content={<MenuContent />}
      >
        Menu (Height Constraints)
      </Menu>
    </Box>
  );
};
WithHeightConstraints.args = {
  minHeight: 100,
  maxHeight: 300,
  onSelect: action('Menu item selected'),
};
WithHeightConstraints.parameters = {
  docs: {
    description: {
      story:
        'Menu with `minHeight={100}` and `maxHeight={300}` - controls dynamic height calculations based on available viewport space. The menu will adjust its height based on available space, respecting these constraints. Defaults are 80px and 400px respectively.',
    },
    source: {
      code: `
import { Menu, DropdownItem } from 'gd-design-library';

const MENU_ITEMS = [
  { name: 'Profile', value: 'profile' },
  { name: 'Settings', value: 'settings' },
  { name: 'Account', value: 'account' },
  { name: 'Preferences', value: 'preferences' },
  { name: 'Notifications', value: 'notifications' },
  { name: 'Privacy', value: 'privacy' },
  { name: 'Security', value: 'security' },
  { name: 'Billing', value: 'billing' },
  { name: 'Support', value: 'support' },
  { name: 'Logout', value: 'logout' },
];

const MenuContent = () => (
  <>
    {MENU_ITEMS.map((item) => (
      <DropdownItem {...item} key={item.value} />
    ))}
  </>
);

const Example = () => {
  return (
    <Box minHeight="100vh">
      <Menu
        minHeight={100}
        maxHeight={300}
        onSelect={(props) => {
          console.log('Selected:', props.data);
        }}
        content={<MenuContent />}
      >
        Menu (Height Constraints)
      </Menu>
    </Box>
  );
};
`,
    },
  },
};

export const WithPositioningOptions: StoryFn = (args) => {
  const MenuContent = () => (
    <>
      {MENU_ITEMS.map((item) => (
        <DropdownItem {...item} key={item.value} />
      ))}
    </>
  );
  return (
    <Menu
      {...args}
      onSelect={(data) => {
        action('Selected')(data);
      }}
      content={<MenuContent />}
    >
      Menu (All Positioning Options)
    </Menu>
  );
};
WithPositioningOptions.args = {
  placement: 'bottom-right',
  offsetX: 8,
  offsetY: 8,
  minHeight: 120,
  maxHeight: 350,
  onSelect: action('Menu item selected'),
};
WithPositioningOptions.parameters = {
  docs: {
    description: {
      story:
        'Menu with all positioning options - demonstrates `placement`, `offsetX`, `offsetY`, `minHeight`, and `maxHeight` props working together for precise menu positioning and sizing.',
    },
    source: {
      code: `
import { Menu, DropdownItem } from 'gd-design-library';

const MENU_ITEMS = [
  { name: 'Profile', value: 'profile' },
  { name: 'Settings', value: 'settings' },
  { name: 'Logout', value: 'logout' },
];

const MenuContent = () => (
  <>
    {MENU_ITEMS.map((item) => (
      <DropdownItem {...item} key={item.value} />
    ))}
  </>
);

const Example = () => {
  return (
    <Menu
      placement="bottom-right"
      offsetX={8}
      offsetY={8}
      minHeight={120}
      maxHeight={350}
      onSelect={(props) => {
        console.log('Selected:', props.data);
      }}
      content={<MenuContent />}
    >
      Menu (All Positioning Options)
    </Menu>
  );
};
`,
    },
  },
};

export const WithEditAndDeleteModals: StoryFn = () => {
  const [modalVisibility, setModalVisibility] = useState({ edit: false, delete: false });
  const [selectedItem, setSelectedItem] = useState<{ name: string; value: string } | null>(null);

  const MENU_ITEMS_WITH_ACTIONS = [
    { name: 'Edit', value: 'edit' },
    { name: 'Delete', value: 'delete' },
    { name: 'View', value: 'view' },
  ];

  const toggleModalVisibility = (modalName: string, isVisible = false) => {
    setModalVisibility((props) => ({ ...props, [modalName]: isVisible }));
  };

  const handleSelect: SelectOnSelect = ({ data }) => {
    setSelectedItem(data as { name: string; value: string });
    toggleModalVisibility(data.value as string, true);
    action('Menu item selected')(data);
  };

  const MenuContent = () => (
    <>
      {MENU_ITEMS_WITH_ACTIONS.map((item) => (
        <DropdownItem {...item} key={item.value} />
      ))}
    </>
  );

  return (
    <Box height="100vh">
      <Menu onSelect={handleSelect} content={<MenuContent />}>
        Menu
      </Menu>

      <Modal
        isOpen={modalVisibility['edit']}
        onClose={() => toggleModalVisibility('edit', false)}
        closeOnEscape
        showCloseButton={false}
        footer={
          <Button variant="text" onClick={() => toggleModalVisibility('edit', false)}>
            Edit
          </Button>
        }
      >
        <Typography>Edit modal for item: {selectedItem?.name}</Typography>
      </Modal>

      <Modal
        isOpen={modalVisibility['delete']}
        onClose={() => toggleModalVisibility('delete', false)}
        closeOnEscape
        showCloseButton={false}
        footer={
          <Button variant="text" onClick={() => toggleModalVisibility('delete', false)}>
            Delete
          </Button>
        }
      >
        <Typography>Are you sure you want to delete: {selectedItem?.name}?</Typography>
      </Modal>
    </Box>
  );
};
WithEditAndDeleteModals.parameters = {
  docs: {
    description: {
      story:
        'Menu with Edit and Delete items that invoke modals on click. Clicking Edit opens an edit modal, and clicking Delete opens a delete confirmation modal.',
    },
    source: {
      code: `
import { useState } from 'react';
import { Menu, DropdownItem, Modal, Button, Row, Typography } from 'gd-design-library';

const MENU_ITEMS_WITH_ACTIONS = [
  { name: 'Edit', value: 'edit' },
  { name: 'Delete', value: 'delete' },
  { name: 'View', value: 'view' },
];

const Example = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (props) => {
    const { data } = props;
    setSelectedItem(data);
    
    if (data.value === 'edit') {
      setIsEditModalOpen(true);
    } else if (data.value === 'delete') {
      setIsDeleteModalOpen(true);
    }
  };

  const MenuContent = () => (
    <>
      {MENU_ITEMS_WITH_ACTIONS.map((item) => (
        <DropdownItem {...item} key={item.value} />
      ))}
    </>
  );

  return (
    <Box height="100vh">
      <Menu onSelect={handleSelect} content={<MenuContent />}>
        Menu
      </Menu>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        closeOnEscape
        showCloseButton={false}
        footer={
          <Button variant="text" onClick={() => setIsEditModalOpen(false)}>
            Edit
          </Button>
        }
      >
        <Typography>Edit modal for item: {selectedItem?.name}</Typography>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        closeOnEscape
        showCloseButton={false}
        footer={
          <Button variant="text" onClick={() => setIsDeleteModalOpen(false)}>
            Delete
          </Button>
        }
      >
        <Typography>Are you sure you want to delete: {selectedItem?.name}?</Typography>
      </Modal>
    </Box>
  );
};
`,
    },
  },
};
WithEditAndDeleteModals.play = withEditAndDeleteModalsActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ menu: defaultTheme.menu }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
