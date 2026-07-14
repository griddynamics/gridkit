import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { convertToInlineBoxStyles } from '@tokens';
import type { InlineBoxStyles } from '@types';

import { TABLE_ROW_COMPONENT } from './constants';
import { TableRowStyled } from './TableStyled';
import type { TableRowProps } from './Table.types';

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    { children, expanded = false, expandable = false, isFooter, isHeader, onExpand, onClick, styles = {}, ...rest },
    forwardedRef
  ) => {
    const { theme } = useTheme();

    const handleClick = () => {
      if (expandable && onExpand) {
        onExpand();
      }
      if (onClick) {
        onClick();
      }
    };

    return (
      <TableRowStyled
        ref={forwardedRef}
        theme={theme}
        $expanded={expanded}
        $expandable={expandable}
        $isHeader={isHeader}
        $isFooter={isFooter}
        data-testid={TABLE_ROW_COMPONENT}
        data-expanded={expanded}
        onClick={handleClick}
        styles={styles}
        {...convertToInlineBoxStyles(rest as InlineBoxStyles)}
      >
        {children}
      </TableRowStyled>
    );
  }
);

TableRow.displayName = TABLE_ROW_COMPONENT;
