import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { action } from 'storybook/actions';
import type { GdMenu } from '../src';
import { defaultTokenViewer } from './helpers';
import { formattedSource, type BoxStoryArgs } from './layout-story-helpers';
import {
  box,
  button,
  column,
  createMenu,
  createModal,
  logSelection,
  MENU_ITEMS,
  row,
  typography,
  triggerText,
  type MenuOptionData,
} from './menu-story-helpers';
import {
  closeOnSelectActions,
  defaultActions,
  withEditAndDeleteModalsActions,
  withRefControlActions,
} from './Menu.stories.play';

// `children`, `content` and `gd-change` only document the trigger slot, the content slot and the element's event in
// the controls table; the story owns the slotted nodes and never forwards them to the element.
type Args = Pick<
  GdMenu,
  'closeOnSelect' | 'placement' | 'offsetX' | 'offsetY' | 'minHeight' | 'maxHeight' | 'itemIdentifier'
> &
  Omit<BoxStoryArgs, 'minHeight' | 'maxHeight' | 'styles'> & {
    styles?: Record<string, string | number>;
    children?: string;
    content?: unknown;
    'gd-change'?: unknown;
  };

const argType = (description: string, summary: string, category: string, control: 'text' | 'object' = 'text') => ({
  description,
  control,
  table: { category, type: { summary } },
});
const SIZING = 'Box Styles - Layout & Sizing';
const SPACING = 'Box Styles - Spacing';
const FLEXBOX = 'Box Styles - Flexbox';
const POSITION = 'Box Styles - Position & Display';
const spacing = (property: string) => argType(`CSS ${property} property`, 'string | number', SPACING);
const flex = (property: string, summary = 'string') => argType(`CSS ${property} property`, summary, FLEXBOX);
const position = (property: string, summary = 'string | number') =>
  argType(`CSS ${property} property`, summary, POSITION);

const menuSource = (
  items: MenuOptionData[],
  label: string,
  { attributes = '', setup = '' }: { attributes?: string; setup?: string } = {}
) => `<gd-menu${attributes}>
  <span slot="trigger">${label}</span>
${items
  .map(
    ({ name, value }) =>
      `  <div slot="content" tabindex="0" data-testid="DropdownItem" data-gd-menu-name="${name}" data-gd-menu-value="${value}">${name}</div>`
  )
  .join('\n')}
</gd-menu>

<script type="module">
  import 'web-components';
  import { defaultTheme } from 'gd-design-library/tokens';

  const menu = document.querySelector('gd-menu');
  menu.theme = defaultTheme;
${setup}  menu.addEventListener('gd-change', (event) => {
    console.log('Selected:', event.detail.data);
  });
</script>`;

const storyParameters = (source: string, description?: string, extra: Record<string, unknown> = {}) => ({
  ...extra,
  docs: {
    ...(description ? { description: { story: description } } : {}),
    ...formattedSource(source).docs,
  },
});

const defined = <T extends Record<string, unknown>>(values: T) =>
  Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined)) as Partial<T>;

const menuOwnKeys = [
  'closeOnSelect',
  'placement',
  'offsetX',
  'offsetY',
  'minHeight',
  'maxHeight',
  'itemIdentifier',
] as const;
const documentationOnlyKeys = ['children', 'content', 'gd-change', 'styles', ...menuOwnKeys];

/** The menu arguments split into the menu element's own properties and the Box styles the trigger wrapper receives. */
const menuProps = (args: Args) => {
  const boxStyles = Object.fromEntries(Object.entries(args).filter(([key]) => !documentationOnlyKeys.includes(key)));
  const own = Object.fromEntries(menuOwnKeys.map((key) => [key, args[key]]));
  return defined({ ...own, styles: { ...defined(boxStyles), ...args.styles } }) as Partial<GdMenu>;
};

const MENU_ITEMS_WITH_ACTIONS: MenuOptionData[] = [
  { name: 'Edit', value: 'edit' },
  { name: 'Delete', value: 'delete' },
  { name: 'View', value: 'view' },
];

