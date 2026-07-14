import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { convertToInlineBoxStyles } from '@tokens';
import type { InlineBoxStyles } from '@types';

import { TABLE_BODY_COMPONENT } from './constants';
import { TableBodyStyled } from './TableStyled';
import type { TableBodyProps } from './Table.types';

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, styles = {}, ...rest }, forwardedRef) => {
    const { theme } = useTheme();

    return (
      <TableBodyStyled
        ref={forwardedRef}
        theme={theme}
        data-testid={TABLE_BODY_COMPONENT}
        styles={styles}
        {...convertToInlineBoxStyles(rest as InlineBoxStyles)}
      >
        {children}
      </TableBodyStyled>
    );
  }
);

TableBody.displayName = TABLE_BODY_COMPONENT;
