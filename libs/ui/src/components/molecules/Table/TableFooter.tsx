import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { convertToInlineBoxStyles } from '@tokens';
import type { InlineBoxStyles } from '@types';

import { TABLE_FOOTER_COMPONENT } from './constants';
import { TableFooterStyled } from './TableStyled';
import type { TableFooterProps } from './Table.types';

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ children, sticky = false, styles = {}, ...rest }, forwardedRef) => {
    const { theme } = useTheme();

    return (
      <TableFooterStyled
        ref={forwardedRef}
        theme={theme}
        $sticky={sticky}
        data-testid={TABLE_FOOTER_COMPONENT}
        styles={styles}
        {...convertToInlineBoxStyles(rest as InlineBoxStyles)}
      >
        {children}
      </TableFooterStyled>
    );
  }
);

TableFooter.displayName = TABLE_FOOTER_COMPONENT;
