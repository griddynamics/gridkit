import { get } from '@utils';

import { borders } from './borders';
import { display, flexAlignItems } from './display';

const stepWidth = 104;

export const stepper = {
  default: {
    display: display.flex,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  separator: {
    default: {
      width: '100%',
      position: 'relative',
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.zero', 'theme.zIndex.zero'),
      top: `20px`,
      marginLeft: `-${stepWidth / 2}px`,
      marginRight: `-${stepWidth / 2}px`,
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.stepper.separator', 'theme.values.transitions.stepper.separator'),
      borderTop: (theme: Record<symbol, unknown>) =>
        borders.generic({
          color: get(theme, 'colors.border.default', 'theme.colors.border.default'),
          width: get(theme, 'values.borderMedium', 'theme.values.borderMedium'),
        }),
    },
    active: {},
    complete: {
      borderTopColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.border.primary', 'theme.colors.border.primary'),
    },
    inactive: {},
  },
  step: {
    default: {
      display: display.flex,
      flexDirection: 'column',
      alignItems: flexAlignItems.center,
      justifyContent: 'space-between',
      minWidth: `${stepWidth}px`,
    },
    active: {},
    inactive: {},
    complete: {
      cursor: 'pointer',
    },
  },
  stepIcon: {
    default: {
      display: display.flex,
      alignItems: flexAlignItems.center,
      position: 'relative',
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.first', 'theme.zIndex.zero'),
      justifyContent: 'center',
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.round', 'theme.radius.round'),
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({ width: get(theme, 'values.borderMedium', 'theme.values.borderMedium') }),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, `font.size.h5`, `font.size.h5`),
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.stepper.stepIcon', 'theme.values.transitions.stepper.stepIcon'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      width: '40px',
      height: '40px',
    },
    active: {
      default: {
        backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.default', 'theme.colors.bg.default'),
        borderColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.border.primary', 'theme.colors.border.primary'),
      },
      success: {},
      error: {
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.error.primary.default', 'theme.colors.bg.fill.error.primary.default'),
        borderColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.error.primary.default', 'theme.colors.bg.fill.error.primary.default'),
      },
    },
    inactive: {
      default: {
        backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.default', 'theme.colors.bg.default'),
      },
      success: {},
      error: {},
    },
    complete: {
      default: {
        fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
      },
      success: {},
      error: {
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.error.secondary.default', 'theme.colors.bg.fill.error.secondary.default'),
        borderColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.error.secondary.default', 'theme.colors.bg.fill.error.secondary.default'),
      },
    },
    success: {
      default: {},
      success: {},
      error: {},
    },
  },
  stepLabel: {
    default: {
      marginTop: (theme: Record<symbol, unknown>) => get(theme, `spacing.sm`, `theme.spacing.sm`),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, `font.size.p`, `font.size.p`),
      colors: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    },
    active: {},
    inactive: {},
    complete: {},
    error: {},
    success: {},
  },
  icons: {
    active: {
      name: 'check',
      fill: 'icon.black',
      size: 'md',
    },
    inactive: {
      name: 'check',
      fill: 'icon.default',
      size: 'md',
    },
    complete: {
      name: 'check',
      fill: 'icon.black',
      size: 'md',
    },
    error: {
      name: 'cross',
      fill: 'icon.error',
      size: 'sm',
    },
    errorActive: {
      name: 'cross',
      fill: 'neutral.white',
      size: 'sm',
    },
  },
};
