import { get } from '@utils';

const generic = ({
  width = '1px',
  color = 'transparent',
  type = 'solid',
}: {
  width?: string;
  color?: string;
  type?: string;
} = {}) => `${width} ${type} ${color}`;

export const borders = {
  none: 0,
  generic,
  focus: (theme?: Record<symbol, unknown>) =>
    generic({ width: '2px', color: get(theme, 'colors.border.focus', 'theme.colors.border.focus') }),
};
