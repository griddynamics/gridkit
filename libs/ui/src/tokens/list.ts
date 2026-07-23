import { ListVariant } from '@types';

import { get } from '@utils';
import { radius } from './radius';

const COMMON_ORDERED_BEFORE_STYLES = (theme: Record<symbol, unknown>) => ({
  content: 'counter(list-counter)',
  counterIncrement: 'list-counter',
  background: get(theme, 'colors.primary.default', 'theme.colors.primary.default'),
  fontFamily: get(theme, 'font.family', 'theme.font.family'),
  fontSize: get(theme, 'font.size.small', 'theme.font.size.small'),
  fontWeight: get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
  width: get(theme, 'spacing.lg', 'theme.spacing.lg'),
  height: get(theme, 'spacing.lg', 'theme.spacing.lg'),
  color: get(theme, 'colors.text.default', 'theme.colors.text.default'),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: get(theme, 'spacing.sm', 'theme.spacing.sm'),
});
const COMMON_UNORDERED_STYLES = (theme: Record<symbol, unknown>) => ({
  counterReset: 'list-counter',
  paddingLeft: get(theme, 'spacing.none', 'theme.spacing.none'),

  [`& .List__bulletPoint`]: {
    marginRight: get(theme, 'spacing.sm', 'theme.spacing.sm'),
    color: get(theme, 'colors.primary.default', 'theme.colors.primary.default'),
  },
});

export const list = {
  wrapper: {
    default: {
      listStyle: 'none',
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      margin: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    },
    [ListVariant.OrderedCircle]: {
      counterReset: 'list-counter',
      paddingLeft: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    },
    [ListVariant.OrderedSquare]: {
      counterReset: 'list-counter',
      paddingLeft: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    },
  },
  item: {
    default: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      margin: (theme: Record<symbol, unknown>) => `${get(theme, 'spacing.sm', 'theme.spacing.sm')} 0`,
      '&:first-of-type': {
        // reset first item top margin to align with other blocks by start
        margin: (theme: Record<symbol, unknown>) => `0 0 ${get(theme, 'spacing.sm', 'theme.spacing.sm')}`,
      },
    },
    [ListVariant.OrderedCircle]: {
      '&::before': (theme: Record<symbol, unknown>) => ({
        borderRadius: radius.round,
        ...COMMON_ORDERED_BEFORE_STYLES(theme),
      }),
    },
    [ListVariant.OrderedSquare]: {
      '&::before': (theme: Record<symbol, unknown>) => COMMON_ORDERED_BEFORE_STYLES(theme),
    },
    [ListVariant.UnorderedCheck]: (theme: Record<symbol, unknown>) => COMMON_UNORDERED_STYLES(theme),
    [ListVariant.UnorderedDot]: (theme: Record<symbol, unknown>) => COMMON_UNORDERED_STYLES(theme),
  },
  size: {
    sm: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      lineHeight: (theme: Record<symbol, unknown>) =>
        get(theme, 'font.line.height.small', 'theme.font.line.height.small'),
      margin: (theme: Record<symbol, unknown>) => `${get(theme, 'spacing.xs', 'theme.spacing.xs')} 0`,
    },
    md: {},
  },
  icons: {
    bulletDot: {
      name: 'dot',
      width: 6,
      height: 6,
    },
    bulletCheck: {
      name: 'check',
    },
  },
};
