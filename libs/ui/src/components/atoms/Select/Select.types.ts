import type { PropsWithChildren, ReactNode, MouseEvent, ReactEventHandler, Ref, InputHTMLAttributes } from 'react';

import type { Theme } from '@hooks/useTheme';
import type { EnumOrPrimitive, InputColorVariant } from '@types';
import type { ButtonProps, CommonCssComponentProps, CommonCssComponentStyledProps, OnSelectProps } from '@components';

export type ItemIdentifier = (selected: Option | null, current: Option) => boolean;
export type SelectOnSelect = (props: OnSelectProps) => void;
export interface Option<V = unknown> {
  name: string;
  value?: V;
}

export type renderOptionType = {
  item: Option;
  index: number;
  isActiveItem: boolean;
  className: string;
};

export interface SelectProps<T = HTMLDivElement>
  extends Omit<CommonCssComponentProps<T>, 'onSelect' | 'onChange'>, PropsWithChildren {
  items?: (never | Option)[];
  onSelect?: SelectOnSelect;
  onKeyDown?: ReactEventHandler<T>;
  onInitiatorClick?: (event: MouseEvent<T>) => void;
  children?: ReactNode;
  itemsCount?: number;
  initiator?: ReactNode;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  emptyItemsResult?: ReactNode;
  renderOption?: (data: renderOptionType) => ReactNode;
  autoOpen?: boolean;
  activeIndex?: string | number;
  value?: Option | Option[] | null;
  onChange?: (data: Option | Option[]) => void;
  itemStringifier?: (data: Option) => string;
  itemIdentifier?: ItemIdentifier;
  disabled?: boolean;
  placeholder?: string;
  dropdownMaxHeight?: string;
  adornmentStart?: ReactNode;
  adornmentEnd?: ReactNode;
  multiple?: boolean;
  color?: EnumOrPrimitive<InputColorVariant>;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export interface SelectRef {
  ref: Ref<HTMLDivElement>;
  selectedValue?: Option | Option[] | null;
  isOpen: boolean;
  onSelect: SelectOnSelect;
  open: () => void;
  close: () => void;
}

export interface SelectContextType {
  onSelect: SelectOnSelect;
  value?: Option | Option[] | null;
  itemIdentifier?: ItemIdentifier;
  multiple?: boolean;
}

export interface SelectWrapperStyledProps extends CommonCssComponentStyledProps {
  $disabled?: boolean;
}

export interface ArrowIconWrapperStyledProps extends CommonCssComponentStyledProps {
  $isOpen?: boolean;
}

export interface SelectInitiatorWrapperStyledProps extends CommonCssComponentStyledProps {
  width?: string;
}

export type DropdownIconStyledProps = CommonCssComponentStyledProps;
export type SelectAdornmentStyledProps = PropsWithChildren<CommonCssComponentStyledProps>;
export type SelectSearchInputStyledProps = CommonCssComponentStyledProps & InputHTMLAttributes<HTMLInputElement>;
export interface DropdownButtonStyledProps extends ButtonProps {
  theme?: Theme;
  $color?: EnumOrPrimitive<InputColorVariant>;
}
