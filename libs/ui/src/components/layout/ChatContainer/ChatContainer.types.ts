import type { PropsWithChildren, ReactNode } from 'react';

import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export interface ChatContainerProps extends PropsWithChildren<CommonCssComponentProps> {
  sidebarContent?: ReactNode;
  sidebarMinifiedContent?: ReactNode;
  sidebarHeaderContent?: ReactNode;
  headerContent?: ReactNode;
  children?: ReactNode;
  isOpen?: boolean;
  showSidebarAsideControl?: boolean;
  showSidebarHeaderControl?: boolean;
  onToggleSidebar?: (open: boolean) => void;
}

export interface ChatContainerRef {
  isOpen?: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export interface ChatCommonStyledProps extends PropsWithChildren<CommonCssComponentStyledProps> {
  $open?: boolean;
}

export interface SidebarWrapperStyledProps extends CommonCssComponentStyledProps {
  $open?: boolean;
}

export interface SidebarToggleButtonStyledProps extends CommonCssComponentStyledProps<HTMLButtonElement> {
  $open?: boolean;
}
