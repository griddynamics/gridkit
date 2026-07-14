import type { MouseEvent, PropsWithChildren } from 'react';

import type { EnumOrPrimitive, LinkVariant, Cursors, LinkTarget, LinkRel } from '@types';
import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export type LinkSize = 'sm' | 'md' | 'lg';
export type LinkUnderline = 'default' | 'highlight' | 'none';

export interface LinkProps extends CommonCssComponentProps<HTMLAnchorElement>, PropsWithChildren {
  variant?: EnumOrPrimitive<LinkVariant>;
  size?: LinkSize;
  underline?: LinkUnderline;
  color?: string;
  cursor?: EnumOrPrimitive<Cursors>;
  disabled?: boolean;
  target?: EnumOrPrimitive<LinkTarget>;
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  ariaLabel?: string;
  role?: string;
  tabindex?: number;
  rel?: EnumOrPrimitive<LinkRel> | string;
}

export interface LinkStyledProps extends CommonCssComponentStyledProps<HTMLAnchorElement>, PropsWithChildren {
  $variant?: EnumOrPrimitive<LinkVariant>;
  $size?: LinkSize;
  $underline?: LinkUnderline;
  $color?: string;
  $cursor: EnumOrPrimitive<Cursors>;
  target?: EnumOrPrimitive<LinkTarget>;
}
