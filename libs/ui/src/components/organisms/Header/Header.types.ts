import type { MouseEvent, PropsWithChildren, ReactNode } from 'react';

import type { Theme } from '@hooks';
import type {
  BoxCssComponentProps,
  BoxCssComponentStyledProps,
  CommonCssComponentStyledProps,
  RowProps,
  ColumnProps,
} from '@components';

export interface MenuListItem {
  title?: string;
  path?: string;
  [key: string]: unknown;
}

export interface HeaderStyledProps extends PropsWithChildren<BoxCssComponentStyledProps> {
  $backgroundColor?: string;
}

export type HeaderCommonStyledProps = PropsWithChildren<CommonCssComponentStyledProps>;
export interface HeaderCommonRowStyledProps extends RowProps {
  theme?: Theme;
}
export interface HeaderCommonColumnStyledProps extends ColumnProps {
  theme?: Theme;
}

export interface HeaderProps extends PropsWithChildren<BoxCssComponentProps> {
  showTopBanner?: boolean;
  bgColor?: string;
  mobileMenuList?: MenuListItem[];
  showSearch?: boolean;
  bannerContent?: ReactNode;
  logo?: ReactNode;
  menu?: ReactNode;
  actions?: ReactNode;
  onMobileMenuItemClick?: (event: MouseEvent<HTMLDivElement>, item: MenuListItem) => void;
  menuItemMapper?: (item: MenuListItem) => ReactNode;
  advBlock?: ReactNode;
}
