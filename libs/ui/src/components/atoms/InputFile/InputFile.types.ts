import type { ChangeEvent, PropsWithChildren } from 'react';
import type { ButtonProps, CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export interface InputFileProps extends PropsWithChildren, CommonCssComponentProps<HTMLInputElement> {
  accept?: string;
  capture?: boolean | 'user' | 'environment';
  multiple?: boolean;
  disabled?: boolean;
  buttonProps?: ButtonProps;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  isIcon?: boolean;
}

export interface InputFileStyledProps extends CommonCssComponentStyledProps<HTMLInputElement> {
  accept?: string;
  capture?: boolean | 'user' | 'environment';
  multiple?: boolean;
  disabled?: boolean;
}

export type InputFileWrapperStyledProps = CommonCssComponentStyledProps;
