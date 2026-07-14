import type { PropsWithChildren, Ref } from 'react';

import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export interface TruncateProps extends CommonCssComponentProps<HTMLSpanElement>, PropsWithChildren {
  lines?: number;
}

export interface TruncateRef {
  ref: Ref<HTMLSpanElement>;
  isTruncated: boolean;
}

export interface TruncateStyledProps extends CommonCssComponentStyledProps<HTMLSpanElement> {
  $lines?: number;
}
