'use client';
import { useEffect, useRef } from 'react';
import { css, keyframes } from '@emotion/react';

import type { DefaultTheme } from '@hooks';
import { useLogger } from '@hooks/useLogger';
import { animations } from '@tokens/animations';
import { chart } from '@tokens/chart';
import type { ChartTooltipConfig, ChartTooltipPayload } from './Chart.types';
import { COMPONENT_NAME } from './constants';
import { useTooltipTheme } from './useChartTheme';

const tooltipFadeIn = keyframes(animations.tooltipFadeIn);

const tooltipEnterStyle = css({
  animation: `${tooltipFadeIn} ${chart.tooltip.enter.animationDuration} ${chart.tooltip.enter.animationTimingFunction}`,
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
});

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
  theme: DefaultTheme;
  config?: ChartTooltipConfig;
}

export const ChartTooltipContent = ({ active, payload, label, theme, config }: ChartTooltipContentProps) => {
  const logger = useLogger();
  const { containerStyles, labelStyles, itemStyles, dotStyles } = useTooltipTheme(theme);
  const prevActive = useRef(false);

  useEffect(() => {
    const isActive = !!active && !!payload?.length;
    if (isActive && !prevActive.current) {
      logger.debug(`[${COMPONENT_NAME}] Tooltip activated`, {
        component: COMPONENT_NAME,
        subComponent: 'ChartTooltipContent',
        label,
        seriesCount: payload?.length ?? 0,
      });
    } else if (!isActive && prevActive.current) {
      logger.debug(`[${COMPONENT_NAME}] Tooltip deactivated`, {
        component: COMPONENT_NAME,
        subComponent: 'ChartTooltipContent',
      });
    }
    prevActive.current = isActive;
  }, [active, payload, label, logger]);

  if (!active || !payload?.length) return null;

  let displayLabel: string | undefined;
  if (typeof config?.labelFormatter === 'function') {
    try {
      displayLabel = config.labelFormatter(String(label));
    } catch (err) {
      logger.warn(`[${COMPONENT_NAME}] tooltip.labelFormatter threw error`, {
        component: COMPONENT_NAME,
        field: 'tooltip.labelFormatter',
        error: err instanceof Error ? err.message : String(err),
      });
      displayLabel = label;
    }
  } else {
    displayLabel = label;
  }

  return (
    <div css={[containerStyles, tooltipEnterStyle]}>
      {displayLabel && <div css={labelStyles}>{displayLabel}</div>}
      {payload.map((entry) => {
        let displayValue: string | number;
        if (typeof config?.valueFormatter === 'function') {
          try {
            displayValue = config.valueFormatter(Number(entry.value), entry.name);
          } catch (err) {
            logger.warn(`[${COMPONENT_NAME}] tooltip.valueFormatter threw error`, {
              component: COMPONENT_NAME,
              field: 'tooltip.valueFormatter',
              error: err instanceof Error ? err.message : String(err),
            });
            displayValue = entry.value;
          }
        } else {
          displayValue = entry.value;
        }

        return (
          <div key={entry.dataKey || entry.name} css={itemStyles}>
            <span css={[dotStyles, { backgroundColor: entry.color }]} />
            <span>
              {entry.name}: {displayValue}
            </span>
          </div>
        );
      })}
    </div>
  );
};
