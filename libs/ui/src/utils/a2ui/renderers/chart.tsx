import type { ReactNode } from 'react';
import { Chart } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getComponentStyles } from '../helpers';

const CHART_VALID_VARIANTS = new Set(['line', 'bar', 'area', 'pie', 'donut']);
const CHART_CARTESIAN_VARIANTS = new Set(['line', 'bar', 'area']);
const CHART_PIE_VARIANTS = new Set(['pie', 'donut']);
const CHART_VALID_CURVE_TYPES = new Set(['monotone', 'linear', 'step', 'natural']);
const CHART_VALID_LEGEND_POSITIONS = new Set(['top', 'bottom', 'left', 'right', 'none']);

function sanitizeAxisConfig(raw: unknown, axisName: string, logPrefix: string) {
  if (raw == null) return undefined;
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    console.debug(`${logPrefix} ${axisName} is not an object, removing`);
    return undefined;
  }
  const axis = { ...(raw as Record<string, unknown>) };

  if (axis['tickFormatter'] != null && typeof axis['tickFormatter'] !== 'function') {
    console.debug(`${logPrefix} ${axisName}.tickFormatter is ${typeof axis['tickFormatter']}, not function — removing`);
    delete axis['tickFormatter'];
  }
  if (axis['tickCount'] != null && typeof axis['tickCount'] !== 'number') {
    console.debug(`${logPrefix} ${axisName}.tickCount not a number, removing`);
    delete axis['tickCount'];
  }
  if (axis['show'] != null && typeof axis['show'] !== 'boolean') {
    console.debug(`${logPrefix} ${axisName}.show not a boolean, removing`);
    delete axis['show'];
  }
  if (axis['label'] != null && typeof axis['label'] !== 'string') {
    console.debug(`${logPrefix} ${axisName}.label not a string, removing`);
    delete axis['label'];
  }
  if (axis['domain'] != null) {
    if (!Array.isArray(axis['domain']) || (axis['domain'] as unknown[]).length !== 2) {
      console.debug(`${logPrefix} ${axisName}.domain not a valid [min, max] array, removing`);
      delete axis['domain'];
    }
  }
  return axis;
}

const sanitizedChartAttributesCache = new WeakMap<A2UIComponent, ReturnType<typeof computeChartAttributes>>();

function sanitizeChartAttributes(component: A2UIComponent) {
  const cached = sanitizedChartAttributesCache.get(component);
  if (cached) {
    return cached;
  }

  const result = computeChartAttributes(component);
  sanitizedChartAttributesCache.set(component, result);

  return result;
}

