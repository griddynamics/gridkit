import { get } from '@utils';

export const badge = {
  default: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  },
  size: {
    sm: {
      height: '28px',
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.default', 'theme.radius.default'),
      padding: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'spacing.xs', 'theme.spacing.xs')} ${get(theme, 'spacing.sm', 'theme.spacing.sm')}`,
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      lineHeight: (theme: Record<symbol, unknown>) =>
        get(theme, 'font.line.height.small', 'theme.font.line.height.small'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    },
    md: {
      height: '32px',
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.default', 'theme.radius.default'),
      padding: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'spacing.xs', 'theme.spacing.xs')} ${get(theme, 'spacing.sm', 'theme.spacing.sm')}`,
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.p', 'theme.font.size.p'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    },
    lg: {
      height: '38px',
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.default', 'theme.radius.default'),
      padding: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'spacing.sm', 'theme.spacing.sm')} ${get(theme, 'spacing.md', 'theme.spacing.md')}`,
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.p', 'theme.font.size.p'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    },
  },
  content: {
    default: {},
  },
  startIcon: {
    default: {},
  },
  endIcon: {
    default: {},
  },

  primary: {
    filled: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.white', 'theme.colors.text.white'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.success.primary.hover', 'theme.colors.bg.fill.success.primary.hover'),
      },
      disabled: {
        opacity: 0.7,
      },
    },
    filledLight: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.success.secondary.default', 'theme.colors.bg.fill.success.secondary.default'),
      },
      disabled: {
        opacity: 0.7,
      },
    },
    outline: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
        border: (theme: Record<symbol, unknown>) => {
          const color = get(theme, 'colors.border.success', 'theme.colors.border.success');
          return `1px solid ${color}`;
        },
      },
      disabled: {
        opacity: 0.7,
      },
    },
    outlineFilledLight: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.success.secondary.default', 'theme.colors.bg.fill.success.secondary.default'),
        border: (theme: Record<symbol, unknown>) => {
          const color = get(theme, 'colors.border.success', 'theme.colors.border.success');
          return `1px solid ${color}`;
        },
      },
      disabled: {
        opacity: 0.7,
      },
    },
  },
  secondary: {
    filled: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.white', 'theme.colors.text.white'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.warning.primary.hover', 'theme.colors.bg.fill.warning.primary.hover'),
      },

      disabled: {
        opacity: 0.7,
      },
    },
    filledLight: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.warning.secondary.default', 'theme.colors.bg.fill.warning.secondary.default'),
      },
      disabled: {
        opacity: 0.7,
      },
    },
    outline: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
        border: (theme: Record<symbol, unknown>) => {
          const color = get(theme, 'colors.border.warning', 'theme.colors.border.warning');
          return `1px solid ${color}`;
        },
      },
      disabled: {
        opacity: 0.7,
      },
    },
    outlineFilledLight: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.warning.secondary.default', 'theme.colors.bg.fill.warning.secondary.default'),
        border: (theme: Record<symbol, unknown>) => {
          const color = get(theme, 'colors.border.warning', 'theme.colors.border.warning');
          return `1px solid ${color}`;
        },
      },
      disabled: {
        opacity: 0.7,
      },
    },
  },
  tertiary: {
    filled: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.white', 'theme.colors.text.white'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.info.primary.default', 'theme.colors.bg.fill.info.primary.default'),
      },
      disabled: {
        opacity: 0.7,
      },
    },
    filledLight: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.info.secondary.default', 'theme.colors.bg.fill.info.secondary.default'),
      },
      disabled: {
        opacity: 0.7,
      },
    },
    outline: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
        border: (theme: Record<symbol, unknown>) => {
          const color = get(theme, 'colors.border.info', 'theme.colors.border.info');
          return `1px solid ${color}`;
        },
      },
      disabled: {
        opacity: 0.7,
      },
    },
    outlineFilledLight: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.info.secondary.default', 'theme.colors.bg.fill.info.secondary.default'),
        border: (theme: Record<symbol, unknown>) => {
          const color = get(theme, 'colors.border.info', 'theme.colors.border.info');
          return `1px solid ${color}`;
        },
      },
      disabled: {
        opacity: 0.7,
      },
    },
  },
  quaternary: {
    filled: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.white', 'theme.colors.text.white'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.error.primary.default', 'theme.colors.bg.fill.error.primary.default'),
      },
      disabled: {
        opacity: 0.7,
      },
    },
    filledLight: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.error.secondary.default', 'theme.colors.bg.fill.error.secondary.default'),
      },
      disabled: {
        opacity: 0.7,
      },
    },
    outline: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
        border: (theme: Record<symbol, unknown>) => {
          const color = get(theme, 'colors.border.error', 'theme.colors.border.error');
          return `1px solid ${color}`;
        },
      },
      disabled: {
        opacity: 0.7,
      },
    },
    outlineFilledLight: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.error.secondary.default', 'theme.colors.bg.fill.error.secondary.default'),
        border: (theme: Record<symbol, unknown>) => {
          const color = get(theme, 'colors.border.error', 'theme.colors.border.error');
          return `1px solid ${color}`;
        },
      },
      disabled: {
        opacity: 0.7,
      },
    },
  },
  quinary: {
    filled: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.tooltip.default', 'theme.colors.bg.fill.tooltip.default'),
      },
      disabled: {
        opacity: 0.7,
      },
    },
    filledLight: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.input.disabled', 'theme.colors.bg.fill.input.disabled'),
      },
      disabled: {
        opacity: 0.7,
      },
    },
    outline: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
        border: (theme: Record<symbol, unknown>) => {
          const color = get(theme, 'colors.border.black', 'theme.colors.border.black');
          return `1px solid ${color}`;
        },
      },
      disabled: {
        opacity: 0.7,
      },
    },
    outlineFilledLight: {
      default: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.input.disabled', 'theme.colors.bg.fill.input.disabled'),
        border: (theme: Record<symbol, unknown>) => {
          const color = get(theme, 'colors.border.black', 'theme.colors.border.black');
          return `1px solid ${color}`;
        },
      },
      disabled: {
        opacity: 0.7,
      },
    },
  },
};
