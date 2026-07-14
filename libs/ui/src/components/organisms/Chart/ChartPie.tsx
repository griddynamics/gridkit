'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { useTooltip, TooltipWithBounds } from '@visx/tooltip';

import type { DefaultTheme } from '@hooks';
import { useLogger } from '@hooks/useLogger';
import { chart } from '@tokens/chart';
import { getContrastColor } from '@utils';
import type { ChartDataRecord, ChartPieConfig, ChartTooltipConfig, ChartTooltipPayload } from './Chart.types';
import { ChartTooltipContent } from './ChartTooltip';
import { COMPONENT_NAME, DEFAULT_PIE_OUTER_RADIUS, DEFAULT_DONUT_INNER_RADIUS } from './constants';
import { useHoverTheme } from './useChartTheme';

interface ChartPieProps {
  data: ChartDataRecord[];
  pieConfig: ChartPieConfig;
  colors: string[];
  tooltipConfig?: ChartTooltipConfig;
  animate?: boolean;
  theme: DefaultTheme;
  isDonut?: boolean;
  onDataPointClick?: (data: ChartDataRecord, index: number) => void;
  hiddenSeries: Set<string>;
  width: number;
  height: number;
}

const RADIAN = Math.PI / 180;

/** Convert percentage string (e.g. '80%') or number to pixels based on available size */
function resolveRadius(value: string | number, availableSize: number): number {
  if (typeof value === 'string' && value.endsWith('%')) {
    return (parseFloat(value) / 100) * (availableSize / 2);
  }
  return typeof value === 'number' ? value : parseFloat(value) || 0;
}

