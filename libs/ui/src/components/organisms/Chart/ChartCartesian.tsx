'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { XYChart, LineSeries, BarSeries, BarStack, BarGroup, AreaSeries, Axis, Grid, Tooltip } from '@visx/xychart';
import { curveMonotoneX, curveLinear, curveStep, curveNatural } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';

import { createPortal } from 'react-dom';
import { useLogger } from '@hooks/useLogger';
import { useTheme } from '@hooks/useTheme';
import { chart } from '@tokens/chart';
import { TooltipStyled } from '@components/molecules/Tooltip/TooltipStyled';
import type {
  ChartCartesianProps,
  ChartCartesianVariant,
  ChartCurveType,
  ChartDataRecord,
  ChartSeries,
  ChartTooltipPayload,
} from './Chart.types';
import { ChartTooltipContent } from './ChartTooltip';
import { COMPONENT_NAME, DEFAULT_CHART_MARGIN } from './constants';
import { useCartesianTheme, useHoverTheme } from './useChartTheme';

const CURVE_MAP: Record<ChartCurveType, typeof curveLinear> = {
  monotone: curveMonotoneX,
  linear: curveLinear,
  step: curveStep,
  natural: curveNatural,
};

const VARIANT_LABELS: Record<ChartCartesianVariant, string> = {
  line: 'ChartLine',
  bar: 'ChartBar',
  area: 'ChartArea',
};

const TICK_MAX_CHARS = { x: 12, y: 10 } as const;

type AxisTickRendererProps = React.SVGProps<SVGTextElement> & {
  formattedValue?: string;
  to?: { x?: number; y?: number };
  from?: { x?: number; y?: number };
};

// visx calls tickComponent(props) as a direct function — hooks can't live there.
// Solution: outer renderer (no hooks) returns JSX of inner component (hooks work).
const makeTruncatedTickInner = (maxChars: number) =>
  function TruncatedTickInner({ formattedValue, to: _to, from: _from, ...textProps }: AxisTickRendererProps) {
    const { theme } = useTheme();
    const [tickRect, setTickRect] = useState<DOMRect | null>(null);

    const label = formattedValue ?? '';
    const truncated = label.length > maxChars ? `${label.slice(0, maxChars)}…` : label;
    const isTruncated = label !== truncated;
    const portalTarget = typeof document !== 'undefined' ? document.body : null;

    return (
      <>
        <text
          {...textProps}
          pointerEvents="all"
          onMouseEnter={
            isTruncated
              ? (e: React.MouseEvent<SVGTextElement>) =>
                  setTickRect((e.currentTarget as SVGTextElement).getBoundingClientRect())
              : undefined
          }
          onMouseLeave={isTruncated ? () => setTickRect(null) : undefined}
        >
          {truncated}
        </text>
        {isTruncated &&
          tickRect &&
          portalTarget &&
          createPortal(
            <TooltipStyled
              theme={theme}
              className="tooltip-top"
              style={{
                position: 'absolute',
                top: tickRect.top + (typeof window !== 'undefined' ? window.scrollY : 0) - 10,
                left: tickRect.left + (typeof window !== 'undefined' ? window.scrollX : 0) + tickRect.width / 2,
                transform: 'translateX(-50%) translateY(-100%)',
                zIndex: 9999,
                pointerEvents: 'none',
              }}
            >
              {label}
            </TooltipStyled>,
            portalTarget
          )}
      </>
    );
  };

const XAxisTickInner = makeTruncatedTickInner(TICK_MAX_CHARS.x);
const YAxisTickInner = makeTruncatedTickInner(TICK_MAX_CHARS.y);

// Hook-free renderers — visx calls these directly; they return JSX so React
// renders the inner components through the normal component lifecycle.
const XAxisTick = (props: AxisTickRendererProps) => <XAxisTickInner {...props} />;
const YAxisTick = (props: AxisTickRendererProps) => <YAxisTickInner {...props} />;

