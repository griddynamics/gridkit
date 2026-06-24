import { radius } from './radius';

export const values = {
  // Border tokens
  borderThin: '1px',
  borderMedium: '2px',
  borderThick: '3px',
  borderNone: 0,
  border: {
    radius: {
      none: radius.none,
    },
  },

  // Layout tokens
  screenSmall: '480px',
  screenMedium: '768px',
  screenLarge: '1024px',
  screenXLarge: '1280px',

  responsiveSmall: '20%',
  responsiveMedium: '40%',
  responsiveLarge: '60%',
  responsiveXLarge: '80%',

  transitions: {
    stepper: {
      separator: 'border 0.2s ease-in-out',
      stepIcon: 'background 0.2s ease-in-out, border 0.2s ease-in-out',
    },
    button: {
      default: 'background 0.2s ease-in-out, border 0.2s ease-in-out, color 0.2s ease-in-out',
    },
    scroll: {
      scrollbar: 'opacity 0.2s ease-in-out',
      thumb: 'top 0.1s cubic-bezier(0.4,0,0.2,1)',
    },
    rating: {
      label: 'transform 0.2s ease-in-out',
    },
    progressbar: {
      styledDeterminateFill: 'width 300ms ease',
    },
    accordion: {
      toggle: '0.15s ease-out',
      icon: 'transform 0.3s ease',
    },
    select: {
      arrowIconWrapper: 'transform 0.3s ease',
    },
    card: {
      wishlist: 'background-color 0.2s ease, transform 0.2s ease',
    },
    sidebar: {
      container: 'width 0.2s ease',
      item: 'background-color 0.15s ease, color 0.15s ease',
      group: 'max-height 0.2s ease',
      expandIcon: 'transform 0.2s ease',
    },
    sliderDots: {
      dot: 'width 0.3s ease, background-color 0.3s ease',
    },
    inputArea: {
      container: 'border-color 0.15s ease',
      button: 'background-color 0.15s ease, color 0.15s ease',
    },
    tabs: {
      label: 'border 0.2s ease-in',
    },
    chat: {
      sidebar: 'transform 0.3s ease-in-out, width 0.3s ease-in-out, opacity 0.3s ease-in-out',
      sidebarWrapper: 'opacity 0.2s ease-in',
    },
    checkbox: {
      indicator: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out',
    },
    imagePreview: {
      thumbnail: 'opacity 0.2s ease, border-color 0.2s ease',
    },
    chart: {
      bar: 'stroke-width 200ms ease-out',
      line: 'filter 150ms ease-out, stroke-width 150ms ease-out',
      area: 'filter 150ms ease-out',
      pie: 'transform 200ms ease-out, filter 200ms ease-out',
    },
  },
  transform: {
    rotateUp: 'rotate(180deg)',
    rotateReset: 'rotate(0deg)',
  },
  separator: {
    thickness: {
      xs: '0.5px',
      sm: '1px',
      md: '2px',
      lg: '3px',
      xl: '4px',
      xxl: '5px',
    },
  },
};
