'use client';
import { forwardRef } from 'react';

import { ChartBase } from './ChartBase';
import { ChartPie } from './ChartPie';
import type { PieChartProps } from './Chart.types';

export const PieChart = forwardRef<HTMLDivElement, PieChartProps>((props, ref) => {
  const { pieConfig, donut = false, tooltip, onDataPointClick, ...rest } = props;

  return (
    <ChartBase
      {...rest}
      pieConfig={pieConfig}
      tooltip={tooltip}
      onDataPointClick={onDataPointClick}
      variant={donut ? 'donut' : 'pie'}
      ref={ref}
      renderChart={(rp) => (
        <ChartPie
          data={props.data}
          pieConfig={pieConfig}
          colors={rp.paletteColors}
          tooltipConfig={tooltip}
          animate={rp.animate}
          theme={rp.theme}
          isDonut={donut}
          onDataPointClick={onDataPointClick}
          hiddenSeries={rp.hiddenSeries}
          width={rp.width}
          height={rp.height}
        />
      )}
    />
  );
});

PieChart.displayName = 'PieChart';
