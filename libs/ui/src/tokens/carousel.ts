import { calculateJustify, get } from '@utils';

const carouselThumbGap = '8px';
const carouselThumbWidth = '80px';
const carouselThumbHeight = '48px';
const horizontalThumbsViewportWidth = '256px';
const verticalThumbsViewportHeight = '160px';

export const carousel = {
  default: {},
  container: {
    default: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      display: 'flex',
      minWidth: 0,
      minHeight: 0,
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.first', 'theme.zIndex.first'),
      gap: '1rem',
    },
    variant: {
      cards: {
        gap: '1rem',
      },
      single: {
        '.embla__slide': {
          padding: 0,
        },
      },
    },
    layout: {
      horizontal: {
        flexDirection: 'column',
      },
      vertical: {
        flexDirection: 'row',
        height: '100%',
      },
    },
  },
  contentContainer: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: calculateJustify('center'),
    alignItems: 'center',
    zIndex: '100',
  },
  contentTypography: {
    flexDirection: 'column',
    height: '100%',
    position: 'absolute',
    justifyContent: calculateJustify('center'),
    alignItems: 'center',
    zIndex: '100',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slidePlaceholder: {
    width: '100%',
    height: '100%',
    minHeight: '200px',
    backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
  },
  slideOverlayContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '200px',
  },
  slideOverlayBackdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
  },
  slideOverlayChildren: {
    position: 'absolute',
    inset: 0,
  },
  carouselViewport: {
    default: {
      overflow: 'hidden',
      flex: 1,
      minWidth: 0,
      minHeight: 0,
    },
    vertical: {
      height: '100%',
    },
  },
  carouselViewportSlideWrapper: {
    default: {
      display: 'flex',
      height: '100%',
      minHeight: 0,
    },
    horizontal: {
      flexDirection: 'row',
    },
    vertical: {
      flexDirection: 'column',
      height: '100%',
    },
  },
  carouselSlide: {
    default: {
      flex: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'spacing.none', 'theme.spacing.none')} ${get(theme, 'spacing.none', 'theme.spacing.none')} auto`,
      width: '100%',
      height: '100%',
      minHeight: 0,
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      },
    },
    vertical: {
      flex: '0 0 100%',
      height: '100%',
      minHeight: 0,
      '& img': {
        height: '100%',
      },
    },
  },
  footer: {
    display: 'flex',
    justifyContent: calculateJustify('between'),
    alignItems: 'center',
  },
  footerControls: {
    display: 'flex',
  },
  contentSlide: {
    display: 'block',
    paddingLeft: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    '&:first-of-type': {
      paddingLeft: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    },
  },
  carouselControlsWrapper: {
    default: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0,
      minHeight: 0,
    },
    vertical: {
      flex: 1,
      height: '100%',
    },
  },
  carouselControls: {
    display: 'flex',
    justifyContent: calculateJustify('between'),
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    transform: 'translateY(-50%)',
    width: '100%',
    padding: '0.5rem 1rem',
    zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.high', 'theme.zIndex.high'),
  },
  carouselDots: {
    display: 'flex',
    justifyContent: calculateJustify('center'),
    gap: '0.5rem',
    marginTop: '1rem',
  },
  carouselDot: {
    default: {
      width: '8px',
      height: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'width 0.3s ease',
    },
    active: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
      width: '32px',
      '&:hover': {},
    },
    nonActive: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.disabled', 'theme.colors.bg.fill.disabled'),
      '&:hover': {},
    },
  },

  carouselThumbs: {
    default: {
      display: 'flex',
      justifyContent: calculateJustify('center'),
      gap: carouselThumbGap,
      alignSelf: 'center',
      width: 'fit-content',
      maxWidth: '100%',
    },

    vertical: {
      flexDirection: 'column',
      flex: '0 0 80px',
      overflow: 'hidden',
      alignItems: 'center',
    },
    horizontal: {
      overflow: 'hidden',
    },
  },
  carouselThumbsViewport: {
    default: {
      overflow: 'hidden',
      minWidth: 0,
      minHeight: 0,
    },
    vertical: {
      height: verticalThumbsViewportHeight,
      maxHeight: verticalThumbsViewportHeight,
      overflowY: 'scroll',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
    },
    horizontal: {
      width: horizontalThumbsViewportWidth,
      flex: '0 0 auto',
      maxWidth: '100%',
    },
    centered: {
      horizontal: {},
      vertical: {},
    },
  },
  carouselThumbsWrapper: {
    default: {},
    vertical: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: carouselThumbGap,
    },
    horizontal: {
      display: 'flex',
      alignItems: 'center',
      gap: carouselThumbGap,
    },
    centered: {
      vertical: {
        justifyContent: calculateJustify('center'),
        minHeight: '100%',
      },
      horizontal: {
        justifyContent: calculateJustify('center'),
        minWidth: '100%',
      },
    },
  },
  carouselThumb: {
    default: {
      width: carouselThumbWidth,
      height: carouselThumbHeight,
      minWidth: carouselThumbWidth,
      minHeight: carouselThumbHeight,
      flex: '0 0 auto',
      border: 'none',
      overflow: 'hidden',
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      background: 'none',
      cursor: 'pointer',
      opacity: 0.4,
      transition: 'opacity 0.3s ease-in-out',
      '&:hover': {
        opacity: 1,
      },
    },

    active: {
      opacity: 1,
    },

    vertical: {},
    horizontal: {},
  },
  controlsButton: {
    default: {},
    attrs: {
      variant: 'text',
      isIcon: true,
    },
  },
  icons: {
    base: {
      size: 'lg',
    },
    controlLeft: {
      name: 'arrowLeft',
    },
    controlRight: {
      name: 'arrowRight',
    },
  },
};
