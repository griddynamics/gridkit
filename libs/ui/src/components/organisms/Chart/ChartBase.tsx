'use client';
import { forwardRef, useState, useMemo, useRef, useLayoutEffect, useEffect, useCallback, useId } from 'react';

import { CSSObject } from '@emotion/react';

import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';
import { resolveThemeColor } from '@tokens/utils';
import { get } from '@utils';
import { Typography } from '@components';
import { TypographyVariant } from '@types';

import { useChartTheme } from './useChartTheme';

import { COMPONENT_NAME, DEFAULT_CHART_HEIGHT } from './constants';
import { ChartContainerStyled, ChartEmptyStateStyled, ChartErrorStateStyled } from './ChartStyled';
import { ChartLegend } from './ChartLegend';
import type { ChartBaseProps } from './Chart.types';

export const ChartBase = forwardRef<HTMLDivElement, ChartBaseProps>((props, forwardedRef) => {
  const {
    variant,
    data,
    xKey,
    series = [],
    pieConfig,
    xAxis,
    yAxis,
    grid,
    legend = {},
    tooltip: tooltipConfig,
    title,
    description,
    chartHeight = DEFAULT_CHART_HEIGHT,
    animate = true,
    loading = false,
    loadingState,
    emptyState,
    error = false,
    errorState,
    colors: colorsProp,
    chartMargin,
    onDataPointClick,
    onDataPointHover,
    renderChart,
    loadingText,
    emptyText,
    errorText,
    styles,
    ...rest
  } = props;

  const { theme } = useTheme();
  const logger = useLogger();
  const chartId = useId();

  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const isCartesian = variant === 'line' || variant === 'bar' || variant === 'area';
  const isPie = variant === 'pie' || variant === 'donut';

  const configurationError = useMemo(() => {
    if (isCartesian && !xKey) {
      return `xKey prop is required for ${variant} charts`;
    }
    if (isPie && !pieConfig) {
      return `pieConfig prop is required for ${variant} charts`;
    }
    return null;
  }, [isCartesian, isPie, xKey, pieConfig, variant]);

  const seriesLength = series?.length ?? 0;
  const hasPieConfig = !!pieConfig;

  useEffect(() => {
    if (configurationError) {
      logger.warn(`[${COMPONENT_NAME}] ${configurationError}`, {
        component: COMPONENT_NAME,
        variant,
        providedProps: {
          xKey: !!xKey,
          series: seriesLength,
          pieConfig: hasPieConfig,
        },
      });
    }
    if (isCartesian && seriesLength === 0) {
      logger.warn(`[${COMPONENT_NAME}] series is recommended for ${variant} charts`, {
        component: COMPONENT_NAME,
        variant,
      });
    }
    // Validate data contains proper objects
    if (data && data.length > 0) {
      const invalidEntries = data.filter((item) => item == null || typeof item !== 'object' || Array.isArray(item));
      if (invalidEntries.length > 0) {
        logger.warn(`[${COMPONENT_NAME}] data contains ${invalidEntries.length} non-object entries`, {
          component: COMPONENT_NAME,
          variant,
          invalidCount: invalidEntries.length,
          totalCount: data.length,
        });
      }
    }
    // Validate series dataKeys exist in data sample
    if (isCartesian && seriesLength > 0 && data && data.length > 0) {
      const sampleKeys = new Set(Object.keys(data[0]));
      const missingKeys = series.filter((s) => !sampleKeys.has(s.dataKey)).map((s) => s.dataKey);
      if (missingKeys.length > 0) {
        logger.warn(`[${COMPONENT_NAME}] series dataKey(s) [${missingKeys.join(', ')}] not found in data`, {
          component: COMPONENT_NAME,
          variant,
          missingKeys,
          availableKeys: [...sampleKeys],
        });
      }
    }
  }, [configurationError, isCartesian, variant, seriesLength, hasPieConfig, logger, data, series]);

  const { themeChart } = useChartTheme(theme);

  const paletteColors = useMemo(() => {
    const defaultPalette = get<string[]>(theme, 'chart.colors.palette', []);
    const baseColors = colorsProp || defaultPalette;
    return baseColors.map((color, index) => {
      const resolved = resolveThemeColor(theme?.colors, color) ?? color;
      // If the color looks like a dotted token path and came back unchanged,
      // the token wasn't found — fall back to the corresponding default palette slot
      // instead of passing an unrecognised value to SVG (which renders as black).
      const isUnresolved = resolved === color && typeof resolved === 'string' && resolved.includes('.');
      return isUnresolved ? (defaultPalette[index % defaultPalette.length] ?? color) : resolved;
    });
  }, [colorsProp, theme, theme?.colors]);

  const resolvedSeries = useMemo(
    () =>
      series.map((chartSeries) => {
        const resolved = resolveThemeColor(theme?.colors, chartSeries.color);
        // If the color string came back unchanged AND looks like a dotted token path
        // (e.g. "chart.primary", "text.success"), the token wasn't found in the theme.
        // Return undefined so ChartCartesian falls back to the paletteColors array
        // instead of passing an unrecognised value to SVG (which renders as black).
        const isUnresolvedToken =
          resolved === chartSeries.color && typeof resolved === 'string' && resolved.includes('.');
        return { ...chartSeries, color: isUnresolvedToken ? undefined : resolved };
      }),
    [series, theme?.colors]
  );

  const srOnlyStyles = useMemo(() => ({ ...get<CSSObject>(themeChart, 'srOnly', {}) }), [themeChart]);

  const visibleSeriesSet = useMemo(
    () => new Set(resolvedSeries.filter((s) => !hiddenSeries.has(s.dataKey) && !s.hidden).map((s) => s.dataKey)),
    [resolvedSeries, hiddenSeries]
  );

  const handleLegendToggle = useCallback((dataKey: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(dataKey)) {
        next.delete(dataKey);
      } else {
        next.add(dataKey);
      }
      return next;
    });
  }, []);

  // Invisible sizer div — size is set purely by layout, never by SVG content.
  // SVG is rendered in a sibling, so it cannot influence sizer's clientWidth.
  const sizerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const measureContainer = useCallback(() => {
    if (sizerRef.current) {
      setContainerWidth(sizerRef.current.clientWidth);
    }
  }, []);

  useLayoutEffect(() => {
    measureContainer();
  }, [measureContainer]);

  useEffect(() => {
    const el = sizerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(measureContainer);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measureContainer]);

  const allSeriesHidden = useMemo(() => {
    if (hiddenSeries.size === 0) return false;
    if (isPie && pieConfig) {
      return data.length > 0 && data.every((record) => hiddenSeries.has(String(record[pieConfig.nameKey] ?? '')));
    }
    return resolvedSeries.length > 0 && resolvedSeries.every((s) => hiddenSeries.has(s.dataKey) || !!s.hidden);
  }, [hiddenSeries, isPie, pieConfig, data, resolvedSeries]);

  const legendItems = useMemo(() => {
    if (isPie && pieConfig) {
      return data.map((record, index) => {
        const dataKey = String(record[pieConfig.nameKey] ?? index);
        return {
          dataKey,
          label: String(record[pieConfig.nameKey] ?? `Item ${index}`),
          color: paletteColors[index % paletteColors.length],
          hidden: hiddenSeries.has(dataKey),
        };
      });
    }
    return resolvedSeries.map((s, index) => ({
      dataKey: s.dataKey,
      label: s.label || s.dataKey,
      color: s.color || paletteColors[index % paletteColors.length],
      hidden: hiddenSeries.has(s.dataKey) || !!s.hidden,
    }));
  }, [resolvedSeries, data, pieConfig, isPie, paletteColors, hiddenSeries]);

  const legendPosition = legend.position ?? 'bottom';
  const showLegend = legendPosition !== 'none' && legendItems.length > 0;

  if (loading) {
    return (
      <ChartContainerStyled
        theme={theme}
        ref={forwardedRef}
        styles={styles}
        data-testid={COMPONENT_NAME}
        role="status"
        aria-label="Loading chart data"
        {...rest}
      >
        {loadingState || (
          <ChartEmptyStateStyled theme={theme}>{loadingText ?? 'Loading chart data...'}</ChartEmptyStateStyled>
        )}
      </ChartContainerStyled>
    );
  }

  if (error) {
    return (
      <ChartContainerStyled
        theme={theme}
        ref={forwardedRef}
        styles={styles}
        data-testid={COMPONENT_NAME}
        role="alert"
        aria-label="Chart error"
        {...rest}
      >
        {errorState || (
          <ChartErrorStateStyled theme={theme}>{errorText ?? 'Failed to load chart data'}</ChartErrorStateStyled>
        )}
      </ChartContainerStyled>
    );
  }

  if (configurationError) {
    return (
      <ChartContainerStyled
        theme={theme}
        ref={forwardedRef}
        styles={styles}
        data-testid={COMPONENT_NAME}
        role="status"
        aria-label="Chart configuration incomplete"
        {...rest}
      >
        <ChartEmptyStateStyled theme={theme}>{errorText ?? 'Unable to render chart'}</ChartEmptyStateStyled>
      </ChartContainerStyled>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainerStyled
        theme={theme}
        ref={forwardedRef}
        styles={styles}
        data-testid={COMPONENT_NAME}
        role="status"
        aria-label="No chart data"
        {...rest}
      >
        {emptyState || <ChartEmptyStateStyled theme={theme}>{emptyText ?? 'No data available'}</ChartEmptyStateStyled>}
      </ChartContainerStyled>
    );
  }

  return (
    <ChartContainerStyled
      theme={theme}
      ref={forwardedRef}
      styles={styles}
      data-testid={COMPONENT_NAME}
      role="img"
      aria-label={title || `${variant} chart`}
      {...rest}
    >
      {title && (
        <Typography variant={TypographyVariant.H3} data-testid={`${COMPONENT_NAME}-title`}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography
          variant={TypographyVariant.Body1}
          as="p"
          css={srOnlyStyles}
          data-testid={`${COMPONENT_NAME}-description`}
        >
          {description}
        </Typography>
      )}
      {showLegend && (legendPosition === 'top' || legendPosition === 'left') && (
        <ChartLegend items={legendItems} theme={theme} interactive={legend.interactive} onToggle={handleLegendToggle} />
      )}
      {/* position:relative wrapper gives the two absolutely-positioned children a stable containing block */}
      <div style={{ position: 'relative', width: '100%', height: chartHeight }}>
        {/* Invisible sizer — layout sets its size; SVG content in the sibling cannot affect it */}
        <div
          ref={sizerRef}
          style={{ position: 'absolute', inset: 0, visibility: 'hidden', pointerEvents: 'none' }}
          aria-hidden="true"
        />
        {/* SVG container — overflow:hidden prevents the SVG from leaking outside the box */}
        {containerWidth > 0 && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {renderChart({
              width: containerWidth,
              height: chartHeight,
              series: resolvedSeries,
              visibleSeries: visibleSeriesSet,
              paletteColors,
              hiddenSeries,
              animate,
              theme,
              chartId,
            })}
            {allSeriesHidden && (
              <ChartEmptyStateStyled
                theme={theme}
                styles={{ position: 'absolute', inset: 0, background: 'transparent' }}
              >
                {emptyText ?? 'No data to display'}
              </ChartEmptyStateStyled>
            )}
          </div>
        )}
      </div>
      {showLegend && (legendPosition === 'bottom' || legendPosition === 'right') && (
        <ChartLegend items={legendItems} theme={theme} interactive={legend.interactive} onToggle={handleLegendToggle} />
      )}
    </ChartContainerStyled>
  );
});

ChartBase.displayName = 'ChartBase';
