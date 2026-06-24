import checkboxBorderSvg from '@assets/svg/checkbox_border.svg?raw';
import checkboxBgCheckedSvg from '@assets/svg/checkbox_bg_checked.svg?raw';
import checkboxDisabledBgCheckedSvg from '@assets/svg/checkbox_disabled_bg_checked.svg?raw';
import radioBgSvg from '@assets/svg/radio_bg.svg?raw';
import radioBgCheckedSvg from '@assets/svg/radio_bg_checked.svg?raw';

import { get } from '@utils';

import { borders } from './borders';
import { getFocusStyles, getImgSrc } from './utils';

const getInputStyles = (color: string, width: string) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: borders.generic({
    width,
    color,
  }),
});

export const input = {
  wrapper: {
    default: {
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignSelf: 'stretch',
      alignItems: 'center',
      position: 'relative',
    },
    withGap: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
    },
  },
  input: {
    default: {
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      outline: 'none',
      position: 'relative',
      cursor: 'text',
      border: borders.none,
      backgroundColor: 'transparent',
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),

      '&::placeholder': {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
      },

      '&:not([type="radio"], [type="checkbox"], [type="range"])': {
        height: '40px',
        width: '100%',
        zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.first', 'theme.zIndex.first'),
      },

      '&[type="number"]': {
        appearance: 'textfield',
        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
          appearance: 'none',
          margin: 0,
        },
      },

      '&[readonly], &:disabled': {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
        cursor: 'default',
      },
      // CHECKBOX
      '&[type="checkbox"]': {
        cursor: 'pointer',
        appearance: 'none',
        height: '18px',
        width: '18px',
        backgroundColor: 'transparent',
        border: 'none',
        backgroundImage: getImgSrc(checkboxBorderSvg),
        '&:focus-visible': (theme: Record<symbol, unknown>) =>
          getFocusStyles({
            inset: '-4px',
            borderRadius: '3px',
            border: borders.generic({
              width: '2px',
              color: get(theme, 'colors.border.focus', 'theme.colors.border.focus'),
            }),
          }),
      },
      '&[type="checkbox"]:not(:checked)': {
        '&[readonly], &:disabled': {
          opacity: 0.5,
        },
      },
      '&[type="checkbox"]:checked': {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '18px',
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'),
        border: 'none',
        backgroundImage: getImgSrc(checkboxBgCheckedSvg),
        '&[readonly], &:disabled': {
          backgroundImage: getImgSrc(checkboxDisabledBgCheckedSvg),
        },
      },
      // RADIO
      '&[type="radio"]': {
        cursor: 'pointer',
        appearance: 'none',
        height: '20px',
        width: '20px',
        border: 'none',
        backgroundImage: getImgSrc(radioBgSvg),
        '&:focus-visible': (theme: Record<symbol, unknown>) =>
          getFocusStyles({
            inset: '-4px',
            borderRadius: '50%',
            border: borders.generic({
              width: '2px',
              color: get(theme, 'colors.border.focus', 'theme.colors.border.focus'),
            }),
          }),
        '&[readonly], &:disabled': {
          opacity: 0.5,
        },
      },
      '&[type="radio"]:checked': {
        backgroundImage: getImgSrc(radioBgCheckedSvg),
      },
    },
    defaultInteraction: {
      '&:focus-visible ~ .Input__outline': {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '100%',
        outline: (theme: Record<symbol, unknown>) => borders.focus(theme),
        borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.none', 'theme.radius.none'),
        outlineOffset: '3px',
      },
      '& + .Input__border': {
        borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.none', 'theme.radius.none'),
      },
    },
    mouseInteraction: {
      '&:focus-visible ~ .Input__outline': {},
      '& + .Input__border': {
        borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.none', 'theme.radius.none'),
      },
    },
    primary: {
      '& + .Input__border': (theme: Record<symbol, unknown>) =>
        getInputStyles(
          get(theme, 'colors.border.default', 'theme.colors.border.default'),
          get(theme, 'values.borderThin', 'theme.values.borderThin')
        ),
    },
    success: {
      '& + .Input__border': (theme: Record<symbol, unknown>) =>
        getInputStyles(
          get(theme, 'colors.border.success', 'theme.colors.border.success'),
          get(theme, 'values.borderThin', 'theme.values.borderThin')
        ),
    },
    warning: {
      '& + .Input__border': (theme: Record<symbol, unknown>) =>
        getInputStyles(
          get(theme, 'colors.border.primary', 'theme.colors.border.primary'),
          get(theme, 'values.borderThin', 'theme.values.borderThin')
        ),
    },
    error: {
      '& + .Input__border': (theme: Record<symbol, unknown>) =>
        getInputStyles(
          get(theme, 'colors.border.error', 'theme.colors.border.error'),
          get(theme, 'values.borderThin', 'theme.values.borderThin')
        ),
    },
  },
  helper: {
    default: {
      sm: {
        fontSize: (theme: Record<symbol, unknown>) => get(theme, `font.size.caption`, `font.size.caption`),
        fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
        lineHeight: (theme: Record<symbol, unknown>) =>
          get(theme, `font.line.height.caption`, `theme.font.line.height.caption`),
      },
      md: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
        fontSize: (theme: Record<symbol, unknown>) => get(theme, `font.size.small`, `theme.font.size.small`),
        fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
        lineHeight: (theme: Record<symbol, unknown>) =>
          get(theme, `font.line.height.small`, `theme.font.line.height.small`),
      },
    },

    primary: {
      sm: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      },
      md: {},
    },
    success: {
      sm: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.success', 'theme.colors.text.success'),
      },
      md: {},
    },
    warning: {
      sm: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.primary', 'theme.colors.text.primary'),
      },
      md: {},
    },
    error: {
      sm: {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.error', 'theme.colors.text.error'),
      },
      md: {},
    },
  },
  adornment: {
    default: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.first', 'theme.zIndex.first'),
    },
  },
};
