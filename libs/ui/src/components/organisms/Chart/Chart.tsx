'use client';
import { forwardRef } from 'react';

import { ChartBase } from './ChartBase';
import { ChartCartesian } from './ChartCartesian';
import { ChartPie } from './ChartPie';
import type { ChartProps } from './Chart.types';

import { COMPONENT_NAME } from './constants';

export const Chart = forwardRef<HTMLDivElement, ChartProps>((props, ref) => {
  const {
    variant,
    xKey,
    series = [],
    pieConfig,
    xAxis,
    yAxis,
    grid,
    tooltip,
    chartMargin,
    onDataPointClick,
    onDataPointHover,
    ...rest
  } = props;
  return (
    <ChartBase
      {...rest}
      variant={variant}
      xKey={xKey}
      series={series}
      pieConfig={pieConfig}
      xAxis={xAxis}
      yAxis={yAxis}
      grid={grid}
      tooltip={tooltip}
      chartMargin={chartMargin}
      onDataPointClick={onDataPointClick}
      onDataPointHover={onDataPointHover}
      ref={ref}
      renderChart={(rp) => {
        if (variant === 'pie' || variant === 'donut') {
          return (
            <ChartPie
              data={props.data}
              pieConfig={pieConfig!}
              colors={rp.paletteColors}
              tooltipConfig={tooltip}
              animate={rp.animate}
              theme={rp.theme}
              isDonut={variant === 'donut'}
              onDataPointClick={onDataPointClick}
              hiddenSeries={rp.hiddenSeries}
              width={rp.width}
              height={rp.height}
            />
          );
        }

        return (
          <ChartCartesian
            variant={variant}
            data={props.data}
            xKey={xKey!}
            series={rp.series}
            visibleSeries={rp.visibleSeries}
            colors={rp.paletteColors}
            xAxis={xAxis}
            yAxis={yAxis}
            grid={grid}
            tooltipConfig={tooltip}
            animate={rp.animate}
            theme={rp.theme}
            chartMargin={chartMargin}
            onDataPointClick={onDataPointClick}
            onDataPointHover={onDataPointHover}
            width={rp.width}
            height={rp.height}
            chartId={rp.chartId}
          />
        );
      }}
    />
  );
});

Chart.displayName = COMPONENT_NAME;
