import type { EnumOrPrimitive, InputColorVariant } from '@types';
import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components/index.types';

export enum TextareaResize {
  None = 'none',
  Both = 'both',
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export type TextareaVariant = 'default' | 'inline';

export type TextareaUpdatedSize = { height: number; width: number };
export type TextareaRestHtmlProps = Partial<Omit<HTMLTextAreaElement, keyof TextareaProps>>;

export interface TextareaProps extends CommonCssComponentProps<HTMLTextAreaElement> {
  resize?: EnumOrPrimitive<TextareaResize>;
  variant?: TextareaVariant;
  color?: EnumOrPrimitive<InputColorVariant>;
  ariaDescribedBy?: string;
  dynamicHeightAdjustment?: boolean;
  onCustomResize?: (newSize: { height: number; width: number }) => void;
  minHeight?: string;
  maxHeight?: string;
  maxCharacters?: number;
}

export interface TextareaStyledProps extends CommonCssComponentStyledProps<HTMLTextAreaElement> {
  $minHeight?: string;
  $maxHeight?: string;
  $resize?: EnumOrPrimitive<TextareaResize>;
  $variant?: TextareaVariant;
  $color?: EnumOrPrimitive<InputColorVariant>;
  value?: string;
}