export const ChartPie = ({
  data,
  pieConfig,
  colors,
  tooltipConfig,
  animate = true,
  theme,
  isDonut = false,
  onDataPointClick,
  hiddenSeries,
  width,
  height,
}: ChartPieProps) => {
  const logger = useLogger();
  const hoverTheme = useHoverTheme(theme);

  // Transition-based animation: segments start hidden, then reveal with stagger
  const [revealed, setRevealed] = useState(!animate);
  const prefersReducedRef = useRef(false);

  useEffect(() => {
    if (!animate) {
      setRevealed(true);
      return;
    }

    setRevealed(false);

    prefersReducedRef.current = !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedRef.current) {
      setRevealed(true);
      return;
    }

    // Double rAF ensures initial styles are painted before transition triggers
    let rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => setRevealed(true));
    });
    return () => cancelAnimationFrame(rafId);
  }, [animate]);

  const rawInnerRadius = isDonut ? pieConfig.innerRadius || DEFAULT_DONUT_INNER_RADIUS : pieConfig.innerRadius || 0;
  const rawOuterRadius = pieConfig.outerRadius || DEFAULT_PIE_OUTER_RADIUS;

  const minDim = Math.min(width, height);
  const innerRadius = resolveRadius(rawInnerRadius, minDim);
  const outerRadius = resolveRadius(rawOuterRadius, minDim);

  const cx = width / 2;
  const cy = height / 2;

  // Filter out hidden slices based on legend toggle
  const visibleData = useMemo(
    () =>
      data.filter((record) => {
        const name = String(record[pieConfig.nameKey] ?? '');
        return !hiddenSeries.has(name);
      }),
    [data, pieConfig.nameKey, hiddenSeries]
  );

  useEffect(() => {
    logger.debug(`[${COMPONENT_NAME}] ChartPie rendered`, {
      component: COMPONENT_NAME,
      subComponent: 'ChartPie',
      totalSlices: data.length,
      visibleSlices: visibleData.length,
      hiddenSlices: data.length - visibleData.length,
      isDonut,
    });

    // Validate pieConfig keys exist in data
    if (data.length > 0) {
      const sampleKeys = Object.keys(data[0]);
      if (!sampleKeys.includes(pieConfig.nameKey)) {
        logger.warn(
          `[${COMPONENT_NAME}] pieConfig.nameKey "${pieConfig.nameKey}" not found in data keys [${sampleKeys.join(
            ', '
          )}]`,
          {
            component: COMPONENT_NAME,
            field: 'pieConfig.nameKey',
            availableKeys: sampleKeys,
          }
        );
      }
      if (!sampleKeys.includes(pieConfig.dataKey)) {
        logger.warn(
          `[${COMPONENT_NAME}] pieConfig.dataKey "${pieConfig.dataKey}" not found in data keys [${sampleKeys.join(
            ', '
          )}]`,
          {
            component: COMPONENT_NAME,
            field: 'pieConfig.dataKey',
            availableKeys: sampleKeys,
          }
        );
      }
    }

    if (pieConfig.labelFormatter != null && typeof pieConfig.labelFormatter !== 'function') {
      logger.warn(`[${COMPONENT_NAME}] pieConfig.labelFormatter is not a function, ignoring`, {
        component: COMPONENT_NAME,
        field: 'pieConfig.labelFormatter',
        receivedType: typeof pieConfig.labelFormatter,
      });
    }
  }, [logger, data, visibleData.length, isDonut, pieConfig.nameKey, pieConfig.dataKey, pieConfig.labelFormatter]);

  const getColor = useCallback(
    (record: ChartDataRecord) => {
      const originalIndex = data.indexOf(record);
      return colors[originalIndex % colors.length];
    },
    [data, colors]
  );

  // Convert degrees to radians for visx
  const startAngle = (pieConfig.startAngle ?? 0) * RADIAN;
  const endAngle = (pieConfig.endAngle ?? 360) * RADIAN;
  const padAngle = (pieConfig.paddingAngle || 0) * RADIAN;

  // Tooltip
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, showTooltip, hideTooltip } = useTooltip<{
    record: ChartDataRecord;
    index: number;
  }>();

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGPathElement>, record: ChartDataRecord, index: number) => {
      if (tooltipConfig?.enabled === false) return;
      const svgRect = (event.currentTarget.ownerSVGElement as SVGSVGElement)?.getBoundingClientRect();
      if (!svgRect) return;
      showTooltip({
        tooltipLeft: event.clientX - svgRect.left,
        tooltipTop: event.clientY - svgRect.top,
        tooltipData: { record, index },
      });
    },
    [tooltipConfig?.enabled, showTooltip]
  );

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseLeave = useCallback(() => {
    hideTooltip();
    setHoveredIndex(null);
  }, [hideTooltip]);

  // Compute total for percentage labels
  const total = useMemo(
    () => visibleData.reduce((sum, d) => sum + (Number(d[pieConfig.dataKey]) || 0), 0),
    [visibleData, pieConfig.dataKey]
  );

  return (
    <div style={{ position: 'relative', width, height }}>
      <svg width={width} height={height}>
        <Group top={cy} left={cx}>
          <Pie
            data={visibleData}
            pieValue={(d: ChartDataRecord) => Number(d[pieConfig.dataKey]) || 0}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            padAngle={padAngle}
          >
            {(pie) =>
              pie.arcs.map((arc, i) => {
                const record = arc.data;
                const originalIndex = data.indexOf(record);
                const color = getColor(record);
                const [arcCentroidX, arcCentroidY] = pie.path.centroid(arc);

                const name = String(record[pieConfig.nameKey] ?? '');
                const value = Number(record[pieConfig.dataKey]) || 0;
                const percent = total > 0 ? value / total : 0;

                let labelText: string;
                if (typeof pieConfig.labelFormatter === 'function') {
                  try {
                    labelText = pieConfig.labelFormatter(value, name);
                  } catch (err) {
                    logger.warn(`[${COMPONENT_NAME}] pieConfig.labelFormatter threw error`, {
                      component: COMPONENT_NAME,
                      field: 'pieConfig.labelFormatter',
                      error: err instanceof Error ? err.message : String(err),
                    });
                    labelText = `${(percent * 100).toFixed(0)}%`;
                  }
                } else {
                  labelText = `${(percent * 100).toFixed(0)}%`;
                }
                const textColor = getContrastColor(color);

                // Normalized direction from center to segment centroid
                const centroidDist = Math.sqrt(arcCentroidX ** 2 + arcCentroidY ** 2);
                const dirX = centroidDist > 0 ? arcCentroidX / centroidDist : 0;
                const dirY = centroidDist > 0 ? arcCentroidY / centroidDist : 0;

                // Entry animation (outer <g>): push inward → settle to position
                const pushX = dirX * chart.animation.pie.pushDistance;
                const pushY = dirY * chart.animation.pie.pushDistance;
                const staggerDelay = i * chart.animation.pie.segmentStagger;
                const segDuration = chart.animation.pie.segmentDuration;

                const entryStyle: React.CSSProperties = animate
                  ? {
                      opacity: revealed ? 1 : 0,
                      transform: revealed
                        ? 'translate(0, 0) scale(1)'
                        : `translate(${pushX}px, ${pushY}px) scale(0.85)`,
                      transition: `opacity ${segDuration}ms ease-out ${staggerDelay}ms, transform ${segDuration}ms ease-out ${staggerDelay}ms`,
                    }
                  : {};

                // Hover effect (inner <g>): segment separates outward + brightness
                const isHovered = hoveredIndex === i;
                const hoverX = dirX * chart.animation.pie.hoverDistance;
                const hoverY = dirY * chart.animation.pie.hoverDistance;

                const hoverStyle: React.CSSProperties = {
                  transform: isHovered ? `translate(${hoverX}px, ${hoverY}px)` : 'translate(0, 0)',
                  filter: isHovered ? hoverTheme.pie.brightness : 'brightness(1)',
                  transition: prefersReducedRef.current ? 'none' : hoverTheme.pie.transition,
                };

                return (
                  <g key={`arc-${i}`} style={entryStyle}>
                    <g style={hoverStyle}>
                      <path
                        d={pie.path(arc) || ''}
                        fill={color}
                        style={onDataPointClick ? { cursor: 'pointer' } : undefined}
                        onClick={onDataPointClick ? () => onDataPointClick(record, originalIndex) : undefined}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseMove={(e) => handleMouseMove(e, record, originalIndex)}
                        onMouseLeave={handleMouseLeave}
                      />
                      {pieConfig.showLabels && (
                        <text
                          x={arcCentroidX}
                          y={arcCentroidY}
                          fill={textColor}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={12}
                          pointerEvents="none"
                        >
                          {labelText}
                        </text>
                      )}
                    </g>
                  </g>
                );
              })
            }
          </Pie>
        </Group>
      </svg>

      {tooltipConfig?.enabled !== false && tooltipOpen && tooltipData && (
        <TooltipWithBounds
          left={tooltipLeft}
          top={tooltipTop}
          style={{ position: 'absolute', pointerEvents: 'none', padding: 0, background: 'none', boxShadow: 'none' }}
        >
          <ChartTooltipContent
            active={true}
            payload={[
              {
                name: String(tooltipData.record[pieConfig.nameKey] ?? ''),
                value: Number(tooltipData.record[pieConfig.dataKey]) || 0,
                color: getColor(tooltipData.record),
                dataKey: pieConfig.dataKey,
              },
            ]}
            label={String(tooltipData.record[pieConfig.nameKey] ?? '')}
            theme={theme}
            config={tooltipConfig}
          />
        </TooltipWithBounds>
      )}
    </div>
  );
};
