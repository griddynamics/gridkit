import { forwardRef } from 'react';

import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';

import { TruncateStyledProps } from './Truncate.types';

export const TruncateStyled = forwardRef<HTMLSpanElement, TruncateStyledProps>(
  ({ theme: { truncate, ...rest } = {}, $lines = 1, styles, ...restProps }, forwardedRef) => {
    const themeTruncate = new Proxy(truncate || {}, tokensHandler(rest || {}));
    const computedStyles = [get(themeTruncate, 'default', {}), { lineClamp: $lines, WebkitLineClamp: $lines }, styles];

    return <span css={computedStyles} {...restProps} ref={forwardedRef} />;
  }
);
