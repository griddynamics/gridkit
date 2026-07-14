import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { convertToInlineBoxStyles } from '@tokens';
import type { InlineBoxStyles } from '@types';

import { TABLE_CELL_COMPONENT } from './constants';
import { TableCellStyled } from './TableStyled';
import type { TableCellProps } from './Table.types';

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, styles = {}, ...rest }, forwardedRef) => {
    const { theme } = useTheme();

    return (
      <TableCellStyled
        ref={forwardedRef}
        theme={theme}
        data-testid={TABLE_CELL_COMPONENT}
        styles={styles}
        {...convertToInlineBoxStyles(rest as InlineBoxStyles)}
      >
        {children}
      </TableCellStyled>
    );
  }
);

TableCell.displayName = TABLE_CELL_COMPONENT;
