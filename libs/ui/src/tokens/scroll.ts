import { get } from '@utils';

const scrollbarSize = 8;

export const scroll = {
  container: {
    default: {
      position: 'relative',
      display: 'flex',
      overflow: 'auto',
      isolation: 'isolate',
      maxBlockSize: '100%',
      '&::-webkit-scrollbar, &::-webkit-scrollbar-thumb': {
        background: 'transparent',
        width: '0',
        height: '0',
      },
    },
  },
  content: {
    default: {
      position: 'relative',
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.zero', 'theme.zIndex.zero'),
      flex: 1,
      flexBasis: 'auto',
      height: 'max-content',
    },
  },
  scrollbars: {
    default: {
      position: 'sticky',
      top: '0',
      left: '0',
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.first', 'theme.zIndex.first'),
      minWidth: 'calc(100% - 1px)',
      minHeight: 'calc(100% - 1px)',
      maxWidth: 'calc(100% - 1px)',
      maxHeight: 'calc(100% - 1px)',
      float: 'left',
      marginRight: 'calc(-100% + 1px)',
      marginInlineStart: '0',
      marginInlineEnd: 'calc(-100% + 1px)',
      pointerEvents: 'none',
    },
  },
  scrollbar: {
    default: {
      position: 'absolute',
      pointerEvents: 'auto',
      opacity: 0.2,
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.scroll.scrollbar', 'theme.values.transitions.scroll.scrollbar'),
      '&:hover': {
        opacity: 1,
      },
    },
    vertical: {
      right: 0,
      bottom: `${scrollbarSize}px`,
      top: 0,
      width: `${scrollbarSize}px`,
    },
    horizontal: {
      left: 0,
      bottom: 0,
      right: `${scrollbarSize}px`,
      height: `${scrollbarSize}px`,
    },
    autoHide: {
      opacity: 0,
      transition: 'opacity 0.2s ease-in-out',
    },
    autoHideScrolling: {
      opacity: 0.2,
      '&:hover': {
        opacity: 1,
      },
    },
  },
  thumb: {
    default: {
      position: 'absolute',
      cursor: 'pointer',
      pointerEvents: 'auto',
      background: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.neutral["grey.80"]', 'theme.colors.neutral["grey.80"]'),
      backgroundClip: 'content-box',
      boxSizing: 'border-box',
    },
    vertical: {
      right: 0,
      bottom: 0,
      top: 0,
      width: `${scrollbarSize}px`,
      minHeight: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.scroll.thumb', 'theme.values.transitions.scroll.thumb'),
    },
    horizontal: {
      left: 0,
      right: 0,
      bottom: 0,
      height: `${scrollbarSize}px`,
      minWidth: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.scroll.thumb', 'theme.values.transitions.scroll.thumb'),
    },
    autoHide: {
      opacity: 0,
      transition: 'opacity 0.2s ease-in-out',
    },
    autoHideScrolling: {
      opacity: 1,
    },
  },
};
