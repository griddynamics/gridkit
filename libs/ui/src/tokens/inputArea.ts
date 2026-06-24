import { get } from '@utils';

export const inputArea = {
  lineHeight: {
    default: 20,
  },
  container: {
    default: {
      display: 'flex',
      flexDirection: 'column',
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
      border: (theme: Record<symbol, unknown>) =>
        `1px solid ${get(theme, 'colors.border.default', 'theme.colors.border.default')}`,
      borderRadius: 0,
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.inputArea.container', 'theme.values.transitions.inputArea.container'),
      '&:focus-within': {
        borderColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.border.default', 'theme.colors.border.default'),
      },
    },
    disabled: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.input.disabled', 'theme.colors.bg.fill.input.disabled'),
      border: (theme: Record<symbol, unknown>) =>
        `1px solid ${get(theme, 'colors.border.disabled', 'theme.colors.border.disabled')}`,
    },
  },
  actionsRow: {
    default: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    end: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
  },
  textarea: {
    default: {
      border: 'none',
      outline: 'none',
      resize: 'none',
      overflowY: 'auto',
      backgroundColor: 'transparent',
      padding: (theme: Record<symbol, unknown>) => `0 ${get(theme, 'spacing.xs', 'theme.spacing.xs')}`,
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      lineHeight: (theme: Record<symbol, unknown>) =>
        get(theme, 'font.line.height.small', 'theme.font.line.height.small'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      '&::placeholder': {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
      },
      '&:disabled': {
        backgroundColor: 'transparent',
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
        cursor: 'default',
      },
    },
  },
  tooltip: {
    position: 'bottom',
  },
  button: {
    variant: 'tertiary',
    default: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
    },

    send: {
      variant: 'primary',
      default: {
        width: '40px',
        height: '40px',
      },
    },
    confirm: {
      variant: 'outlined',
      default: {
        width: '40px',
        height: '40px',
      },
    },
    record: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      border: 'none',
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.sm', 'theme.radius.sm'),
      backgroundColor: 'transparent',
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      cursor: 'pointer',
      flexShrink: 0,
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.inputArea.button', 'theme.values.transitions.inputArea.button'),
      '&:hover': {
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.hover', 'theme.colors.bg.fill.hover'),
      },
      '&:disabled': {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
        cursor: 'default',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    icon: {
      attachment: { name: 'attachment', size: 'lg' },
      send: { name: 'send', size: 'md' },
      record: { name: 'mic', size: 'md' },
      cancel: { name: 'cross', size: 'sm' },
      confirm: { name: 'check', size: 'md' },
      processing: { name: 'processing', size: 'md' },
    },
  },
  processing: {
    loader: {
      props: {
        withWrapper: false,
        size: 'sm',
      },
    },
  },
  charCount: {
    default: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'theme.font.size.caption'),
      lineHeight: (theme: Record<symbol, unknown>) =>
        get(theme, 'font.line.height.caption', 'theme.font.line.height.caption'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
      alignSelf: 'flex-end',
      flexShrink: 0,
    },
    exceeded: {
      color: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.status.error.primary', 'theme.colors.status.error.primary'),
    },
  },
};
