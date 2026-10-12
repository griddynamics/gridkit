import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock } from 'gd-design-core';
import { defaultTheme, select } from 'gd-design-library/tokens';
import type { GdMenu } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes, stack } from './helpers';

type Args = Partial<Pick<GdMenu, 'closeOnSelect' | 'placement' | 'offsetX' | 'offsetY' | 'minHeight' | 'maxHeight'>>;
function menuExample(args: Args, label = 'Menu', names = ['Profile', 'Settings', 'Logout']) {
  const menu = element('gd-menu', args);
  const trigger = document.createElement('span');
  trigger.slot = 'trigger';
  trigger.textContent = label;
  const content = document.createElement('div');
  content.slot = 'content';
  const style = document.createElement('style');
  const itemTokens = resolveThemeTree(select.item, defaultTheme) as unknown as { default: ButtonCssBlock };
  style.textContent = buttonCssBlockToText('.story-menu-item', itemTokens.default);
  content.append(style);
  for (const name of names) {
    const item = document.createElement('div');
    item.className = 'story-menu-item';
    item.role = 'button';
    item.tabIndex = 0;
    item.textContent = name;
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        item.click();
      }
    });
    item.dataset.gdMenuName = name;
    item.dataset.gdMenuValue = name.toLowerCase();
    content.append(item);
  }
  menu.append(trigger, content);
  return menu;
}
const meta = {
  title: 'Molecules/Menu',
  tags: ['autodocs'],
  argTypes: sectionedArgTypes('Menu', {}),
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Menu with selection, positioning, imperative controls and modal actions.' } },
  },
  render: (args: Args) => menuExample(args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const CloseOnSelectFalse: Story = { args: { closeOnSelect: false } };
export const Placement: Story = { render: (args) => menuExample(args, 'Menu (Placement)') };
export const WithRefControl: Story = {
  render: () => {
    const menu = menuExample({}, 'Menu (Controlled via Ref)');
    const trigger = menu.querySelector('[slot="trigger"]')!;
    trigger.textContent = '';
    trigger.append(element('gd-typography', { styleVariant: 'bold' }, 'Menu (Controlled via Ref)'));
    const open = element('gd-button', { variant: 'secondary' }, 'Open Menu');
    const close = element('gd-button', { variant: 'outlined' }, 'Close Menu');
    open.addEventListener('click', () => {
      menu.open = true;
    });
    close.addEventListener('click', () => {
      menu.open = false;
    });
    return stack('column', '16px', stack('row', '8px', open, close), stack('row', '8px', menu));
  },
};
export const WithOffset: Story = {
  args: { offsetX: 12, offsetY: 8 },
  render: (args) => menuExample(args, 'Menu (Custom Offset)'),
};
export const WithHeightConstraints: Story = {
  args: { minHeight: 100, maxHeight: 300 },
  render: (args) => {
    const box = element('gd-box', { styles: { minHeight: '100vh' } });
    box.append(menuExample(args, 'Menu (Height Constraints)', ['Profile', 'Settings']));
    return box;
  },
};
export const WithPositioningOptions: Story = {
  args: { placement: 'bottom-right', offsetX: 8, offsetY: 8, minHeight: 120, maxHeight: 350 },
  render: (args) => menuExample(args, 'Menu (All Positioning Options)'),
};
export const WithEditAndDeleteModals: Story = {
  render: () => {
    const box = element('gd-box', { styles: { height: '100vh' } });
    const menu = menuExample({}, 'Menu', ['Edit', 'Delete', 'View']);
    // Until Modal is ported, use its shared tokens with native dialog semantics.
    const dialog = document.createElement('dialog');
    dialog.className = 'story-menu-dialog';
    const tokens = resolveThemeTree(defaultTheme.modal, defaultTheme) as unknown as Record<
      string,
      { default: ButtonCssBlock }
    >;
    const style = document.createElement('style');
    style.textContent =
      '.story-menu-dialog{border:0;margin:auto}.story-menu-dialog:not([open]){display:none}' +
      buttonCssBlockToText('.story-menu-dialog[open]', tokens.content.default) +
      buttonCssBlockToText('.story-menu-dialog::backdrop', { background: tokens.overlay.default.background }) +
      buttonCssBlockToText('.story-menu-dialog-body', tokens.body.default) +
      buttonCssBlockToText('.story-menu-dialog-footer', tokens.footer.default);
    const body = document.createElement('div');
    body.className = 'story-menu-dialog-body';
    const footer = document.createElement('div');
    footer.className = 'story-menu-dialog-footer';
    const text = element('gd-typography', {});
    const close = element('gd-button', { variant: 'text' });
    close.addEventListener('click', () => dialog.close());
    body.append(text);
    footer.append(close);
    dialog.append(body, footer);
    dialog.addEventListener('click', (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom)
      )
        dialog.close();
    });
    menu.addEventListener('gd-change', (event) => {
      const { data } = (event as CustomEvent<{ data: { name: string; value: string } }>).detail;
      if (!['edit', 'delete'].includes(data.value)) return;
      text.textContent =
        data.value === 'edit' ? `Edit modal for item: ${data.name}` : `Are you sure you want to delete: ${data.name}?`;
      close.textContent = data.name;
      dialog.showModal();
    });
    box.append(style, menu, dialog);
    return box;
  },
};
export const DefaultTokens: Story = { parameters: { layout: 'padded' }, render: () => defaultTokenViewer('menu') };
