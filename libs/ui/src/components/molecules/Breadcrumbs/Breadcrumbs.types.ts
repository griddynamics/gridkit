import { ReactNode } from 'react';

import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export interface BreadcrumbsProps extends CommonCssComponentProps {
  separator?: ReactNode;
  itemStart?: ReactNode;
  itemEnd?: ReactNode;
  separatorAfterLastItem?: boolean;
  bordered?: boolean;
  items?: (never | ReactNode)[];
  ariaLabel?: string;
}

export interface BreadcrumbsStyledProps extends CommonCssComponentStyledProps {
  $bordered?: boolean;
}
