'use client';
import { forwardRef } from 'react';

import { ChartBase } from './ChartBase';
import { ChartCartesian } from './ChartCartesian';
import type { LineChartProps } from './Chart.types';

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>((props, ref) => {
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
      variant="line"
      ref={ref}
      renderChart={(rp) => (
        <ChartCartesian
          variant="line"
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

LineChart.displayName = 'LineChart';
