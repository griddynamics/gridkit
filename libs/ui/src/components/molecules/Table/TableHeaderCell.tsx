import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { convertToInlineBoxStyles } from '@tokens';
import type { InlineBoxStyles } from '@types';

import { TABLE_HEADER_CELL_COMPONENT } from './constants';
import { TableHeaderCellStyled } from './TableStyled';
import type { TableHeaderCellProps } from './';

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ children, styles = {}, ...rest }, forwardedRef) => {
    const { theme } = useTheme();

    return (
      <TableHeaderCellStyled
        ref={forwardedRef}
        theme={theme}
        data-testid={TABLE_HEADER_CELL_COMPONENT}
        styles={styles}
        {...convertToInlineBoxStyles(rest as InlineBoxStyles)}
      >
        {children}
      </TableHeaderCellStyled>
    );
  }
);

TableHeaderCell.displayName = TABLE_HEADER_CELL_COMPONENT;
