import { get } from '@utils';

export const menu = {
  wrapper: {
    default: {},
  },
  content: {
    default: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'),
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.high', 'theme.zIndex.high'),
      position: 'absolute',
      overflow: 'auto',
      boxShadow: (theme: Record<symbol, unknown>) => get(theme, 'shadows.box["1"]', 'theme.shadows.box["1"]'),
    },
  },
  attrs: {
    minHeight: 80,
    maxHeight: 400,
    offsetX: 4,
    offsetY: 4,
  },
  webComponent: {
    host: { display: 'inline-block' },
    trigger: {
      default: {
        alignItems: 'center',
        background: 'none',
        border: 0,
        color: 'inherit',
        cursor: 'pointer',
        display: 'inline-flex',
        font: 'inherit',
        padding: 0,
      },
      focusVisible: {
        outline: (theme: Record<symbol, unknown>) => `2px solid ${get(theme, 'colors.border.focus')}`,
        outlineOffset: '2px',
      },
    },
    content: {
      border: 0,
      boxSizing: 'border-box',
      // Native popovers default to `inset: 0` with auto margins. Reset both so the
      // runtime top/left geometry positions the menu like the React portal.
      inset: 'auto',
      // A positioned block with auto dimensions can expand to the viewport before Menu measures
      // it. Keep the native popover intrinsic so the runtime overflow clamp positions the menu
      // beside its trigger instead of pinning a viewport-sized box to the top-left.
      height: 'fit-content',
      // The React harness supplies one block wrapper for the content slot. A block popover lets
      // that wrapper fill the viewport; inline-block preserves intrinsic sizing for both direct
      // items and a slotted wrapper.
      display: 'inline-block',
      margin: 0,
      overflow: 'auto',
      padding: 0,
      position: 'fixed',
      width: 'fit-content',
    },
  },
};
