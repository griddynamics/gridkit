import type { PropsWithChildren, ReactNode } from 'react';
import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components/index.types';
import { ButtonProps } from '@components';
import { Theme } from '@hooks';

export interface TabProps {
  id?: string | number;
  label: ReactNode;
  content: ReactNode;
  isDisabled?: boolean;
  noticeCounter?: number | string;
}

export interface TabsProps extends CommonCssComponentProps {
  tabs?: (TabProps | never)[];
  activeTab?: number;
  ariaLabel?: string;
  onTabChange?: (index: number) => void;
}
export interface TabsStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {}

export interface TabLabelStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {
  $isActive?: boolean;
  $isDisabled?: boolean;
}

export interface StyledTextButtonProps extends ButtonProps {
  theme?: Theme;
}
