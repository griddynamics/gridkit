import type { SelectProps, CommonCssComponentStyledProps } from '@components';

export interface DropdownItemProps<T> extends Partial<
  Pick<SelectProps<T>, 'styles' | 'onSelect' | 'children' | 'className'>
> {
  name?: string;
  disabled?: boolean;
  value?: unknown;
}

export interface DropdownItemStyledProps extends CommonCssComponentStyledProps {
  $disabled?: boolean;
}
