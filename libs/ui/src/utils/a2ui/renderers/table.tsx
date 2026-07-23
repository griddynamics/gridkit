import { Fragment, isValidElement, type ReactNode } from 'react';
import { Box, Column, Icon, Row, Table, Typography } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles } from '../helpers';

function isA2UIComponent(value: unknown): value is A2UIComponent {
  return typeof value === 'object' && value !== null && typeof (value as Record<string, unknown>)['type'] === 'string';
}

function formatRowKey(key: string): string {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase());
}

function renderExpandedValue(value: unknown): ReactNode {
  if (value == null) return null;
  if (isValidElement(value)) return value;

  if (Array.isArray(value)) {
    return (
      <Column gutter="4px">
        {value.map((item, index) => (
          <Box key={index} styles={{ paddingLeft: '8px' }}>
            {renderExpandedValue(item)}
          </Box>
        ))}
      </Column>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v != null);
    if (entries.length === 0) return null;
    return (
      <Column gutter="4px">
        {entries.map(([key, val]) => {
          if (typeof val === 'object' && !isValidElement(val)) {
            return (
              <Box key={key}>
                <Typography variant="p">
                  <strong>{formatRowKey(key)}</strong>
                </Typography>
                <Box styles={{ paddingLeft: '8px' }}>{renderExpandedValue(val)}</Box>
              </Box>
            );
          }
          return (
            <Typography key={key} variant="p">
              <strong>{formatRowKey(key)}: </strong>
              {String(val)}
            </Typography>
          );
        })}
      </Column>
    );
  }

  return <Fragment>{String(value)}</Fragment>;
}

function renderRowExtras(row: Record<string, unknown>, columnKeys: Set<string>): ReactNode {
  const extras = Object.entries(row).filter(([key]) => key !== 'id' && !columnKeys.has(key));
  if (extras.length === 0) return null;

  if (extras.length === 1 && extras[0]?.[0] === 'expandedContent') {
    return <Box padding="16px">{renderExpandedValue(extras[0][1])}</Box>;
  }

  return (
    <Box padding="16px">
      <Column gutter="8px">
        {extras.map(([key, value]) => {
          if (value != null && typeof value === 'object' && !isValidElement(value)) {
            return (
              <Box key={key}>
                <Typography variant="p">
                  <strong>{formatRowKey(key)}</strong>
                </Typography>
                <Box styles={{ paddingLeft: '8px' }}>{renderExpandedValue(value)}</Box>
              </Box>
            );
          }
          return (
            <Typography key={key} variant="p">
              <strong>{formatRowKey(key)}: </strong>
              {value == null ? null : String(value)}
            </Typography>
          );
        })}
      </Column>
    </Box>
  );
}

const EXPAND_AFFORDANCE_STYLES = {
  '.expand-icon-wrapper svg': {
    transition: 'transform 0.2s ease-in-out',
  },
  'tr[data-expanded="true"] .expand-icon-wrapper svg': {
    transform: 'rotate(90deg)',
  },
} as const;

export const tableRenderers = {
  table: (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => {
    const columnKeys = new Set((component.columns ?? []).map((c) => c.key));
    const rawRows = component.rows ?? component.data ?? [];

    const resolvedData = rawRows.map((row, index) => {
      const resolved: Record<string, unknown> = {
        id: typeof row['id'] === 'string' || typeof row['id'] === 'number' ? row['id'] : `${component.id}-row-${index}`,
      };
      for (const [key, value] of Object.entries(row)) {
        if (key === 'id') continue;
        resolved[key] = isA2UIComponent(value) ? renderChildren([value])[0] : value;
      }
      return resolved;
    });

    const hasExtraFields = rawRows.some((row) => Object.keys(row).some((key) => key !== 'id' && !columnKeys.has(key)));
    const expandableRows = component.expandableRows === true || hasExtraFields;

    const renderExpandedContent = expandableRows
      ? (row: Record<string, unknown>) => renderRowExtras(row, columnKeys)
      : undefined;

    const tableColumns = (component.columns || []).map((column, index) => {
      const base = {
        id: column.key,
        label: column.label,
        accessor: column.key,
        width: column.width,
      };

      if (expandableRows && index === 0) {
        return {
          ...base,
          render: (row: Record<string, unknown>) => (
            <Row alignItems="center" gap="8px">
              <Box className="expand-icon-wrapper" styles={{ display: 'inline-flex' }}>
                <Icon name="arrowRight" size="xs" />
              </Box>
              {renderExpandedValue(row[column.key])}
            </Row>
          ),
        };
      }

      return base;
    });

    const baseStyles = getMergedComponentStyles(component);
    const mergedStyles = expandableRows ? { ...EXPAND_AFFORDANCE_STYLES, ...baseStyles } : baseStyles;

    return (
      <Table
        key={component.id}
        columns={tableColumns}
        data={resolvedData as never}
        expandableRows={expandableRows}
        renderExpandedContent={renderExpandedContent}
        pagination={(component as A2UIComponent & { pagination?: boolean }).pagination}
        pageSize={(component as A2UIComponent & { pageSize?: number }).pageSize}
        pageSizes={(component as A2UIComponent & { pageSizes?: number[] }).pageSizes}
        stickyHeader={(component as A2UIComponent & { stickyHeader?: boolean }).stickyHeader}
        stickyFooter={(component as A2UIComponent & { stickyFooter?: boolean }).stickyFooter}
        stickyPagination={(component as A2UIComponent & { stickyPagination?: boolean }).stickyPagination}
        virtualized={(component as A2UIComponent & { virtualized?: boolean }).virtualized}
        rowHeight={(component as A2UIComponent & { rowHeight?: number }).rowHeight}
        minVisibleRange={(component as A2UIComponent & { minVisibleRange?: number }).minVisibleRange}
        loading={component.isLoading}
        aria-label={component.ariaLabel}
        className={component.className}
        styles={mergedStyles}
      />
    );
  },
};
