import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { DropdownStyledProps } from './Dropdown.types';

export const DropdownStyled = forwardRef<HTMLDivElement, DropdownStyledProps>(
  ({ theme: { select, ...rest } = {}, styles = {}, ...restProps }, forwardRef) => {
    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
    const themeSelect = new Proxy(select || {}, tokensHandler(rest));
    const computedStyles = [get(themeSelect, 'dropdown', {}), boxStyles, styles];

    return <div css={computedStyles} {...restNotStyledProps} ref={forwardRef} />;
  }
);
