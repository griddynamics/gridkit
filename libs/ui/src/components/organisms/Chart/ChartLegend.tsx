'use client';
import { useRef, useEffect, useState } from 'react';
import type { CSSObject } from '@emotion/react';
import type { DefaultTheme } from '@hooks';
import { useLogger } from '@hooks/useLogger';
import { Tooltip } from '@components/molecules/Tooltip';
import type { ChartLegendItem } from './Chart.types';
import { COMPONENT_NAME } from './constants';
import { useLegendTheme } from './useChartTheme';

interface ChartLegendProps {
  items: ChartLegendItem[];
  theme: DefaultTheme;
  interactive?: boolean;
  onToggle?: (dataKey: string) => void;
}

interface LegendLabelProps {
  label: string;
  styles: CSSObject;
}

const LegendLabel = ({ label, styles }: LegendLabelProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setIsOverflowing(el.scrollWidth > el.clientWidth);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [label]);

  const span = (
    <span ref={ref} css={styles}>
      {label}
    </span>
  );

  return isOverflowing ? (
    <Tooltip content={label} position="top">
      {span}
    </Tooltip>
  ) : (
    span
  );
};

export const ChartLegend = ({ items, theme, interactive = false, onToggle }: ChartLegendProps) => {
  const logger = useLogger();
  const { containerStyles, itemStyles, itemInteractiveStyles, itemHiddenStyles, labelTextStyles, dotStyles } =
    useLegendTheme(theme);

  return (
    <div css={containerStyles} data-testid="Chart-legend">
      {items.map((item) => {
        const handleClick =
          interactive && onToggle
            ? () => {
                logger.debug(`[${COMPONENT_NAME}] Legend item toggled`, {
                  component: COMPONENT_NAME,
                  subComponent: 'ChartLegend',
                  dataKey: item.dataKey,
                  label: item.label,
                  action: item.hidden ? 'Show' : 'Hide',
                  trigger: 'click',
                });
                onToggle(item.dataKey);
              }
            : undefined;
        const handleKeyDown =
          interactive && onToggle
            ? (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  logger.debug(`[${COMPONENT_NAME}] Legend item toggled`, {
                    component: COMPONENT_NAME,
                    subComponent: 'ChartLegend',
                    dataKey: item.dataKey,
                    label: item.label,
                    action: item.hidden ? 'Show' : 'Hide',
                    trigger: 'keyboard',
                  });
                  onToggle(item.dataKey);
                }
              }
            : undefined;

        return (
          <div
            key={item.dataKey}
            css={[itemStyles, interactive && itemInteractiveStyles, item.hidden && itemHiddenStyles]}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-pressed={interactive ? !item.hidden : undefined}
            data-testid={`Chart-legend-item-${item.dataKey}`}
          >
            <span css={[dotStyles, { backgroundColor: item.color }]} />
            <LegendLabel label={item.label} styles={labelTextStyles} />
          </div>
        );
      })}
    </div>
  );
};
