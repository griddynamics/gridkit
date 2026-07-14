import type { ElementType, PropsWithChildren } from 'react';

import type { WrapperVariant, Maybe, EnumOrPrimitive } from '@types';
import type { CommonCssComponentProps } from '@components';

export interface PortalProps extends CommonCssComponentProps, PropsWithChildren {
  container?: Maybe<Element | DocumentFragment>;
  wrapperVariant?: EnumOrPrimitive<WrapperVariant>;
  withWrapper?: boolean;
  blocksScroll?: boolean;
  WrapperView?: keyof HTMLElementTagNameMap | ElementType;
}
