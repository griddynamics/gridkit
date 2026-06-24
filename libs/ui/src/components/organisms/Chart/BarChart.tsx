'use client';
import { forwardRef } from 'react';

import { ChartBase } from './ChartBase';
import { ChartCartesian } from './ChartCartesian';
import type { BarChartProps } from './Chart.types';

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>((props, ref) => {
  const { xKey, series, xAxis, yAxis, grid, tooltip, chartMargin, onDataPointClick, onDataPointHover, ...rest } = props;

  return (
    <ChartBase
      {...rest}
      xKey={xKey}
      series={series}
      xAxis={xAxis}
      yAxis={yAxis}
      grid={grid}
      tooltip={tooltip}
      chartMargin={chartMargin}
      onDataPointClick={onDataPointClick}
      onDataPointHover={onDataPointHover}
      variant="bar"
      ref={ref}
      renderChart={(rp) => (
        <ChartCartesian
          variant="bar"
          data={props.data}
          xKey={xKey}
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
      )}
    />
  );
});

BarChart.displayName = 'BarChart';
