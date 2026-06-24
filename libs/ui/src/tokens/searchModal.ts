import { get, calculateJustify } from '@utils';
import { ButtonVariant, FlexDirection, SizeVariant } from '@types';

import { icon } from './icon';
import { display, flexAlignItems } from './display';
import { cursors } from './cursors';

export const searchModal = {
  default: {},
  wrapper: {
    padding: (theme: Record<symbol, unknown>) => {
      const md = get(theme, 'spacing.md', 'theme.spacing.md');
      const lg = get(theme, 'spacing.lg', 'theme.spacing.lg');
      if (md && lg) return `${md} ${lg}`;
      return 'theme.spacing.md theme.spacing.lg';
    },
    overflowY: 'auto',
  },
  input: {
    default: {
      '& input[type="search"]': {
        padding: (theme: Record<symbol, unknown>) => {
          const lg = get(theme, 'spacing.lg', 'theme.spacing.lg');
          const xl = get(theme, 'spacing.xl', 'theme.spacing.xl');
          if (lg && xl) return `${lg} 0 ${lg} ${xl}`;
          return 'theme.spacing.lg 0 theme.spacing.lg theme.spacing.xl';
        },
        height: '54px',
        fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
        '&::placeholder': {
          color: (theme: Record<symbol, unknown>) =>
            get(theme, 'colors.neutral.grey.60', 'theme.colors.neutral.grey.60'),
        },
        '&::-webkit-search-cancel-button': {
          appearance: display.none,
        },
        '&::-ms-clear': {
          display: display.none,
        },
      },
    },
    endIcon: {
      margin: (theme: Record<symbol, unknown>) => {
        const lg = get(theme, 'spacing.lg', 'theme.spacing.lg');
        if (lg) return `0 ${lg} 0 0`;
        return '0 theme.spacing.lg 0 0';
      },
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      cursor: cursors.pointer,
    },
    icons: {
      close: {
        name: 'cross',
        width: 12,
        height: 12,
      },
    },
  },
  loader: {
    default: {
      display: display.flex,
      flexDirection: FlexDirection.Column,
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    },
  },
  items: {
    default: {
      display: display.flex,
      flexDirection: FlexDirection.Column,
    },
    newSearchBtn: {
      styles: {
        textAlign: 'left',
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
        padding: (theme: Record<symbol, unknown>) => {
          const sm = get(theme, 'spacing.sm', 'theme.spacing.sm');
          const md = get(theme, 'spacing.md', 'theme.spacing.md');
          if (sm && md) return `${sm} ${md}`;
          return 'theme.spacing.sm theme.spacing.md';
        },
        fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'font.size.small'),
        fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
        lineHeight: (theme: Record<symbol, unknown>) =>
          get(theme, 'font.line.height.small', 'theme.font.line.height.small'),

        '.gd-button__content': {
          justifyContent: flexAlignItems.start,
        },
      },
      attrs: {
        variant: ButtonVariant.Text,
      },
    },
    noResult: {
      display: display.flex,
      flexDirection: FlexDirection.Row,
      alignItems: flexAlignItems.center,
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      padding: (theme: Record<symbol, unknown>) => {
        const sm = get(theme, 'spacing.sm', 'theme.spacing.sm');
        const md = get(theme, 'spacing.md', 'theme.spacing.md');
        if (sm && md) return `${sm} ${md}`;
        return 'theme.spacing.sm theme.spacing.md';
      },
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'font.size.small'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
      lineHeight: (theme: Record<symbol, unknown>) =>
        get(theme, 'font.line.height.small', 'theme.font.line.height.small'),
    },
    groupTitle: {
      textAlign: 'left',
      padding: (theme: Record<symbol, unknown>) => {
        const sm = get(theme, 'spacing.sm', 'theme.spacing.sm');
        const md = get(theme, 'spacing.md', 'theme.spacing.md');
        if (sm && md) return `${sm} ${md}`;
        return 'theme.spacing.sm theme.spacing.md';
      },
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'font.size.small'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
      lineHeight: (theme: Record<symbol, unknown>) =>
        get(theme, 'font.line.height.small', 'theme.font.line.height.small'),
    },
    item: {
      styles: {
        textAlign: 'left',
        gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
        padding: (theme: Record<symbol, unknown>) => {
          const xs = get(theme, 'spacing.xs', 'theme.spacing.xs');
          const md = get(theme, 'spacing.md', 'theme.spacing.md');
          if (xs && md) return `${xs} ${md}`;
          return 'theme.spacing.xs theme.spacing.md';
        },
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
        '.gd-button__content': {
          display: display.block,
        },
        fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'font.size.small'),
        fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
        lineHeight: (theme: Record<symbol, unknown>) =>
          get(theme, 'font.line.height.small', 'theme.font.line.height.small'),
      },
      attrs: {
        variant: ButtonVariant.Text,
      },
    },
    itemRow: {
      alignItems: flexAlignItems.center,
      justifyContent: calculateJustify('between'),
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      flexWrap: 'noWrap',
    },
    itemColumn: {
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      minWidth: 0,
      flexWrap: 'noWrap',
    },
    itemContent: {
      default: {},
      title: {
        flex: 1,
        minWidth: 0,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      },
      description: {
        flex: 1,
        minWidth: 0,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
      },
      date: {
        flex: '0 0',
        whiteSpace: 'nowrap',
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
      },
    },
    icons: {
      newChat: {
        name: 'edit',
        ...icon.size[SizeVariant.Sm],
      },
      noResults: {
        name: 'search',
        ...icon.size[SizeVariant.Sm],
      },
      item: {
        ...icon.size[SizeVariant.Sm],
      },
    },
  },

  section: {
    default: {
      padding: (theme: Record<symbol, unknown>) => {
        const sm = get(theme, 'spacing.sm', 'theme.spacing.sm');
        const md = get(theme, 'spacing.md', 'theme.spacing.md');
        if (sm && md) return `${sm} 0`;
        return 'theme.spacing.sm 0';
      },
      borderTop: (theme: Record<symbol, unknown>) => {
        const color = get(theme, 'colors.border.default', 'theme.colors.border.default');
        return `1px solid ${color}`;
      },
    },
    title: {
      padding: (theme: Record<symbol, unknown>) => {
        const xs = get(theme, 'spacing.xs', 'theme.spacing.xs');
        const md = get(theme, 'spacing.md', 'theme.spacing.md');
        if (xs && md) return `${xs} ${md}`;
        return 'theme.spacing.xs theme.spacing.md';
      },
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'font.size.caption'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },
};
