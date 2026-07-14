import type { MouseEventHandler } from 'react';
import type { EnumOrPrimitive, SizeVariant } from '@types';
import type { BoxCssComponentProps } from '@components';

export interface IconProps extends Omit<BoxCssComponentProps<SVGElement>, 'width' | 'height'> {
  name: string;
  width?: number;
  height?: number;
  fill?: string;
  fillSvg?: string;
  onClick?: MouseEventHandler<SVGElement>;
  size?: EnumOrPrimitive<SizeVariant>;
}
