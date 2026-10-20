import { action } from 'storybook/actions';
import { defaultTheme, select } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock } from '../src/core';
import type { GdButton, GdMenu, GdTypography } from '../src';
import { element } from './helpers';

export interface MenuOptionData {
  name: string;
  value: string;
}

export const MENU_ITEMS: MenuOptionData[] = [
  { name: 'Profile', value: 'profile' },
  { name: 'Settings', value: 'settings' },
  { name: 'Logout', value: 'logout' },
];

type Props = Record<string, unknown>;

export const typography = (props: Props, text: string) =>
  element('gd-typography', { variant: 'span', ...props } as Partial<GdTypography>, text);
export const row = (props: Props, ...children: Node[]) => {
  const node = element('gd-row', props);
  node.append(...children);
  return node;
};
export const column = (props: Props, ...children: Node[]) => {
  const node = element('gd-column', props);
  node.append(...children);
  return node;
};
export const box = (props: Props, ...children: Node[]) => {
  const node = element('gd-box', props);
  node.append(...children);
  return node;
};
export const button = (props: Props, text: string) => element('gd-button', props as Partial<GdButton>, text);

const itemStyleId = 'gd-menu-story-dropdown-item';

/** The item `select.item.default` token (padding, pointer cursor, hover/active fill), as stylesheet text. */
const dropdownItemCss = () => {
  const tokens = resolveThemeTree(select, defaultTheme) as unknown as { item: { default: ButtonCssBlock } };
  return buttonCssBlockToText('.gd-dropdown-item', tokens.item.default);
};

/** A selectable menu entry carrying the same test id, tab stop and Enter-key behaviour as a dropdown item. */
export const dropdownItem = ({ name, value }: MenuOptionData) => {
  const item = document.createElement('div');
  item.slot = 'content';
  item.className = 'gd-dropdown-item';
  item.tabIndex = 0;
  item.setAttribute('data-testid', 'DropdownItem');
  item.dataset.gdMenuName = name;
  item.dataset.gdMenuValue = value;
  item.textContent = name;
  item.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    item.click();
  });
  return item;
};

/** Menu entries, with the item stylesheet added to the document once. */
export const menuContent = (items: MenuOptionData[] = MENU_ITEMS) => {
  if (!document.getElementById(itemStyleId)) {
    const style = document.createElement('style');
    style.id = itemStyleId;
    style.textContent = dropdownItemCss();
    document.head.append(style);
  }
  return items.map(dropdownItem);
};

/** A trigger text node wrapped for the `trigger` slot. */
export const triggerText = (text: string) => {
  const trigger = document.createElement('span');
  trigger.slot = 'trigger';
  trigger.textContent = text;
  return trigger;
};

export const createMenu = (props: Partial<GdMenu>, trigger: Element | string, items: MenuOptionData[] = MENU_ITEMS) => {
  const menu = element('gd-menu', props);
  menu.append(typeof trigger === 'string' ? triggerText(trigger) : trigger, ...menuContent(items));
  // The most recently selected item stays highlighted, as the selected dropdown item does.
  menu.addEventListener('gd-change', (event) => {
    const { data } = (event as CustomEvent<{ data: MenuOptionData }>).detail;
    for (const item of menu.querySelectorAll<HTMLElement>('.gd-dropdown-item')) {
      item.classList.toggle('active', item.dataset.gdMenuValue === data.value);
    }
  });
  return menu;
};

/** Log a selection to the Actions panel, using the readable data object. */
export const logSelection = (menu: GdMenu, label: string) => {
  menu.addEventListener('gd-change', (event) => action(label)((event as CustomEvent<{ data: unknown }>).detail.data));
  return menu;
};

interface ModalTokens {
  overlay: { default: ButtonCssBlock };
  content: { default: ButtonCssBlock };
  body: { default: ButtonCssBlock };
  footer: { default: ButtonCssBlock };
}

const modalCss = () => {
  const tokens = resolveThemeTree(
    defaultTheme.modal as Record<string, unknown>,
    defaultTheme
  ) as unknown as ModalTokens;
  return [
    buttonCssBlockToText('.gd-modal-overlay', tokens.overlay.default),
    buttonCssBlockToText('.gd-modal-content', tokens.content.default),
    buttonCssBlockToText('.gd-modal-body', tokens.body.default),
    buttonCssBlockToText('.gd-modal-footer', tokens.footer.default),
  ].join('\n');
};

export interface StoryModal {
  readonly isOpen: boolean;
  open(text: string): void;
  close(): void;
}

/** A modal dialog drawn with the modal tokens: overlay, content, body, and a footer holding one text button. */
export const createModal = (container: HTMLElement, footerLabel: string, onClose: () => void = () => undefined) => {
  let overlay: HTMLElement | undefined;
  let wrapper: HTMLElement | undefined;
  let removeListener = (): void => undefined;
  const api: StoryModal = {
    get isOpen() {
      return Boolean(overlay);
    },
    open(text) {
      this.close();
      const style = document.createElement('style');
      style.textContent = modalCss();
      const body = document.createElement('div');
      body.className = 'gd-modal-body';
      body.setAttribute('data-testid', 'Modal-body');
      body.append(typography({}, text));
      const footer = document.createElement('div');
      footer.className = 'gd-modal-footer';
      footer.setAttribute('data-testid', 'Modal-footer');
      const closeButton = button({ variant: 'text' }, footerLabel);
      closeButton.addEventListener('click', () => {
        api.close();
        onClose();
      });
      footer.append(closeButton);
      const content = document.createElement('div');
      content.className = 'gd-modal-content';
      content.setAttribute('data-testid', 'Modal');
      content.setAttribute('role', 'dialog');
      content.setAttribute('aria-modal', 'true');
      content.addEventListener('click', (event) => event.stopPropagation());
      content.append(body, footer);
      overlay = document.createElement('div');
      overlay.className = 'gd-modal-overlay';
      overlay.addEventListener('click', () => {
        api.close();
        onClose();
      });
      overlay.append(style, content);
      // The modal is shown inside a full page wrapper, like a portal: a fixed, blurred layer above the page.
      wrapper = element('gd-wrapper', { variant: 'fullPage' });
      wrapper.append(overlay);
      container.append(wrapper);
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return;
        api.close();
        onClose();
      };
      document.addEventListener('keydown', onKeyDown);
      const blocked = document.body.style.overflow === 'hidden';
      if (!blocked) document.body.style.overflow = 'hidden';
      removeListener = () => {
        document.removeEventListener('keydown', onKeyDown);
        if (!blocked) document.body.style.overflow = '';
      };
    },
    close() {
      wrapper?.remove();
      wrapper = undefined;
      overlay = undefined;
      removeListener();
      removeListener = () => undefined;
    },
  };
  return api;
};
