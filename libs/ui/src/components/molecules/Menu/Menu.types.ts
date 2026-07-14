import type { ReactNode, Ref } from 'react';

import {
  BoxCssComponentProps,
  CommonCssComponentStyledProps,
  Option,
  SelectOnSelect,
  ItemIdentifier,
} from '@components';

export type MenuPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface MenuProps extends Omit<
  BoxCssComponentProps,
  'content' | 'onSelect' | 'minHeight' | 'maxHeight' | 'offsetX' | 'offsetY'
> {
  itemIdentifier?: ItemIdentifier;
  content?: ReactNode;
  onSelect?: SelectOnSelect;
  closeOnSelect?: boolean;
  offsetX?: number;
  offsetY?: number;
  minHeight?: number;
  maxHeight?: number;
  placement?: MenuPlacement;
}

export interface MenuRef {
  ref: Ref<HTMLDivElement>;
  selectedValue?: Option | null;
  isOpen: boolean;
  onSelect: SelectOnSelect;
  open: (target?: EventTarget | null) => void;
  close: (target?: EventTarget | null) => void;
}

export type MenuTriggerStyledProps = CommonCssComponentStyledProps;
export type MenuContentStyledProps = CommonCssComponentStyledProps;
