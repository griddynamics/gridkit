import { PropsWithChildren, ReactNode } from 'react';
import {
  CommonCssComponentProps,
  CommonCssComponentStyledProps,
  BoxCssComponentProps,
  BoxCssComponentStyledProps,
} from '@components/index.types';

export interface AccordionBaseProps
  extends CommonCssComponentProps, Omit<BoxCssComponentProps, 'onClick'>, PropsWithChildren {
  isOpen?: boolean;
}

export interface AccordionHeaderProps extends AccordionBaseProps {
  expandIcon?: ReactNode;
}

export interface AccordionBasePropsStyled
  extends CommonCssComponentStyledProps, Omit<BoxCssComponentStyledProps, 'onAbort'>, PropsWithChildren {
  $isOpen?: boolean;
  $withoutSeparator?: boolean;
  $isInline?: boolean;
}
export interface AccordionHeaderPropsStyled
  extends CommonCssComponentStyledProps, Omit<BoxCssComponentStyledProps, 'onAbort'>, PropsWithChildren {
  $isInline?: boolean;
}

export type AccordionContextType = {
  openedItems: string[];
  toggleItem: (key: string) => void;
  withoutSeparator?: boolean;
  isInline?: boolean;
};

export interface AccordionWrapperProps {
  children: ReactNode;
  allowMultipleExpand?: boolean;
  withoutSeparator?: boolean;
  value?: string[];
  defaultValue?: string[];
  isInline?: boolean;
  onChange?: (openedItems: string[]) => void;
}
