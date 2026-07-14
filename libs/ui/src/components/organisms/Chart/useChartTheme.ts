import { CSSObject } from '@emotion/react';

import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';
import type { DefaultTheme } from '@hooks';

export interface ChartAxisDefaults {
  fontSize: string;
  fill: string;
}

export interface ChartAxisLineStyle {
  stroke: string;
}

export interface ChartGridDefaults {
  stroke: string;
  strokeDasharray: string;
}

interface CartesianTheme {
  axisDefaults: ChartAxisDefaults;
  axisLineStyle: ChartAxisLineStyle;
  axisLabelStyle: CSSObject;
  gridDefaults: ChartGridDefaults;
}

function createChartThemeProxy(theme: DefaultTheme) {
  const { chart, ...rest } = theme || {};
  return new Proxy(
    (chart || {}) as Record<string, unknown>,
    tokensHandler(rest) as ProxyHandler<Record<string, unknown>>
  );
}

/**
 * Shared hook that resolves chart design tokens from the theme.
 * Eliminates duplicated Proxy + tokensHandler boilerplate across chart sub-components.
 */
export function useChartTheme(theme: DefaultTheme) {
  return { themeChart: createChartThemeProxy(theme) };
}

/**
 * Resolves cartesian-specific tokens (axis, grid) from the chart theme proxy.
 * Used by ChartCartesian.
 */
export function useCartesianTheme(theme: DefaultTheme): CartesianTheme {
  const themeChart = createChartThemeProxy(theme);

  return {
    axisDefaults: { ...get<ChartAxisDefaults>(themeChart, 'axis.default', { fontSize: '', fill: '' }) },
    axisLineStyle: { ...get<ChartAxisLineStyle>(themeChart, 'axis.line', { stroke: '' }) },
    axisLabelStyle: { ...get<CSSObject>(themeChart, 'axis.label', {}) },
    gridDefaults: { ...get<ChartGridDefaults>(themeChart, 'grid.default', { stroke: '', strokeDasharray: '' }) },
  };
}

/**
 * Resolves tooltip tokens from the chart theme proxy.
 */
export function useTooltipTheme(theme: DefaultTheme) {
  const themeChart = createChartThemeProxy(theme);

  return {
    containerStyles: { ...get<CSSObject>(themeChart, 'tooltip.container', {}) },
    labelStyles: { ...get<CSSObject>(themeChart, 'tooltip.label', {}) },
    itemStyles: { ...get<CSSObject>(themeChart, 'tooltip.item', {}) },
    dotStyles: { ...get<CSSObject>(themeChart, 'tooltip.dot', {}) },
  };
}

interface ChartHoverBar {
  transition: string;
  stroke: string;
  strokeWidth: string;
}

interface ChartHoverLine {
  transition: string;
  brightness: string;
  strokeWidth: string;
}

interface ChartHoverArea {
  transition: string;
  brightness: string;
}

interface ChartHoverPie {
  transition: string;
  brightness: string;
}

/**
 * Resolves hover tokens from the chart theme proxy.
 */
export function useHoverTheme(theme: DefaultTheme) {
  const themeChart = createChartThemeProxy(theme);

  return {
    bar: { ...get<ChartHoverBar>(themeChart, 'hover.bar', {} as ChartHoverBar) },
    line: { ...get<ChartHoverLine>(themeChart, 'hover.line', {} as ChartHoverLine) },
    area: { ...get<ChartHoverArea>(themeChart, 'hover.area', {} as ChartHoverArea) },
    pie: { ...get<ChartHoverPie>(themeChart, 'hover.pie', {} as ChartHoverPie) },
  };
}

/**
 * Resolves legend tokens from the chart theme proxy.
 */
export function useLegendTheme(theme: DefaultTheme) {
  const themeChart = createChartThemeProxy(theme);

  return {
    containerStyles: { ...get<CSSObject>(themeChart, 'legend.container', {}) },
    itemStyles: { ...get<CSSObject>(themeChart, 'legend.item', { cursor: 'default' }) },
    itemInteractiveStyles: { ...get<CSSObject>(themeChart, 'legend.itemInteractive', { cursor: 'pointer' }) },
    itemHiddenStyles: { ...get<CSSObject>(themeChart, 'legend.itemHidden', {}) },
    labelTextStyles: { ...get<CSSObject>(themeChart, 'legend.labelText', {}) },
    dotStyles: { ...get<CSSObject>(themeChart, 'legend.dot', {}) },
  };
}