function computeChartAttributes(component: A2UIComponent) {
  // Merge root-level props as fallback — LLMs often place data/xKey/series/xAxis/yAxis at root
  // rather than inside attributes. Root-level is the base; attributes takes precedence.
  const attrs = { ...(component as unknown as Record<string, unknown>), ...(component.attributes ?? {}) };
  const logPrefix = `[Chart:${component.id}]`;

  // --- variant ---
  // Check attrs first (LLMs often place variant inside attributes, mirroring data/xKey/series)
  let variant = (attrs['variant'] as string | undefined) ?? component.variant;
  if (!variant || !CHART_VALID_VARIANTS.has(variant)) {
    console.warn(`${logPrefix} invalid variant "${variant}", falling back to "bar"`);
    variant = 'bar';
  }

  const isCartesian = CHART_CARTESIAN_VARIANTS.has(variant);
  const isPie = CHART_PIE_VARIANTS.has(variant);

  // --- data ---
  let data: Record<string, unknown>[] = [];
  if (Array.isArray(attrs['data'])) {
    data = (attrs['data'] as unknown[]).filter(
      (item): item is Record<string, unknown> => item != null && typeof item === 'object' && !Array.isArray(item)
    );
    const dropped = (attrs['data'] as unknown[]).length - data.length;
    if (dropped > 0) {
      console.warn(`${logPrefix} filtered ${dropped} invalid data entries`);
    }
  } else if (attrs['data'] != null) {
    console.warn(`${logPrefix} data is not an array, using empty array`);
  }

  const sampleRecord = data[0] ?? {};
  const dataKeys = Object.keys(sampleRecord);
  const stringKeys = dataKeys.filter((k) => typeof sampleRecord[k] === 'string');
  const numericKeys = dataKeys.filter((k) => typeof sampleRecord[k] === 'number');

  // --- xKey (cartesian) ---
  let xKey: string | undefined;
  if (isCartesian) {
    const rawXKey = attrs['xKey'];
    if (typeof rawXKey === 'string' && dataKeys.includes(rawXKey)) {
      xKey = rawXKey;
    } else if (typeof rawXKey === 'string' && data.length > 0) {
      console.warn(`${logPrefix} xKey "${rawXKey}" not found in data keys [${dataKeys.join(', ')}], auto-detecting`);
      xKey = stringKeys[0] || dataKeys[0];
      if (xKey) console.debug(`${logPrefix} auto-detected xKey: "${xKey}"`);
    } else {
      xKey = stringKeys[0] || dataKeys[0];
      if (xKey) console.debug(`${logPrefix} auto-detected xKey: "${xKey}"`);
    }
  }

  // --- series (cartesian) ---
  let series: Record<string, unknown>[] | undefined;
  if (isCartesian) {
    if (Array.isArray(attrs['series'])) {
      series = (attrs['series'] as Record<string, unknown>[])
        .filter((s) => s != null && typeof s === 'object' && !Array.isArray(s))
        .filter((s) => {
          if (typeof s['dataKey'] !== 'string') {
            console.warn(`${logPrefix} series entry missing string dataKey, skipping`);
            return false;
          }
          return true;
        })
        .filter((s) => {
          const dk = s['dataKey'] as string;
          if (data.length > 0 && !dataKeys.includes(dk)) {
            console.warn(
              `${logPrefix} series dataKey "${dk}" not found in data keys [${dataKeys.join(', ')}], skipping`
            );
            return false;
          }
          return true;
        })
        .map((s) => {
          const cleaned = { ...s };
          if (cleaned['curveType'] != null && !CHART_VALID_CURVE_TYPES.has(cleaned['curveType'] as string)) {
            console.debug(`${logPrefix} invalid curveType "${String(cleaned['curveType'])}", removing`);
            delete cleaned['curveType'];
          }
          if (cleaned['fillOpacity'] != null && typeof cleaned['fillOpacity'] !== 'number') {
            delete cleaned['fillOpacity'];
          }
          if (cleaned['stackId'] != null && typeof cleaned['stackId'] !== 'string') {
            delete cleaned['stackId'];
          }
          if (cleaned['color'] != null && typeof cleaned['color'] !== 'string') {
            delete cleaned['color'];
          }
          return cleaned;
        });

      if (series.length === 0 && (attrs['series'] as unknown[]).length > 0) {
        console.warn(`${logPrefix} all series entries were invalid, auto-building from data`);
        series = undefined;
      }
    }

    if (!series && data.length > 0) {
      const autoKeys = numericKeys.filter((k) => k !== xKey);
      if (autoKeys.length > 0) {
        series = autoKeys.map((k) => ({ dataKey: k, label: k }));
        console.debug(`${logPrefix} auto-built series from numeric keys: [${autoKeys.join(', ')}]`);
      }
    }
  }

  // --- pieConfig (pie/donut) ---
  let pieConfig: Record<string, unknown> | undefined;
  if (isPie) {
    const rawConfig = attrs['pieConfig'];
    if (rawConfig != null && typeof rawConfig === 'object' && !Array.isArray(rawConfig)) {
      pieConfig = { ...(rawConfig as Record<string, unknown>) };
    } else if (rawConfig != null) {
      console.warn(`${logPrefix} pieConfig is not an object, auto-detecting`);
    }

    if (pieConfig) {
      // Normalize valueKey → dataKey (LLMs often use the more natural name)
      if (pieConfig['dataKey'] == null && pieConfig['valueKey'] != null) {
        pieConfig['dataKey'] = pieConfig['valueKey'];
        delete pieConfig['valueKey'];
      }
      if (
        typeof pieConfig['nameKey'] !== 'string' ||
        (data.length > 0 && !dataKeys.includes(pieConfig['nameKey'] as string))
      ) {
        const autoKey = stringKeys[0] || dataKeys[0];
        if (autoKey) {
          console.warn(
            `${logPrefix} pieConfig.nameKey "${String(pieConfig['nameKey'])}" invalid, auto-detected: "${autoKey}"`
          );
          pieConfig['nameKey'] = autoKey;
        }
      }
      if (
        typeof pieConfig['dataKey'] !== 'string' ||
        (data.length > 0 && !dataKeys.includes(pieConfig['dataKey'] as string))
      ) {
        const autoKey = numericKeys[0];
        if (autoKey) {
          console.warn(
            `${logPrefix} pieConfig.dataKey "${String(pieConfig['dataKey'])}" invalid, auto-detected: "${autoKey}"`
          );
          pieConfig['dataKey'] = autoKey;
        }
      }
      if (pieConfig['labelFormatter'] != null && typeof pieConfig['labelFormatter'] !== 'function') {
        console.debug(`${logPrefix} pieConfig.labelFormatter is not a function — removing`);
        delete pieConfig['labelFormatter'];
      }
      if (pieConfig['showLabels'] != null && typeof pieConfig['showLabels'] !== 'boolean') {
        pieConfig['showLabels'] = Boolean(pieConfig['showLabels']);
      }
      for (const numField of ['paddingAngle', 'startAngle', 'endAngle']) {
        if (pieConfig[numField] != null && typeof pieConfig[numField] !== 'number') {
          console.debug(`${logPrefix} pieConfig.${numField} not a number, removing`);
          delete pieConfig[numField];
        }
      }
      for (const radiusField of ['innerRadius', 'outerRadius']) {
        const val = pieConfig[radiusField];
        if (val != null && typeof val !== 'number' && typeof val !== 'string') {
          console.debug(`${logPrefix} pieConfig.${radiusField} invalid type, removing`);
          delete pieConfig[radiusField];
        }
      }
    } else if (data.length > 0) {
      const autoNameKey = stringKeys[0] || dataKeys[0];
      const autoDataKey = numericKeys[0];
      if (autoNameKey && autoDataKey) {
        pieConfig = { nameKey: autoNameKey, dataKey: autoDataKey };
        console.debug(`${logPrefix} auto-built pieConfig: nameKey="${autoNameKey}", dataKey="${autoDataKey}"`);
      } else {
        console.warn(`${logPrefix} cannot auto-detect pieConfig from data`);
      }
    }
  }

  // --- xAxis / yAxis ---
  const xAxis = sanitizeAxisConfig(attrs['xAxis'], 'xAxis', logPrefix);
  const yAxis = sanitizeAxisConfig(attrs['yAxis'], 'yAxis', logPrefix);

  // --- tooltip ---
  let tooltip: Record<string, unknown> | undefined;
  if (attrs['tooltip'] != null) {
    if (typeof attrs['tooltip'] === 'object' && !Array.isArray(attrs['tooltip'])) {
      tooltip = { ...(attrs['tooltip'] as Record<string, unknown>) };
      if (tooltip['valueFormatter'] != null && typeof tooltip['valueFormatter'] !== 'function') {
        console.debug(`${logPrefix} tooltip.valueFormatter is not a function — removing`);
        delete tooltip['valueFormatter'];
      }
      if (tooltip['labelFormatter'] != null && typeof tooltip['labelFormatter'] !== 'function') {
        console.debug(`${logPrefix} tooltip.labelFormatter is not a function — removing`);
        delete tooltip['labelFormatter'];
      }
      if (tooltip['enabled'] != null && typeof tooltip['enabled'] !== 'boolean') {
        tooltip['enabled'] = Boolean(tooltip['enabled']);
      }
    } else {
      console.debug(`${logPrefix} tooltip is not an object, removing`);
    }
  }

  // --- legend ---
  let legend: Record<string, unknown> | undefined;
  if (attrs['legend'] != null) {
    if (typeof attrs['legend'] === 'object' && !Array.isArray(attrs['legend'])) {
      legend = { ...(attrs['legend'] as Record<string, unknown>) };
      if (legend['position'] != null && !CHART_VALID_LEGEND_POSITIONS.has(legend['position'] as string)) {
        console.debug(`${logPrefix} legend.position "${String(legend['position'])}" invalid, removing`);
        delete legend['position'];
      }
      if (legend['interactive'] != null && typeof legend['interactive'] !== 'boolean') {
        legend['interactive'] = Boolean(legend['interactive']);
      }
    } else {
      console.debug(`${logPrefix} legend is not an object, removing`);
    }
  }

  // --- grid ---
  let grid: Record<string, unknown> | undefined;
  if (attrs['grid'] != null) {
    if (typeof attrs['grid'] === 'object' && !Array.isArray(attrs['grid'])) {
      grid = { ...(attrs['grid'] as Record<string, unknown>) };
    } else {
      console.debug(`${logPrefix} grid is not an object, removing`);
    }
  }

  // --- colors ---
  let colors: string[] | undefined;
  if (attrs['colors'] != null) {
    if (Array.isArray(attrs['colors'])) {
      colors = (attrs['colors'] as unknown[]).filter((c): c is string => typeof c === 'string');
      if (colors.length === 0) {
        colors = undefined;
      }
    } else {
      console.debug(`${logPrefix} colors is not an array, removing`);
    }
  }

  // --- chartHeight ---
  let chartHeight: number | undefined;
  const rawChartHeight = attrs['chartHeight'];
  if (typeof rawChartHeight === 'number' && rawChartHeight > 0) {
    chartHeight = rawChartHeight;
  } else if (typeof rawChartHeight === 'string') {
    const parsed = Number(rawChartHeight);
    if (Number.isFinite(parsed) && parsed > 0) chartHeight = parsed;
  }

  // --- chartMargin ---
  let chartMargin: Record<string, number> | undefined;
  if (attrs['chartMargin'] != null) {
    if (typeof attrs['chartMargin'] === 'object' && !Array.isArray(attrs['chartMargin'])) {
      chartMargin = {};
      const raw = attrs['chartMargin'] as Record<string, unknown>;
      for (const side of ['top', 'right', 'bottom', 'left'] as const) {
        if (typeof raw[side] === 'number') {
          chartMargin[side] = raw[side] as number;
        }
      }
      if (Object.keys(chartMargin).length === 0) chartMargin = undefined;
    }
  }

  return {
    variant,
    data,
    xKey,
    series,
    pieConfig,
    xAxis,
    yAxis,
    tooltip,
    legend,
    grid,
    colors,
    chartHeight,
    chartMargin,
  };
}

export const chartRenderers = {
  chart: (component: A2UIComponent) => {
    const s = sanitizeChartAttributes(component);
    return (
      <Chart
        key={component.id}
        variant={s.variant as never}
        title={component.title || component.label}
        label={component.label}
        description={component.description}
        data={s.data as never[]}
        xKey={s.xKey}
        series={s.series as never}
        pieConfig={s.pieConfig as never}
        chartHeight={s.chartHeight}
        colors={s.colors}
        legend={s.legend as never}
        xAxis={s.xAxis as never}
        yAxis={s.yAxis as never}
        grid={s.grid as never}
        tooltip={s.tooltip as never}
        chartMargin={s.chartMargin}
        animate={typeof component.animate === 'boolean' ? component.animate : undefined}
        loading={component.loading}
        error={component.error}
        loadingText={component.loadingText}
        emptyText={component.emptyText}
        errorText={component.errorText}
        className={component.className}
        styles={getComponentStyles(component.styling)}
        {...(component.ariaLabel ? { 'aria-label': component.ariaLabel } : {})}
      />
    );
  },
};
