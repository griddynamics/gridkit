import type { ReactNode } from 'react';

import type { BoxCssComponentProps } from '@components';
import type { DefaultTheme } from '@hooks';

export type ChartVariant = 'line' | 'bar' | 'area' | 'pie' | 'donut';

export type ChartCurveType = 'monotone' | 'linear' | 'step' | 'natural';

export type ChartDataRecord = Record<string, number | string | null>;

export interface ChartSeries {
  dataKey: string;
  label?: string;
  color?: string;
  stackId?: string;
  curveType?: ChartCurveType;
  fillOpacity?: number;
  hidden?: boolean;
}

export interface ChartPieConfig {
  nameKey: string;
  dataKey: string;
  innerRadius?: string | number;
  outerRadius?: string | number;
  showLabels?: boolean;
  labelFormatter?: (value: number, name: string) => string;
  paddingAngle?: number;
  startAngle?: number;
  endAngle?: number;
}

export interface ChartAxisConfig {
  show?: boolean;
  label?: string;
  tickFormatter?: (value: string | number) => string;
  tickCount?: number;
  domain?: [ChartAxisDomainValue, ChartAxisDomainValue];
  unit?: string;
}

export type ChartAxisDomainValue = number | 'auto' | 'dataMin' | 'dataMax';

export interface ChartGridConfig {
  horizontal?: boolean;
  vertical?: boolean;
  strokeDasharray?: string;
}

export interface ChartLegendConfig {
  position?: 'top' | 'bottom' | 'left' | 'right' | 'none';
  interactive?: boolean;
}

export interface ChartTooltipConfig {
  enabled?: boolean;
  valueFormatter?: (value: number, name: string) => string;
  labelFormatter?: (label: string) => string;
}

export interface ChartProps extends BoxCssComponentProps {
  variant: ChartVariant;
  data: ChartDataRecord[];
  xKey?: string;
  series?: ChartSeries[];
  pieConfig?: ChartPieConfig;
  xAxis?: ChartAxisConfig;
  yAxis?: ChartAxisConfig;
  grid?: ChartGridConfig;
  legend?: ChartLegendConfig;
  tooltip?: ChartTooltipConfig;
  title?: string;
  label?: string;
  description?: string;
  chartHeight?: number;
  animate?: boolean;
  loading?: boolean;
  loadingState?: ReactNode;
  emptyState?: ReactNode;
  error?: boolean;
  errorState?: ReactNode;
  colors?: string[];
  chartMargin?: { top?: number; right?: number; bottom?: number; left?: number };
  onDataPointClick?: (data: ChartDataRecord, index: number) => void;
  onDataPointHover?: (data: ChartDataRecord | null, index: number) => void;
  loadingText?: string;
  emptyText?: string;
  errorText?: string;
}

export interface ChartBaseRenderProps {
  width: number;
  height: number;
  series: ChartSeries[];
  visibleSeries: Set<string>;
  paletteColors: string[];
  hiddenSeries: Set<string>;
  animate: boolean;
  theme: DefaultTheme;
  chartId: string;
}

export interface ChartBaseProps extends Omit<ChartProps, 'variant'> {
  variant: ChartVariant;
  renderChart: (props: ChartBaseRenderProps) => ReactNode;
}

export type ChartCartesianVariant = 'line' | 'bar' | 'area';

export interface ChartCartesianProps {
  variant: ChartCartesianVariant;
  data: ChartDataRecord[];
  xKey: string;
  series: ChartSeries[];
  visibleSeries: Set<string>;
  colors: string[];
  xAxis?: ChartAxisConfig;
  yAxis?: ChartAxisConfig;
  grid?: ChartGridConfig;
  tooltipConfig?: ChartTooltipConfig;
  animate?: boolean;
  theme: DefaultTheme;
  chartMargin?: { top?: number; right?: number; bottom?: number; left?: number };
  onDataPointClick?: (data: ChartDataRecord, index: number) => void;
  onDataPointHover?: (data: ChartDataRecord | null, index: number) => void;
  width: number;
  height: number;
  chartId: string;
}

export interface ChartTooltipPayload {
  name: string;
  value: number | string;
  color: string;
  dataKey: string;
}

export interface ChartLegendItem {
  dataKey: string;
  label: string;
  color: string;
  hidden: boolean;
}

/** Cartesian variant props: xKey & series required, no pieConfig */
export interface LineChartProps extends Omit<ChartProps, 'variant' | 'pieConfig'> {
  xKey: string;
  series: ChartSeries[];
}

export type BarChartProps = LineChartProps;
export type AreaChartProps = LineChartProps;

/** Pie variant props: pieConfig required, no cartesian props */
export interface PieChartProps extends Omit<ChartProps, 'variant' | 'xKey' | 'series' | 'xAxis' | 'yAxis' | 'grid'> {
  pieConfig: ChartPieConfig;
  donut?: boolean;
}
