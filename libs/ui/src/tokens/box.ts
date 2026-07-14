import { get } from '@utils';
import { borders } from './borders';

const cardBorderStyles = (theme: Record<symbol, unknown>) => ({
  border: borders.generic({
    width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
    color: get(theme, 'colors.border.default', 'theme.colors.border.default'),
  }),
});
const cardHighlightedStyles = (theme: Record<symbol, unknown>) => ({
  '&:not(:focus-visible):hover': {
    outline: borders.generic({
      width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
      color: get(theme, 'colors.primary.default', 'theme.colors.primary.default'),
    }),
  },
});

/**
 * Box component tokens - Base container styles
 * These styles were extracted from Card component to create a reusable base container
 */
export const box = {
  default: {
    display: 'flex',
    '&:focus-visible': (theme: Record<symbol, unknown>) => ({
      outline: borders.generic({
        width: get(theme, 'values.borderMedium', 'theme.values.borderMedium'),
        color: get(theme, 'colors.border.focus', 'theme.colors.border.focus'),
      }),
      '&:hover': {
        boxShadow: 'none',
      },
    }),
  },
  shadowHover: {
    '&:hover': {
      boxShadow: (theme: Record<symbol, unknown>) => get(theme, 'shadows.box["3"]', 'theme.shadows.box["3"]'),
    },
  },
  vertical: {
    default: {
      flexDirection: 'column',
    },
    bordered: cardBorderStyles,
    highlighted: cardHighlightedStyles,
  },
  horizontal: {
    default: {
      flexDirection: 'row',
    },
    bordered: cardBorderStyles,
    highlighted: cardHighlightedStyles,
  },
};
