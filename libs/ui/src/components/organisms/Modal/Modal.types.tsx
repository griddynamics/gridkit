import type { PropsWithChildren, ReactNode } from 'react';

import type { BoxCssComponentProps, BoxCssComponentStyledProps, CommonCssComponentStyledProps } from '@components';

export interface ModalProps extends Omit<BoxCssComponentProps, 'title'>, PropsWithChildren {
  isOpen?: boolean;
  isCustomView?: boolean;
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  footer?: ReactNode;
}

export interface ModalContentStyledProps extends Omit<BoxCssComponentStyledProps, 'onClick'>, PropsWithChildren {
  onClick: (event: Event) => void;
}

export type ModalCommonStyledProps<T = HTMLDivElement> = CommonCssComponentStyledProps<T> & PropsWithChildren;

export interface ModalHeaderStyledProps extends BoxCssComponentStyledProps, PropsWithChildren {
  $withTitle: boolean;
}
