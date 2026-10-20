export const row = {
  default: {
    display: 'flex',
  },
  webComponent: {
    host: {
      display: 'contents',
    },
    default: {
      boxSizing: 'border-box',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      gap: '0px',
    },
    reversed: { flexDirection: 'row-reverse' },
    noWrap: { flexWrap: 'nowrap' },
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
    },
  },
};