const meta = {
  title: 'Molecules/Menu',
  component: 'gd-menu',
  tags: ['autodocs'],
  argTypes: {
    // ============================================================================
    // Content & Trigger
    // ============================================================================
    children: {
      description:
        'Trigger element that opens the menu when clicked (button, text, icon, etc.), placed in the trigger slot',
      table: {
        category: 'Content & Trigger',
        type: { summary: 'Node' },
        defaultValue: { summary: 'undefined' },
      },
      control: { type: 'text' },
    },
    content: {
      description:
        'Menu content to be rendered inside the dropdown (typically selectable items), placed in the content slot',
      table: {
        category: 'Content & Trigger',
        type: { summary: 'Node' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // ============================================================================
    // Behavior & Interaction
    // ============================================================================
    'gd-change': {
      description:
        'Event fired when a menu item is selected. The selected item data is available as `event.detail.data`',
      table: {
        category: 'Behavior & Interaction',
        type: {
          summary: 'CustomEvent<{ data: { name?: string, value: unknown }, value: unknown }>',
        },
        defaultValue: { summary: 'undefined' },
      },
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
    width: argType('Sets the width of the menu container', 'string', SIZING),
    height: argType('Sets the height of the menu container', 'string', SIZING),
    minWidth: argType('CSS min-width property', 'string | number', SIZING),
    maxWidth: argType('CSS max-width property', 'string | number', SIZING),

    // ============================================================================
    // Box Styles - Spacing
    // ============================================================================
    margin: spacing('margin'),
    marginTop: spacing('margin-top'),
    marginRight: spacing('margin-right'),
    marginBottom: spacing('margin-bottom'),
    marginLeft: spacing('margin-left'),
    padding: spacing('padding'),
    paddingTop: spacing('padding-top'),
    paddingRight: spacing('padding-right'),
    paddingBottom: spacing('padding-bottom'),
    paddingLeft: spacing('padding-left'),

    // ============================================================================
    // Box Styles - Flexbox
    // ============================================================================
    flexDirection: flex('flex-direction'),
    justifyContent: flex('justify-content'),
    justifySelf: flex('justify-self'),
    alignItems: flex('align-items'),
    alignSelf: flex('align-self'),
    alignContent: flex('align-content'),
    flexWrap: flex('flex-wrap'),
    flexGrow: flex('flex-grow', 'string | number'),
    flexShrink: flex('flex-shrink', 'string | number'),
    flexBasis: flex('flex-basis', 'string | number'),
    flex: flex('flex', 'string | number'),
    order: flex('order', 'string | number'),
    gap: flex('gap', 'string | number'),

    // ============================================================================
    // Box Styles - Position & Display
    // ============================================================================
    display: {
      control: { type: 'select' },
      options: ['block', 'flex', 'inline', 'inline-flex', 'grid', 'none'],
      description: 'CSS display property to control the layout behavior',
      table: {
        type: { summary: 'string' },
        category: POSITION,
      },
    },
    position: position('position', 'string'),
    top: position('top'),
    right: position('right'),
    bottom: position('bottom'),
    left: position('left'),
    overflow: position('overflow', 'string'),
    zIndex: position('z-index'),

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
  The \`gd-menu\` element is a flexible dropdown menu that provides a list of selectable options with various interaction patterns.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li><b>Interactive Behavior</b>
  <ul>
  <li>Click outside to close</li>
  <li>Item selection handling</li>
  <li>Keyboard navigation support</li>
  <li>Optional menu persistence with <code>closeOnSelect = false</code></li>
  <li>Public API on the element (<code>openMenu()</code>, <code>closeMenu()</code>, <code>toggleMenu()</code>)</li>
  </ul>
  </li>
  <li><b>Positioning</b>
  <ul>
  <li>Explicit positioning with <code>placement</code> property (<code>"top-left"</code>, <code>"top-right"</code>, <code>"bottom-left"</code>, <code>"bottom-right"</code>)</li>
  <li>Default placement is <code>"bottom-right"</code> when not specified</li>
  <li>Accurate corner positioning aligned to trigger edges</li>
  <li>Scroll-aware positioning calculations</li>
  </ul>
  </li>
  <li><b>Box Layout Support</b>
  <ul>
  <li>Box style properties for flexible layout control</li>
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
  // The trigger text is fixed by the story, like the source story's template, while the menu options come from the controls.
  render: (args: Args) => logSelection(createMenu(menuProps(args), 'Menu'), 'Menu item selected'),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  parameters: storyParameters(menuSource(MENU_ITEMS, 'Menu')),
  play: defaultActions,
};

export const CloseOnSelectFalse: Story = {
  args: { closeOnSelect: false },
  render: (args) => logSelection(createMenu(menuProps(args), 'Menu'), 'Menu item selected (menu stays open)'),
  parameters: storyParameters(
    menuSource(MENU_ITEMS, 'Menu (Stays Open)', { setup: '  menu.closeOnSelect = false;\n' }),
    'Menu with `closeOnSelect = false` - menu stays open after selecting items, allowing multiple selections.'
  ),
  play: closeOnSelectActions,
};

export const Placement: Story = {
  render: (args) => logSelection(createMenu(menuProps(args), 'Menu (Placement)'), 'Selected'),
  parameters: storyParameters(
    menuSource(MENU_ITEMS, 'Menu (Placement)', { attributes: ' placement="top-left"' }),
    'Menu with `placement="top-left"` - menu appears above and aligned to the left of the trigger.'
  ),
};

export const WithRefControl: Story = {
  render: () => {
    const menu = logSelection(
      createMenu({}, typography({ styleVariant: 'bold', slot: 'trigger' }, 'Menu (Controlled via Ref)')),
      'Selected:'
    );
    const open = button({ variant: 'secondary' }, 'Open Menu');
    const close = button({ variant: 'outlined' }, 'Close Menu');
    open.addEventListener('click', () => menu.openMenu());
    close.addEventListener('click', () => menu.closeMenu());
    return column({ gap: '16px' }, row({ gap: '8px' }, open, close), row({ gap: '8px' }, menu));
  },
  parameters: storyParameters(
    `<gd-column gap="16px">
  <gd-row gap="8px">
    <gd-button id="open" variant="secondary">Open Menu</gd-button>
    <gd-button id="close" variant="outlined">Close Menu</gd-button>
  </gd-row>
  <gd-row gap="8px">
    <gd-menu id="menu">
      <gd-typography slot="trigger" style-variant="bold">Menu (Controlled via Ref)</gd-typography>
${MENU_ITEMS.map(
  ({ name, value }) =>
    `      <div slot="content" tabindex="0" data-testid="DropdownItem" data-gd-menu-name="${name}" data-gd-menu-value="${value}">${name}</div>`
).join('\n')}
    </gd-menu>
  </gd-row>
</gd-column>

<script type="module">
  import 'web-components';
  import { defaultTheme } from 'gd-design-library/tokens';

  const menu = document.querySelector('#menu');
  for (const node of document.querySelectorAll('gd-column, gd-row, gd-button, gd-menu, gd-typography')) {
    node.theme = defaultTheme;
  }

  document.querySelector('#open').addEventListener('click', () => menu.openMenu());
  document.querySelector('#close').addEventListener('click', () => menu.closeMenu());
  menu.addEventListener('gd-change', (event) => console.log('Selected:', event.detail.data));
</script>`,
    'Menu controlled through its element API - demonstrates programmatic control using the `openMenu()` and `closeMenu()` methods. Calls made from buttons outside the menu keep the menu state in sync with the trigger, which helps distinguish programmatic control from user interactions.'
  ),
  play: withRefControlActions,
};

export const WithOffset: Story = {
  args: { offsetX: 12, offsetY: 8 },
  render: (args) => logSelection(createMenu(menuProps(args), 'Menu (Custom Offset)'), 'Selected'),
  parameters: storyParameters(
    menuSource(MENU_ITEMS, 'Menu (Custom Offset)', { attributes: ' offset-x="12" offset-y="8"' }),
    'Menu with custom `offsetX={12}` and `offsetY={8}` - controls the horizontal and vertical distance in pixels between the menu and trigger element. Defaults are 4 pixels for both. Use `offsetX` for horizontal spacing and `offsetY` for vertical spacing.'
  ),
};

export const WithHeightConstraints: Story = {
  args: { minHeight: 100, maxHeight: 300 },
  render: (args) =>
    box(
      { minHeight: '100vh' },
      logSelection(
        createMenu(menuProps(args), 'Menu (Height Constraints)', [
          { name: 'Profile', value: 'profile' },
          { name: 'Settings', value: 'settings' },
        ]),
        'Selected'
      )
    ),
  parameters: storyParameters(
    `<gd-box min-height="100vh">
  <gd-menu min-height="100" max-height="300">
    <span slot="trigger">Menu (Height Constraints)</span>
${[
  'Profile',
  'Settings',
  'Account',
  'Preferences',
  'Notifications',
  'Privacy',
  'Security',
  'Billing',
  'Support',
  'Logout',
]
  .map(
    (name) =>
      `    <div slot="content" tabindex="0" data-testid="DropdownItem" data-gd-menu-name="${name}" data-gd-menu-value="${name.toLowerCase()}">${name}</div>`
  )
  .join('\n')}
  </gd-menu>
</gd-box>

<script type="module">
  import 'web-components';
  import { defaultTheme } from 'gd-design-library/tokens';

  for (const node of document.querySelectorAll('gd-box, gd-menu')) node.theme = defaultTheme;
  document.querySelector('gd-menu').addEventListener('gd-change', (event) => {
    console.log('Selected:', event.detail.data);
  });
</script>`,
    'Menu with `minHeight={100}` and `maxHeight={300}` - controls dynamic height calculations based on available viewport space. The menu will adjust its height based on available space, respecting these constraints. Defaults are 80px and 400px respectively.'
  ),
};

export const WithPositioningOptions: Story = {
  args: { placement: 'bottom-right', offsetX: 8, offsetY: 8, minHeight: 120, maxHeight: 350 },
  render: (args) => logSelection(createMenu(menuProps(args), 'Menu (All Positioning Options)'), 'Selected'),
  parameters: storyParameters(
    menuSource(MENU_ITEMS, 'Menu (All Positioning Options)', {
      attributes: ' placement="bottom-right" offset-x="8" offset-y="8" min-height="120" max-height="350"',
    }),
    'Menu with all positioning options - demonstrates `placement`, `offsetX`, `offsetY`, `minHeight`, and `maxHeight` props working together for precise menu positioning and sizing.'
  ),
};

export const WithEditAndDeleteModals: Story = {
  render: () => {
    const container = box({ height: '100vh' });
    const editModal = createModal(container, 'Edit');
    const deleteModal = createModal(container, 'Delete');
    const menu = createMenu({}, triggerText('Menu'), MENU_ITEMS_WITH_ACTIONS);
    menu.addEventListener('gd-change', (event) => {
      const data = (event as CustomEvent<{ data: MenuOptionData }>).detail.data;
      action('Menu item selected')(data);
      if (data.value === 'edit') editModal.open(`Edit modal for item: ${data.name}`);
      if (data.value === 'delete') deleteModal.open(`Are you sure you want to delete: ${data.name}?`);
    });
    container.append(menu);
    return container;
  },
  parameters: storyParameters(
    `<gd-box height="100vh">
  <gd-menu id="menu">
    <span slot="trigger">Menu</span>
${MENU_ITEMS_WITH_ACTIONS.map(
  ({ name, value }) =>
    `    <div slot="content" tabindex="0" data-testid="DropdownItem" data-gd-menu-name="${name}" data-gd-menu-value="${value}">${name}</div>`
).join('\n')}
  </gd-menu>
  <dialog id="edit-modal">
    <p>Edit modal for item: <span data-item></span></p>
    <button data-close>Edit</button>
  </dialog>
  <dialog id="delete-modal">
    <p>Are you sure you want to delete: <span data-item></span>?</p>
    <button data-close>Delete</button>
  </dialog>
</gd-box>

<script type="module">
  import 'web-components';
  import { defaultTheme } from 'gd-design-library/tokens';

  for (const node of document.querySelectorAll('gd-box, gd-menu')) node.theme = defaultTheme;

  const modals = { edit: document.querySelector('#edit-modal'), delete: document.querySelector('#delete-modal') };
  for (const modal of Object.values(modals)) {
    modal.querySelector('[data-close]').addEventListener('click', () => modal.close());
  }

  document.querySelector('#menu').addEventListener('gd-change', (event) => {
    const { data } = event.detail;
    const modal = modals[data.value];
    if (!modal) return;
    modal.querySelector('[data-item]').textContent = data.name;
    modal.showModal();
  });
</script>`,
    'Menu with Edit and Delete items that invoke modals on click. Clicking Edit opens an edit modal, and clicking Delete opens a delete confirmation modal.'
  ),
  play: withEditAndDeleteModalsActions,
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('menu'),
  parameters: {
    layout: 'padded',
  },
};
