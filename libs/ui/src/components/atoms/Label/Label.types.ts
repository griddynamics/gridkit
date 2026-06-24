import type { MouseEvent, PropsWithChildren } from 'react';

import type {
  CommonCssComponentProps,
  CommonCssComponentStyledProps,
  BoxCssComponentProps,
  BoxCssComponentStyledProps,
} from '@components';

export interface LabelProps
  extends CommonCssComponentProps<HTMLLabelElement>, BoxCssComponentProps<HTMLLabelElement>, PropsWithChildren {
  onClick?: (event: MouseEvent<HTMLLabelElement>) => void;
  ariaLabel?: string;
  htmlFor?: string;
}

export interface LabelStyledProps
  extends
    CommonCssComponentStyledProps<HTMLLabelElement>,
    BoxCssComponentStyledProps<HTMLLabelElement>,
    PropsWithChildren {
  onClick?: (event: MouseEvent<HTMLLabelElement>) => void;
}
