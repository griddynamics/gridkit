import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Row, Column, Skeleton } from '@components';
import { defaultTheme } from '@tokens';
import { Chart } from './Chart';

const meta: Meta<typeof Chart> = {
  title: 'Organisms/Chart',
  component: Chart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Data visualization component built on visx — supports line, bar, area, pie, and donut variants with theming, interactive legend, responsive sizing, and accessibility. See the **[Introduction](?path=/docs/introduction-charts--docs)** page for full usage guide, API reference, and FAQ.',
      },
    },
  },
  argTypes: {
    variant: {
      description: 'Chart type variant',
      control: { type: 'select' },
      options: ['line', 'bar', 'area', 'pie', 'donut'],
      table: { category: 'Core', defaultValue: { summary: 'line' }, type: { summary: 'ChartVariant' } },
    },
    data: {
      description: 'Array of data records',
      control: false,
      table: { category: 'Core', type: { summary: 'ChartDataRecord[]' } },
    },
    xKey: {
      description: 'Key for x-axis (required for line, bar, area)',
      control: { type: 'text' },
      table: { category: 'Core', type: { summary: 'string' } },
    },
    series: {
      description: 'Series definitions for cartesian charts',
      control: false,
      table: { category: 'Core', type: { summary: 'ChartSeries[]' } },
    },
    pieConfig: {
      description: 'Config for pie/donut (required for pie, donut)',
      control: false,
      table: { category: 'Core', type: { summary: 'ChartPieConfig' } },
    },
    xAxis: {
      description: 'X-axis config: visibility, label, tick formatting',
      control: false,
      table: { category: 'Axis & Grid', type: { summary: 'ChartAxisConfig' } },
    },
    yAxis: {
      description: 'Y-axis config: visibility, label, tick formatting, domain',
      control: false,
      table: { category: 'Axis & Grid', type: { summary: 'ChartAxisConfig' } },
    },
    grid: {
      description: 'Grid lines config: horizontal/vertical visibility',
      control: false,
      table: { category: 'Axis & Grid', type: { summary: 'ChartGridConfig' } },
    },
    legend: {
      description: 'Legend config: position and interactivity',
      control: false,
      table: { category: 'Legend & Tooltip', type: { summary: 'ChartLegendConfig' } },
    },
    tooltip: {
      description: 'Tooltip config: enable/disable, formatters',
      control: false,
      table: { category: 'Legend & Tooltip', type: { summary: 'ChartTooltipConfig' } },
    },
    chartHeight: {
      description: 'Height in pixels (use this, not CSS height)',
      control: { type: 'number' },
      table: { category: 'Appearance', defaultValue: { summary: '300' }, type: { summary: 'number' } },
    },
    animate: {
      description: 'Enable/disable entry animations',
      control: { type: 'boolean' },
      table: { category: 'Appearance', defaultValue: { summary: 'true' }, type: { summary: 'boolean' } },
    },
    colors: {
      description: 'Custom color palette override',
      control: false,
      table: { category: 'Appearance', type: { summary: 'string[]' } },
    },
    chartMargin: {
      description: 'Internal chart margin',
      control: false,
      table: { category: 'Appearance', type: { summary: '{ top; right; bottom; left }' } },
    },
    loading: {
      description: 'Show loading state',
      control: { type: 'boolean' },
      table: { category: 'States', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    loadingState: {
      description: 'Custom loading ReactNode',
      control: false,
      table: { category: 'States', type: { summary: 'ReactNode' } },
    },
    error: {
      description: 'Show error state',
      control: { type: 'boolean' },
      table: { category: 'States', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    errorState: {
      description: 'Custom error ReactNode',
      control: false,
      table: { category: 'States', type: { summary: 'ReactNode' } },
    },
    emptyState: {
      description: 'Custom empty ReactNode',
      control: false,
      table: { category: 'States', type: { summary: 'ReactNode' } },
    },
    loadingText: {
      description: 'Text shown in the default loading state',
      control: { type: 'text' },
      table: { category: 'States', type: { summary: 'string' } },
    },
    emptyText: {
      description: 'Text shown when data is empty or all series are hidden',
      control: { type: 'text' },
      table: { category: 'States', type: { summary: 'string' } },
    },
    errorText: {
      description: 'Text shown in the default error state',
      control: { type: 'text' },
      table: { category: 'States', type: { summary: 'string' } },
    },
    title: {
      description: 'Accessible chart title (visually hidden)',
      control: { type: 'text' },
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    label: {
      description: 'Accessible aria-label for the chart container',
      control: { type: 'text' },
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    description: {
      description: 'Accessible chart description (visually hidden)',
      control: { type: 'text' },
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    onDataPointClick: {
      description: 'Click callback on data points',
      action: 'onDataPointClick',
      table: { category: 'Events', type: { summary: '(data, index) => void' } },
    },
    onDataPointHover: {
      description: 'Hover callback (line, bar, area only)',
      action: 'onDataPointHover',
      table: { category: 'Events', type: { summary: '(data | null, index) => void' } },
    },
    styles: {
      description: 'Custom CSS-in-JS styles for outer container',
      control: false,
      table: { category: 'Box Styles', type: { summary: 'CSSObject' } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Chart>;

// ─── Sample Data ───────────────────────────────────────────────────────────────

const revenueData = [
  { month: 'Jan', revenue: 18200, profit: 7400, costs: 10800 },
  { month: 'Feb', revenue: 21500, profit: 9200, costs: 12300 },
  { month: 'Mar', revenue: 19800, profit: 8100, costs: 11700 },
  { month: 'Apr', revenue: 24300, profit: 11500, costs: 12800 },
  { month: 'May', revenue: 28900, profit: 14700, costs: 14200 },
  { month: 'Jun', revenue: 26100, profit: 12800, costs: 13300 },
  { month: 'Jul', revenue: 31200, profit: 16900, costs: 14300 },
  { month: 'Aug', revenue: 29400, profit: 15200, costs: 14200 },
  { month: 'Sep', revenue: 33100, profit: 18400, costs: 14700 },
  { month: 'Oct', revenue: 35800, profit: 20100, costs: 15700 },
  { month: 'Nov', revenue: 38200, profit: 21800, costs: 16400 },
  { month: 'Dec', revenue: 42500, profit: 25300, costs: 17200 },
];

const webTrafficData = [
  { week: 'W1', direct: 1200, organic: 3400, social: 890, referral: 540 },
  { week: 'W2', direct: 1350, organic: 3200, social: 1100, referral: 620 },
  { week: 'W3', direct: 1100, organic: 3800, social: 950, referral: 580 },
  { week: 'W4', direct: 1500, organic: 4100, social: 1300, referral: 710 },
  { week: 'W5', direct: 1400, organic: 3900, social: 1450, referral: 680 },
  { week: 'W6', direct: 1600, organic: 4500, social: 1200, referral: 750 },
  { week: 'W7', direct: 1750, organic: 4800, social: 1600, referral: 820 },
  { week: 'W8', direct: 1900, organic: 5200, social: 1800, referral: 900 },
];

const productSalesData = [
  { product: 'Laptops', q1: 8500, q2: 9200, q3: 7800, q4: 12400 },
  { product: 'Phones', q1: 12300, q2: 11500, q3: 13800, q4: 15200 },
  { product: 'Tablets', q1: 3200, q2: 3800, q3: 4100, q4: 5600 },
  { product: 'Watches', q1: 2100, q2: 2800, q3: 3500, q4: 4900 },
  { product: 'Headphones', q1: 4800, q2: 5100, q3: 5600, q4: 7200 },
  { product: 'Accessories', q1: 1900, q2: 2200, q3: 2500, q4: 3100 },
];

const salesChannelData = [
  { quarter: 'Q1 2024', online: 45200, retail: 28300, wholesale: 18900, marketplace: 12400 },
  { quarter: 'Q2 2024', online: 52100, retail: 31200, wholesale: 21500, marketplace: 15800 },
  { quarter: 'Q3 2024', online: 48900, retail: 29800, wholesale: 19200, marketplace: 14200 },
  { quarter: 'Q4 2024', online: 68500, retail: 42100, wholesale: 25800, marketplace: 19600 },
];

const marketShareData = [
  { name: 'Chrome', value: 64.7 },
  { name: 'Safari', value: 18.8 },
  { name: 'Firefox', value: 3.2 },
  { name: 'Edge', value: 5.1 },
  { name: 'Samsung Internet', value: 2.6 },
  { name: 'Opera', value: 2.4 },
  { name: 'Other', value: 3.2 },
];

const budgetData = [
  { name: 'Engineering', value: 420000 },
  { name: 'Marketing', value: 280000 },
  { name: 'Sales', value: 195000 },
  { name: 'Customer Support', value: 145000 },
  { name: 'Operations', value: 110000 },
  { name: 'HR', value: 85000 },
];

const temperatureData = [
  { city: 'New York', jan: -1, apr: 12, jul: 26, oct: 15 },
  { city: 'London', jan: 5, apr: 11, jul: 19, oct: 12 },
  { city: 'Tokyo', jan: 5, apr: 15, jul: 27, oct: 18 },
  { city: 'Sydney', jan: 23, apr: 18, jul: 12, oct: 18 },
  { city: 'Dubai', jan: 19, apr: 29, jul: 36, oct: 30 },
];

const userGrowthData = [
  { month: 'Jan', active: 12400, new: 3200, churned: 800 },
  { month: 'Feb', active: 14800, new: 3800, churned: 1200 },
  { month: 'Mar', active: 17200, new: 4200, churned: 950 },
  { month: 'Apr', active: 19600, new: 3900, churned: 1100 },
  { month: 'May', active: 22100, new: 4500, churned: 870 },
  { month: 'Jun', active: 25800, new: 5200, churned: 1300 },
  { month: 'Jul', active: 28400, new: 4800, churned: 1050 },
  { month: 'Aug', active: 31200, new: 5500, churned: 920 },
];

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'line',
    data: revenueData,
    xKey: 'month',
    series: [
      { dataKey: 'revenue', label: 'Revenue' },
      { dataKey: 'profit', label: 'Profit' },
      { dataKey: 'costs', label: 'Costs' },
    ],
    title: 'Annual Revenue Overview',
    chartHeight: 350,
    legend: { interactive: true },
  },
};

export const BarChart: Story = {
  args: {
    variant: 'bar',
    data: productSalesData,
    xKey: 'product',
    series: [
      { dataKey: 'q1', label: 'Q1' },
      { dataKey: 'q2', label: 'Q2' },
      { dataKey: 'q3', label: 'Q3' },
      { dataKey: 'q4', label: 'Q4' },
    ],
    title: 'Product Sales by Quarter',
    chartHeight: 350,
    legend: { interactive: true },
    yAxis: {
      tickFormatter: (v: string | number) => `$${(Number(v) / 1000).toFixed(0)}k`,
    },
  },
};

export const AreaChart: Story = {
  args: {
    variant: 'area',
    data: userGrowthData,
    xKey: 'month',
    series: [
      { dataKey: 'active', label: 'Active Users' },
      { dataKey: 'new', label: 'New Signups' },
    ],
    title: 'User Growth',
    chartHeight: 350,
    legend: { interactive: true },
  },
};

export const PieChart: Story = {
  args: {
    variant: 'pie',
    data: marketShareData,
    pieConfig: {
      nameKey: 'name',
      dataKey: 'value',
      showLabels: true,
    },
    title: 'Browser Market Share',
    chartHeight: 400,
    legend: { interactive: true },
  },
};

export const DonutChart: Story = {
  args: {
    variant: 'donut',
    data: budgetData,
    pieConfig: {
      nameKey: 'name',
      dataKey: 'value',
      paddingAngle: 2,
      showLabels: true,
      labelFormatter: (value: number) => `$${(value / 1000).toFixed(0)}k`,
    },
    title: 'Department Budget Allocation',
    chartHeight: 400,
    legend: { interactive: true },
  },
};

// ─── Features ─────────────────────────────────────────────────────────────────

export const MultiSeriesWithLegend: Story = {
  args: {
    variant: 'line',
    data: webTrafficData,
    xKey: 'week',
    series: [
      { dataKey: 'organic', label: 'Organic Search' },
      { dataKey: 'direct', label: 'Direct' },
      { dataKey: 'social', label: 'Social Media' },
      { dataKey: 'referral', label: 'Referral' },
    ],
    title: 'Website Traffic Sources',
    chartHeight: 350,
    legend: { interactive: true },
  },
  parameters: {
    docs: {
      description: {
        story: 'Click legend items to toggle series visibility.',
      },
    },
  },
};

export const StackedBarChart: Story = {
  args: {
    variant: 'bar',
    data: salesChannelData,
    xKey: 'quarter',
    series: [
      { dataKey: 'online', label: 'Online', stackId: 'channel' },
      { dataKey: 'retail', label: 'Retail', stackId: 'channel' },
      { dataKey: 'wholesale', label: 'Wholesale', stackId: 'channel' },
      { dataKey: 'marketplace', label: 'Marketplace', stackId: 'channel' },
    ],
    title: 'Sales by Channel (Stacked)',
    chartHeight: 350,
    legend: { interactive: true },
    yAxis: {
      tickFormatter: (v: string | number) => `$${(Number(v) / 1000).toFixed(0)}k`,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Series with the same `stackId` are stacked.',
      },
    },
  },
};

export const CurveTypes: StoryFn = () => {
  const curveTypes = ['monotone', 'linear', 'step', 'natural'] as const;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {curveTypes.map((curveType) => (
        <div key={curveType}>
          <p style={{ marginBottom: 8, fontWeight: 600 }}>curveType: &quot;{curveType}&quot;</p>
          <Chart
            variant="line"
            data={revenueData}
            xKey="month"
            series={[{ dataKey: 'revenue', label: 'Revenue', curveType }]}
            chartHeight={200}
            legend={{ position: 'none' }}
            title={`${curveType} curve`}
          />
        </div>
      ))}
    </div>
  );
};
CurveTypes.parameters = {
  docs: {
    description: {
      story: 'All four interpolation types: monotone (default), linear, step, natural. Set via `series[].curveType`.',
    },
  },
};

export const AxisConfig: Story = {
  args: {
    variant: 'line',
    data: revenueData,
    xKey: 'month',
    series: [
      { dataKey: 'revenue', label: 'Revenue' },
      { dataKey: 'profit', label: 'Profit' },
    ],
    title: 'Axis Configuration',
    chartHeight: 350,
    xAxis: {
      label: 'Month',
      tickCount: 7,
    },
    yAxis: {
      label: 'Amount (USD)',
      tickFormatter: (v: string | number) => `$${(Number(v) / 1000).toFixed(0)}k`,
      domain: [0, 50000],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates `xAxis` and `yAxis` config: axis labels, custom `tickFormatter`, fixed `domain`, and `tickCount`. **Note:** `chartMargin.left` is set to `80` here as a workaround — the y-axis label offset is hardcoded (`dx: -10`) and does not adapt to formatted tick label width (known bug).',
      },
    },
  },
};

export const PerSeriesColors: Story = {
  args: {
    variant: 'line',
    data: revenueData,
    xKey: 'month',
    series: [
      { dataKey: 'revenue', label: 'Revenue', color: '#6200EA' },
      { dataKey: 'profit', label: 'Profit', color: '#F5A336', fillOpacity: 0.5 },
      { dataKey: 'costs', label: 'Costs', color: '#FF6D00' },
    ],
    title: 'Per-Series Colors',
    chartHeight: 350,
    legend: { interactive: true },
  },
  parameters: {
    docs: {
      description: {
        story:
          '`series[].color` overrides the palette for a single series. `series[].fillOpacity` controls area fill transparency (effective on area/line charts).',
      },
    },
  },
};

export const CustomColors: Story = {
  args: {
    variant: 'bar',
    data: temperatureData,
    xKey: 'city',
    series: [
      { dataKey: 'jan', label: 'January' },
      { dataKey: 'apr', label: 'April' },
      { dataKey: 'jul', label: 'July' },
      { dataKey: 'oct', label: 'October' },
    ],
    colors: ['#2196F3', '#4CAF50', '#FF9800', '#F44336'],
    title: 'Average Temperature by City',
    chartHeight: 350,
    legend: { interactive: true },
    yAxis: {
      tickFormatter: (v: string | number) => `${v}°C`,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'The `colors` prop replaces the entire theme palette. For per-series colors, use `series[].color`.',
      },
    },
  },
};

// ─── States ───────────────────────────────────────────────────────────────────

export const LoadingState: Story = {
  args: {
    variant: 'line',
    data: revenueData,
    xKey: 'month',
    series: [{ dataKey: 'revenue', label: 'Revenue' }],
    loading: true,
    loadingState: (
      <Column gap="12px" padding="40px" alignItems="center">
        <Skeleton variant="rounded" width="90%" height="200px" />
        <Row gap="16px" justifyContent="center">
          <Skeleton variant="rounded" width="80px" height="16px" />
          <Skeleton variant="rounded" width="80px" height="16px" />
        </Row>
      </Column>
    ),
  },
};

export const EmptyState: Story = {
  args: {
    variant: 'line',
    data: [],
    xKey: 'month',
    series: [{ dataKey: 'revenue', label: 'Revenue' }],
  },
};

export const ErrorState: Story = {
  args: {
    variant: 'line',
    data: revenueData,
    xKey: 'month',
    series: [{ dataKey: 'revenue', label: 'Revenue' }],
    error: true,
  },
};

// ─── Composition ──────────────────────────────────────────────────────────────

export const Dashboard: StoryFn = () => {
  return (
    <Column gap="24px">
      <Row gap="24px">
        <div style={{ flex: 2, border: '1px solid #E0E0E0', borderRadius: '8px', padding: '16px' }}>
          <Chart
            variant="area"
            data={revenueData}
            xKey="month"
            series={[
              { dataKey: 'revenue', label: 'Revenue' },
              { dataKey: 'profit', label: 'Profit' },
            ]}
            title="Revenue & Profit Trend"
            chartHeight={280}
            legend={{ interactive: true }}
            yAxis={{
              tickFormatter: (v: string | number) => `$${(Number(v) / 1000).toFixed(0)}k`,
            }}
          />
        </div>
        <div style={{ flex: 1, border: '1px solid #E0E0E0', borderRadius: '8px', padding: '16px' }}>
          <Chart
            variant="donut"
            data={budgetData}
            pieConfig={{ nameKey: 'name', dataKey: 'value', paddingAngle: 2 }}
            title="Budget Allocation"
            chartHeight={280}
            legend={{ interactive: true }}
          />
        </div>
      </Row>
      <Row gap="24px">
        <div style={{ flex: 1, border: '1px solid #E0E0E0', borderRadius: '8px', padding: '16px' }}>
          <Chart
            variant="bar"
            data={productSalesData}
            xKey="product"
            series={[
              { dataKey: 'q3', label: 'Q3' },
              { dataKey: 'q4', label: 'Q4' },
            ]}
            title="Product Sales Q3 vs Q4"
            chartHeight={250}
            legend={{ interactive: true }}
          />
        </div>
        <div style={{ flex: 1, border: '1px solid #E0E0E0', borderRadius: '8px', padding: '16px' }}>
          <Chart
            variant="bar"
            data={salesChannelData}
            xKey="quarter"
            series={[
              { dataKey: 'online', label: 'Online', stackId: 'ch' },
              { dataKey: 'retail', label: 'Retail', stackId: 'ch' },
              { dataKey: 'wholesale', label: 'Wholesale', stackId: 'ch' },
              { dataKey: 'marketplace', label: 'Marketplace', stackId: 'ch' },
            ]}
            title="Sales by Channel"
            chartHeight={250}
            legend={{ interactive: true }}
          />
        </div>
      </Row>
    </Column>
  );
};
Dashboard.parameters = {
  docs: {
    description: {
      story: 'Real-world dashboard layout combining area, donut, bar, and stacked bar charts.',
    },
  },
};

// ─── Tokens ───────────────────────────────────────────────────────────────────

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ chart: defaultTheme.chart }} />;
DefaultTokens.parameters = {
  docs: {
    description: {
      story: 'Default theme tokens for Chart. Override via your theme provider.',
    },
  },
};
