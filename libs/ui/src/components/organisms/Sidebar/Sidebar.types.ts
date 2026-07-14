import type { MouseEvent, PropsWithChildren, ReactNode } from 'react';

import type { BoxCssComponentProps, BoxCssComponentStyledProps } from '@components';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  disabled?: boolean;
  children?: SidebarItem[];
}

export interface SidebarProps extends PropsWithChildren<BoxCssComponentProps<HTMLElement>> {
  items?: SidebarItem[];
  activeItemId?: string;
  collapsed?: boolean;
  width?: string;
  collapsedWidth?: string;
  onItemClick?: (event: MouseEvent<HTMLElement>, item: SidebarItem) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  header?: ReactNode;
  footer?: ReactNode;
}

export interface SidebarStyledProps extends BoxCssComponentStyledProps<HTMLElement> {
  $collapsed: boolean;
  $width: string;
  $collapsedWidth: string;
}

export interface SidebarItemProps extends PropsWithChildren {
  item: SidebarItem;
  activeItemId?: string;
  collapsed?: boolean;
  depth?: number;
  onItemClick?: (event: MouseEvent<HTMLElement>, item: SidebarItem) => void;
}

export interface SidebarItemStyledProps extends BoxCssComponentStyledProps<HTMLElement> {
  $isActive: boolean;
  $depth: number;
  $disabled: boolean;
  $collapsed: boolean;
}

export interface SidebarGroupStyledProps extends BoxCssComponentStyledProps<HTMLDivElement> {
  $isExpanded: boolean;
}
