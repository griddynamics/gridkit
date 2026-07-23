import { get } from '@utils';

const thumbStyles = (theme: Record<symbol, unknown>) => ({
  isolation: 'isolate',
  appearance: 'none',
  backgroundColor: get(theme, 'colors.bg.fill.secondary', 'theme.colors.bg.fill.secondary'),
  borderRadius: '50%',
  blockSize: '20px',
  inlineSize: '20px',
  boxSizing: 'border-box',
  border: '2px solid currentColor',
  marginTop: '-6px',
});
const trackStyles = (theme: Record<symbol, unknown>) => ({
  blockSize: '8px',
  borderRadius: 'inherit',
  backgroundRepeat: 'no-repeat',
  backgroundColor: get(theme, 'colors.border.default', 'theme.colors.border.default'),
  backgroundImage:
    'linear-gradient(to right, transparent 0 100%), linear-gradient(to right, currentColor calc(100% * var(--gd-slider-fill-ratio)), transparent calc(100% * var(--gd-slider-fill-ratio)))',
  backgroundPositionX: 'calc((0.75rem - 8px) / 2), 0',
  backgroundSize: 'calc(100% - 0.75rem), auto',
});

export const slider = {
  default: {
    position: 'relative',
    display: 'block',
    inlineSize: '100%',
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.title', 'theme.colors.text.title'),
    cursor: 'pointer',
    WebkitAppearance: 'none',
    appearance: 'none',
    padding: '0.4375rem 0',
    backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.transparent', 'theme.colors.transparent'),
    outline: 'none',
    '&[disabled]': {
      opacity: '50%',
      cursor: 'default',
    },
    '&::-webkit-slider-thumb': thumbStyles,
    '&::-webkit-slider-runnable-track': trackStyles,
    '&::-moz-range-thumb': thumbStyles,
    '&::-moz-range-track': trackStyles,
  },
};
