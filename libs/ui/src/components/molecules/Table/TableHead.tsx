import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { convertToInlineBoxStyles } from '@tokens';
import type { InlineBoxStyles } from '@types';

import { TABLE_HEAD_COMPONENT } from './constants';
import { TableHeadStyled } from './TableStyled';
import type { TableHeadProps } from './';

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  ({ children, sticky = false, ...rest }, forwardedRef) => {
    const { theme } = useTheme();

    return (
      <TableHeadStyled
        ref={forwardedRef}
        theme={theme}
        $sticky={sticky}
        data-testid={TABLE_HEAD_COMPONENT}
        {...convertToInlineBoxStyles(rest as InlineBoxStyles)}
      >
        {children}
      </TableHeadStyled>
    );
  }
);

TableHead.displayName = TABLE_HEAD_COMPONENT;