const defaultYTickFormat = (v: unknown): string => {
  const n = Number(v);
  if (!isFinite(n)) return String(v);
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(abs >= 10e9 ? 0 : 1)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(abs >= 10e6 ? 0 : 1)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(abs >= 10e3 ? 0 : 1)}K`;
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
};

export const ChartCartesian = ({
  variant,
  data,
  xKey,
  series,
  visibleSeries,
  colors,
  xAxis,
  yAxis,
  grid,
  tooltipConfig,
  animate = true,
  theme,
  chartMargin,
  onDataPointClick,
  onDataPointHover,
  width,
  height,
  chartId,
}: ChartCartesianProps) => {
  const logger = useLogger();
  const { axisDefaults, axisLineStyle, axisLabelStyle, gridDefaults } = useCartesianTheme(theme);
  const hoverTheme = useHoverTheme(theme);

  // Transition-based reveal: clip-path starts hidden, then transitions to visible
  const [revealed, setRevealed] = useState(!animate);
  const [revealDone, setRevealDone] = useState(!animate);

  useEffect(() => {
    if (!animate) {
      setRevealed(true);
      setRevealDone(true);
      return;
    }

    setRevealed(false);
    setRevealDone(false);

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReduced) {
      setRevealed(true);
      setRevealDone(true);
      return;
    }

    // Double rAF ensures initial (hidden) styles are painted before transition triggers
    let rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => setRevealed(true));
    });
    return () => cancelAnimationFrame(rafId);
  }, [animate]);

  useEffect(() => {
    const visible = series.filter((s) => visibleSeries.has(s.dataKey));
    const hidden = series.filter((s) => !visibleSeries.has(s.dataKey));
    logger.debug(`[${COMPONENT_NAME}] ${VARIANT_LABELS[variant]} rendered`, {
      component: COMPONENT_NAME,
      subComponent: VARIANT_LABELS[variant],
      seriesCount: series.length,
      visibleSeries: visible.map((s) => s.dataKey),
      hiddenSeries: hidden.map((s) => s.dataKey),
      dataPoints: data.length,
      ...(variant === 'bar' && { hasStacking: series.some((s) => !!s.stackId) }),
    });
  }, [logger, series, visibleSeries, data.length, variant]);

  // Warn once about non-function formatters (safety net for direct usage without A2UI sanitizer)
  useEffect(() => {
    if (xAxis?.tickFormatter != null && typeof xAxis.tickFormatter !== 'function') {
      logger.warn(`[${COMPONENT_NAME}] xAxis.tickFormatter is not a function, ignoring`, {
        component: COMPONENT_NAME,
        field: 'xAxis.tickFormatter',
        receivedType: typeof xAxis.tickFormatter,
      });
    }
    if (yAxis?.tickFormatter != null && typeof yAxis.tickFormatter !== 'function') {
      logger.warn(`[${COMPONENT_NAME}] yAxis.tickFormatter is not a function, ignoring`, {
        component: COMPONENT_NAME,
        field: 'yAxis.tickFormatter',
        receivedType: typeof yAxis.tickFormatter,
      });
    }
    if (tooltipConfig?.valueFormatter != null && typeof tooltipConfig.valueFormatter !== 'function') {
      logger.warn(`[${COMPONENT_NAME}] tooltip.valueFormatter is not a function, ignoring`, {
        component: COMPONENT_NAME,
        field: 'tooltip.valueFormatter',
        receivedType: typeof tooltipConfig.valueFormatter,
      });
    }
    if (tooltipConfig?.labelFormatter != null && typeof tooltipConfig.labelFormatter !== 'function') {
      logger.warn(`[${COMPONENT_NAME}] tooltip.labelFormatter is not a function, ignoring`, {
        component: COMPONENT_NAME,
        field: 'tooltip.labelFormatter',
        receivedType: typeof tooltipConfig.labelFormatter,
      });
    }
    // Warn about series dataKeys not found in data
    if (data.length > 0) {
      const sampleKeys = new Set(Object.keys(data[0]));
      const missingKeys = series.filter((s) => !sampleKeys.has(s.dataKey)).map((s) => s.dataKey);
      if (missingKeys.length > 0) {
        logger.warn(`[${COMPONENT_NAME}] series dataKeys not found in data: [${missingKeys.join(', ')}]`, {
          component: COMPONENT_NAME,
          missingKeys,
          availableKeys: [...sampleKeys],
        });
      }
    }
  }, [
    xAxis?.tickFormatter,
    yAxis?.tickFormatter,
    tooltipConfig?.valueFormatter,
    tooltipConfig?.labelFormatter,
    series,
    data,
    logger,
  ]);

  // Sanitize chartId for SVG id attribute (remove colons from useId)
  const safeChartId = chartId.replace(/:/g, '');

  const xAccessor = useCallback((d: ChartDataRecord) => d[xKey] as string, [xKey]);

  const showGrid = grid?.horizontal !== false || grid?.vertical === true;

  // Always provide an explicit x-domain so axes render even when no series are visible
  const xDomain = useMemo(() => data.map((d) => d[xKey] as string), [data, xKey]);

  // Resolve yAxis domain — convert 'dataMin'/'dataMax' to actual values
  // When all series are hidden, fall back to all series keys so y-axis still has a range
  const yDomain = useMemo(() => {
    const allHidden = visibleSeries.size === 0 && series.length > 0;
    const visibleKeys = allHidden
      ? series.map((s) => s.dataKey)
      : series.filter((s) => visibleSeries.has(s.dataKey)).map((s) => s.dataKey);
    let dataMin = Infinity;
    let dataMax = -Infinity;
    for (const record of data) {
      for (const key of visibleKeys) {
        const v = record[key];
        if (typeof v === 'number') {
          if (v < dataMin) dataMin = v;
          if (v > dataMax) dataMax = v;
        }
      }
    }
    if (!isFinite(dataMin)) dataMin = 0;
    if (!isFinite(dataMax)) dataMax = 0;

    if (yAxis?.domain) {
      const resolve = (val: number | 'auto' | 'dataMin' | 'dataMax'): number | undefined => {
        if (val === 'dataMin') return dataMin;
        if (val === 'dataMax') return dataMax;
        if (val === 'auto') return undefined;
        return val;
      };
      const lo = resolve(yAxis.domain[0]);
      const hi = resolve(yAxis.domain[1]);
      if (lo !== undefined && hi !== undefined) return [lo, hi] as [number, number];
    }

    // Always compute domain explicitly from data to avoid timing issues
    // with visx's useEffect-based data registration in BarGroup/series
    if (dataMax > dataMin) {
      return [Math.min(0, dataMin), dataMax] as [number, number];
    }

    return undefined;
  }, [yAxis?.domain, data, series, visibleSeries, variant]);

  // Measure the widest y-axis tick label so the axis label can be positioned
  // far enough left to avoid overlap. visx's default labelOffset (14px) is too
  // small when tickFormatter produces wide labels like "$50k".
  const yAxisLabelOffset = useMemo(() => {
    const DEFAULT_LABEL_OFFSET = 14;
    if (!yAxis?.label) return DEFAULT_LABEL_OFFSET;

    const domain = yDomain ?? [0, 100];
    const numSamples = yAxis?.tickCount ?? 5;
    const step = numSamples > 1 ? (domain[1] - domain[0]) / (numSamples - 1) : 0;
    const samples = Array.from({ length: numSamples }, (_, i) => domain[0] + i * step);
    const formatter = typeof yAxis?.tickFormatter === 'function' ? yAxis.tickFormatter : defaultYTickFormat;
    const labels = samples.map((v) => String(formatter(v)));

    let maxWidth = 0;
    try {
      if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = `${axisDefaults.fontSize || '11px'} sans-serif`;
          maxWidth = Math.max(...labels.map((t) => ctx.measureText(t).width));
        }
      }
    } catch {
      // ignore
    }
    if (maxWidth === 0) {
      maxWidth = Math.max(...labels.map((t) => t.length)) * 7;
    }

    // tick-to-label gap in visx is ~4px; add 8px breathing room before the axis label
    return Math.ceil(maxWidth) + 4 + 8;
  }, [yAxis?.label, yAxis?.tickFormatter, yAxis?.tickCount, yDomain, axisDefaults.fontSize]);

  // Auto-expand the left margin when a y-axis label is present and no explicit
  // chartMargin.left override is provided.
  const margin = useMemo(() => {
    const base = { ...DEFAULT_CHART_MARGIN, ...chartMargin };
    if (!yAxis?.label || chartMargin?.left !== undefined) return base;
    const TICK_LENGTH = 8;
    const LABEL_HEIGHT = 14; // approximate height of the rotated axis label text
    const required = TICK_LENGTH + yAxisLabelOffset + LABEL_HEIGHT;
    return { ...base, left: Math.max(base.left, required) };
  }, [chartMargin, yAxis?.label, yAxisLabelOffset]);

  // Group stacked bar series
  const { stackedGroups, unstackedSeries } = useMemo(() => {
    if (variant !== 'bar') return { stackedGroups: new Map<string, ChartSeries[]>(), unstackedSeries: series };
    const groups = new Map<string, ChartSeries[]>();
    const unstacked: ChartSeries[] = [];
    for (const s of series) {
      if (!visibleSeries.has(s.dataKey)) continue;
      if (s.stackId) {
        const group = groups.get(s.stackId) || [];
        group.push(s);
        groups.set(s.stackId, group);
      } else {
        unstacked.push(s);
      }
    }
    return { stackedGroups: groups, unstackedSeries: unstacked };
  }, [variant, series, visibleSeries]);

  // All cartesian variants use clip-path reveal for entry
  const variantKey = variant === 'bar' ? 'bar' : 'line';
  const duration = chart.animation.cartesian.revealDuration[variantKey];
  const hiddenClip = chart.animation.cartesian.clipHidden[variantKey];

  // After reveal transition completes, remove clip-path entirely so tooltips aren't clipped
  const revealStyle: React.CSSProperties | undefined =
    animate && !revealDone
      ? {
          clipPath: revealed ? chart.animation.cartesian.clipVisible : hiddenClip,
          transition: `clip-path ${duration} ease-out`,
        }
      : undefined;

  // Keep track of the latest nearest datum for click handling
  const nearestDatumRef = useRef<{ datum: ChartDataRecord; index: number } | null>(null);

  const handleChartClick = useCallback(
    (event: React.MouseEvent<SVGElement>) => {
      if (!onDataPointClick || !nearestDatumRef.current) return;
      void event;
      onDataPointClick(nearestDatumRef.current.datum, nearestDatumRef.current.index);
    },
    [onDataPointClick]
  );

  const handlePointerOut = useCallback(() => {
    nearestDatumRef.current = null;
    if (onDataPointHover) {
      onDataPointHover(null, -1);
    }
  }, [onDataPointHover]);

  const renderVisibleSeries = () => {
    const elements: React.ReactNode[] = [];
    const allHidden = visibleSeries.size === 0 && series.length > 0;

    // When all series are hidden, render the first series invisibly so visx's
    // DataContext registers data and initializes scale domains — axes need this
    // to render even when no data lines/bars are shown.
    if (allHidden) {
      const s = series[0];
      if (variant === 'line') {
        return [
          <LineSeries
            key={`ghost-${s.dataKey}`}
            dataKey={s.dataKey}
            data={data}
            xAccessor={xAccessor}
            yAccessor={(d: ChartDataRecord) => (d[s.dataKey] as number) ?? null}
            stroke="transparent"
            strokeWidth={0}
            curve={CURVE_MAP[s.curveType || 'monotone']}
          />,
        ];
      }
      if (variant === 'area') {
        return [
          <AreaSeries
            key={`ghost-${s.dataKey}`}
            dataKey={s.dataKey}
            data={data}
            xAccessor={xAccessor}
            yAccessor={(d: ChartDataRecord) => (d[s.dataKey] as number) ?? null}
            fill="transparent"
            fillOpacity={0}
            renderLine={false}
            curve={CURVE_MAP[s.curveType || 'monotone']}
            lineProps={{ stroke: 'transparent', strokeWidth: 0 }}
          />,
        ];
      }
      if (variant === 'bar') {
        return [
          <BarSeries
            key={`ghost-${s.dataKey}`}
            dataKey={s.dataKey}
            data={data}
            xAccessor={xAccessor}
            yAccessor={(d: ChartDataRecord) => (d[s.dataKey] as number) ?? 0}
            colorAccessor={() => 'transparent'}
          />,
        ];
      }
    }

    if (variant === 'line') {
      series.forEach((s, index) => {
        if (!visibleSeries.has(s.dataKey)) return;
        const color = s.color || colors[index % colors.length];
        const curve = CURVE_MAP[s.curveType || 'monotone'];
        if (s.fillOpacity !== undefined) {
          elements.push(
            <AreaSeries
              key={s.dataKey}
              dataKey={s.dataKey}
              data={data}
              xAccessor={xAccessor}
              yAccessor={(d: ChartDataRecord) => (d[s.dataKey] as number) ?? null}
              fill={color}
              fillOpacity={s.fillOpacity}
              renderLine
              curve={curve}
              lineProps={{ stroke: color, strokeWidth: 2, strokeLinecap: 'round' }}
            />
          );
        } else {
          elements.push(
            <LineSeries
              key={s.dataKey}
              dataKey={s.dataKey}
              data={data}
              xAccessor={xAccessor}
              yAccessor={(d: ChartDataRecord) => (d[s.dataKey] as number) ?? null}
              stroke={color}
              strokeWidth={2}
              curve={curve}
            />
          );
        }
      });
    } else if (variant === 'bar') {
      // Render stacked groups
      stackedGroups.forEach((groupSeries, stackId) => {
        elements.push(
          <BarStack key={`stack-${stackId}`}>
            {groupSeries.map((s) => {
              const globalIndex = series.indexOf(s);
              const color = s.color || colors[globalIndex % colors.length];
              return (
                <BarSeries
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  data={data}
                  xAccessor={xAccessor}
                  yAccessor={(d: ChartDataRecord) => (d[s.dataKey] as number) ?? 0}
                  colorAccessor={() => color}
                />
              );
            })}
          </BarStack>
        );
      });
      // Render unstacked bars as grouped
      if (unstackedSeries.length > 0) {
        elements.push(
          <BarGroup key="bar-group">
            {unstackedSeries.map((s) => {
              const globalIndex = series.indexOf(s);
              const color = s.color || colors[globalIndex % colors.length];
              return (
                <BarSeries
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  data={data}
                  xAccessor={xAccessor}
                  yAccessor={(d: ChartDataRecord) => (d[s.dataKey] as number) ?? 0}
                  colorAccessor={() => color}
                />
              );
            })}
          </BarGroup>
        );
      }
    } else {
      // area
      series.forEach((s, index) => {
        if (!visibleSeries.has(s.dataKey)) return;
        const color = s.color || colors[index % colors.length];
        const curve = CURVE_MAP[s.curveType || 'monotone'];
        elements.push(
          <AreaSeries
            key={s.dataKey}
            dataKey={s.dataKey}
            data={data}
            xAccessor={xAccessor}
            yAccessor={(d: ChartDataRecord) => (d[s.dataKey] as number) ?? null}
            fill={`url(#gradient-${safeChartId}-${s.dataKey})`}
            fillOpacity={s.fillOpacity ?? 1}
            curve={curve}
            renderLine
            lineProps={{ stroke: color, strokeWidth: 2, strokeLinecap: 'round' }}
          />
        );
      });
    }

    return elements;
  };

  const hoverCss = (() => {
    const sel = `[data-chart-id="${safeChartId}"]`;
    const cursor = onDataPointClick ? ';cursor:pointer' : '';
    if (variant === 'bar') {
      const bh = hoverTheme.bar;
      return (
        `${sel} rect:not([fill="transparent"]){stroke:${bh.stroke};stroke-width:0;transition:${bh.transition};cursor:pointer}` +
        `${sel} rect:not([fill="transparent"]):hover{stroke-width:${bh.strokeWidth}}` +
        `@media(prefers-reduced-motion:reduce){${sel} rect{transition:none!important}}`
      );
    }
    if (variant === 'line') {
      return (
        `${sel} path[stroke]:not([fill]):not([stroke-dasharray]){transition:${hoverTheme.line.transition}${cursor}}` +
        `${sel} path[stroke]:not([fill]):not([stroke-dasharray]):hover{filter:${hoverTheme.line.brightness};stroke-width:${hoverTheme.line.strokeWidth}}` +
        `@media(prefers-reduced-motion:reduce){${sel} path{transition:none!important}}`
      );
    }
    if (variant === 'area') {
      return (
        `${sel} path[fill^="url"]{transition:${hoverTheme.area.transition}${cursor}}` +
        `${sel} path[fill^="url"]:hover{filter:${hoverTheme.area.brightness}}` +
        `@media(prefers-reduced-motion:reduce){${sel} path{transition:none!important}}`
      );
    }
    return undefined;
  })();

  return (
    <div
      data-chart-id={safeChartId}
      style={revealStyle}
      onTransitionEnd={(e) => {
        if (e.propertyName === 'clip-path') setRevealDone(true);
      }}
    >
      {hoverCss && <style>{hoverCss}</style>}
      <XYChart
        width={width}
        height={height}
        margin={margin}
        xScale={{ type: 'band', paddingInner: 0.2, paddingOuter: 0.1, domain: xDomain }}
        yScale={{ type: 'linear', domain: yDomain, nice: true }}
        onPointerOut={handlePointerOut}
        captureEvents={!!onDataPointClick || !!onDataPointHover || !!tooltipConfig?.enabled}
      >
        {variant === 'area' && (
          <defs>
            {series.map((s, index) => {
              const color = s.color || colors[index % colors.length];
              return (
                <LinearGradient
                  key={`gradient-${safeChartId}-${s.dataKey}`}
                  id={`gradient-${safeChartId}-${s.dataKey}`}
                  from={color}
                  fromOpacity={0.3}
                  to={color}
                  toOpacity={0.05}
                />
              );
            })}
          </defs>
        )}

        {showGrid && (
          <Grid
            rows={grid?.horizontal !== false}
            columns={grid?.vertical || false}
            stroke={gridDefaults.stroke}
            strokeDasharray={grid?.strokeDasharray || gridDefaults.strokeDasharray}
          />
        )}

        {xAxis?.show !== false && (
          <Axis
            orientation="bottom"
            tickFormat={
              typeof xAxis?.tickFormatter === 'function'
                ? (v: unknown) => {
                    try {
                      return xAxis.tickFormatter!(v as string | number);
                    } catch {
                      return String(v);
                    }
                  }
                : undefined
            }
            numTicks={xAxis?.tickCount}
            stroke={axisLineStyle.stroke}
            tickStroke={axisLineStyle.stroke}
            tickLabelProps={{
              fontSize: axisDefaults.fontSize,
              fill: axisDefaults.fill,
            }}
            tickComponent={XAxisTick as Parameters<typeof Axis>[0]['tickComponent']}
            label={xAxis?.label}
            labelProps={axisLabelStyle as Record<string, unknown>}
          />
        )}

        {yAxis?.show !== false && (
          <Axis
            orientation="left"
            tickFormat={
              typeof yAxis?.tickFormatter === 'function'
                ? (v: unknown) => {
                    try {
                      return yAxis.tickFormatter!(v as string | number);
                    } catch {
                      return defaultYTickFormat(v);
                    }
                  }
                : defaultYTickFormat
            }
            numTicks={yAxis?.tickCount}
            stroke={axisLineStyle.stroke}
            tickStroke={axisLineStyle.stroke}
            tickLabelProps={{
              fontSize: axisDefaults.fontSize,
              fill: axisDefaults.fill,
            }}
            tickComponent={YAxisTick as Parameters<typeof Axis>[0]['tickComponent']}
            label={yAxis?.label}
            labelOffset={yAxisLabelOffset}
            labelProps={{ ...(axisLabelStyle as Record<string, unknown>) }}
          />
        )}

        {renderVisibleSeries()}

        {/* Click handler overlay */}
        {onDataPointClick && (
          <rect
            width={width}
            height={height}
            fill="transparent"
            style={{ cursor: 'pointer' }}
            onClick={handleChartClick as unknown as React.MouseEventHandler<SVGRectElement>}
          />
        )}

        {tooltipConfig?.enabled && (
          <Tooltip
            snapTooltipToDatumX
            snapTooltipToDatumY
            showVerticalCrosshair={variant === 'line' || variant === 'area'}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              padding: 0,
              background: 'none',
              boxShadow: 'none',
              border: 'none',
              borderRadius: 0,
            }}
            renderTooltip={({ tooltipData }) => {
              if (!tooltipData?.nearestDatum) return null;

              const nd = tooltipData.nearestDatum;
              const datum = nd.datum as ChartDataRecord;
              const datumIndex = nd.index ?? data.indexOf(datum);

              // Update ref for click handling
              nearestDatumRef.current = { datum, index: datumIndex };

              // Fire hover callback
              if (onDataPointHover) {
                onDataPointHover(datum, datumIndex);
              }

              const label = String(datum[xKey] ?? '');
              // For bar charts show only the hovered series; for line/area show all
              const nearestKey = variant === 'bar' ? (nd.key as string) : null;
              const payload: ChartTooltipPayload[] = series
                .filter((s) => visibleSeries.has(s.dataKey))
                .filter((s) => !nearestKey || s.dataKey === nearestKey)
                .map((s, idx) => ({
                  name: s.label || s.dataKey,
                  value: (datum[s.dataKey] as number) ?? 0,
                  color: s.color || colors[idx % colors.length],
                  dataKey: s.dataKey,
                }));

              return (
                <ChartTooltipContent
                  active={true}
                  payload={payload}
                  label={label}
                  theme={theme}
                  config={tooltipConfig}
                />
              );
            }}
          />
        )}
      </XYChart>
    </div>
  );
};
