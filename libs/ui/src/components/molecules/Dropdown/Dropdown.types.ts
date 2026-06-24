import type { PropsWithChildren } from 'react';

import type { BoxCssComponentProps, BoxCssComponentStyledProps } from '@components/index.types';
import type { OnSelectProps } from '@components/atoms/types/events.types';

export type DropdownProps = PropsWithChildren<BoxCssComponentProps>;
export type DropdownStyledProps = PropsWithChildren<BoxCssComponentStyledProps>;
export interface DropdownContextType {
  onSelect?: (props: OnSelectProps) => void;
}
