const component = {
  name: 'Chart',
  import: "import { Chart } from 'gd-design-library'",
  description:
    'Reusable data visualization component supporting line, bar, area, pie, and donut chart variants. Built on visx internally with a GridKit-native API. Features consistent theming, interactive legend, custom tooltips, responsive sizing, and built-in loading/empty/error states.',
  a2uiName: 'chart',
  category: 'Data Display',
  complexity: 'High',
  accessibility: 'WCAG 2.1 AA Compliant',
  performance: 'Optimized with ResizeObserver-based responsive sizing',
  dependencies: ['@visx/xychart', '@visx/shape'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~12KB gzipped (includes visx)',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    {
      name: 'variant',
      type: 'string',
      description: 'Chart type to render',
      required: true,
      enum: ['line', 'bar', 'area', 'pie', 'donut'] as const,
    },
    {
      name: 'data',
      type: 'Array<Record<string, string | number | null>>',
      description: 'Array of data records to visualize.',
      required: true,
    },
    { name: 'xKey', type: 'string', description: 'Field name in data records to use as the x-axis key' },
    {
      name: 'series',
      type: 'Array<{ dataKey: string; label?: string; color?: string; stackId?: string; curveType?: "monotone" | "linear" | "step" | "natural"; fillOpacity?: number; hidden?: boolean }>',
      description:
        'Series definitions for XY charts (line, bar, area) — each entry maps a data field to a chart series. When using series[].color, Prefer theme color token paths before raw CSS/hex colors.',
    },
    {
      name: 'pieConfig',
      type: '{ nameKey: string; dataKey: string; innerRadius?: string | number; outerRadius?: string | number; showLabels?: boolean; paddingAngle?: number; startAngle?: number; endAngle?: number }',
      description: 'Configuration for pie/donut charts.',
    },
    {
      name: 'title',
      type: 'string',
      description: 'Visible or screen-reader chart title passed to the chart container.',
    },
    { name: 'label', type: 'string', description: 'Accessible chart label used when title text is not enough.' },
    { name: 'description', type: 'string', description: 'Accessible chart description for screen readers.' },
    { name: 'chartHeight', type: 'number', description: 'Height of the chart canvas in pixels' },
    {
      name: 'colors',
      type: 'string[]',
      description:
        'Custom color palette for series/segments. Prefer theme color token paths before raw CSS/hex colors.',
    },
    {
      name: 'legend',
      type: '{ position?: "top" | "bottom" | "left" | "right" | "none"; interactive?: boolean }',
      description:
        'Legend configuration — position (default: "bottom") and interactivity (interactive: true lets users click to show/hide series)',
    },
    {
      name: 'xAxis',
      type: '{ show?: boolean; label?: string; tickCount?: number; domain?: [number | "auto" | "dataMin" | "dataMax", number | "auto" | "dataMin" | "dataMax"]; unit?: string }',
      description: 'X-axis configuration.',
    },
    {
      name: 'yAxis',
      type: '{ show?: boolean; label?: string; tickCount?: number; domain?: [number | "auto" | "dataMin" | "dataMax", number | "auto" | "dataMin" | "dataMax"]; unit?: string }',
      description: 'Y-axis configuration.',
    },
    { name: 'grid', type: 'object', description: 'Grid line configuration.' },
    {
      name: 'tooltip',
      type: '{ enabled?: boolean }',
      description: 'Tooltip configuration. In A2UI JSON, use only JSON-safe flags such as enabled.',
    },
    {
      name: 'chartMargin',
      type: '{ top?: number; right?: number; bottom?: number; left?: number }',
      description: 'Margin around the chart rendering area (inside the container)',
    },
    { name: 'animate', type: 'boolean', description: 'Whether to animate chart transitions' },
    { name: 'loading', type: 'boolean', description: 'Whether the chart is in a loading state.' },
    { name: 'error', type: 'boolean', description: 'Whether the chart is in an error state.' },
    {
      name: 'loadingText',
      type: 'string',
      description: 'Text shown in the default loading state (used when loadingState is not provided)',
    },
    {
      name: 'emptyText',
      type: 'string',
      description: 'Text shown in the default empty state (used when emptyState is not provided)',
    },
    {
      name: 'errorText',
      type: 'string',
      description: 'Text shown in the default error state (used when errorState is not provided)',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the outer container' },
  ],
  examples: [
    `// Line Chart - Monthly revenue and profit
import { Chart } from 'gd-design-library';

const data = [
  { month: 'Jan', revenue: 4000, profit: 2400 },
  { month: 'Feb', revenue: 3000, profit: 1398 },
  { month: 'Mar', revenue: 5000, profit: 3800 },
];

<Chart
  variant="line"
  data={data}
  xKey="month"
  series={[
    { dataKey: 'revenue', label: 'Revenue' },
    { dataKey: 'profit', label: 'Profit' },
  ]}
  title="Revenue vs Profit"
/>`,
    `// Bar Chart - Category comparison
import { Chart } from 'gd-design-library';

<Chart
  variant="bar"
  data={[
    { category: 'Electronics', sales: 4200 },
    { category: 'Clothing', sales: 3800 },
    { category: 'Books', sales: 2100 },
  ]}
  xKey="category"
  series={[{ dataKey: 'sales', label: 'Sales' }]}
  yAxis={{ tickFormatter: (v) => \`$\${v}\` }}
/>`,
    `// Stacked Bar Chart
import { Chart } from 'gd-design-library';

<Chart
  variant="bar"
  data={data}
  xKey="quarter"
  series={[
    { dataKey: 'online', label: 'Online', stackId: 'sales' },
    { dataKey: 'inStore', label: 'In-Store', stackId: 'sales' },
  ]}
/>`,
    `// Area Chart with gradient fills
import { Chart } from 'gd-design-library';

<Chart
  variant="area"
  data={data}
  xKey="month"
  series={[{ dataKey: 'revenue', label: 'Revenue' }]}
  chartHeight={400}
/>`,
    `// Pie Chart - Market share
import { Chart } from 'gd-design-library';

<Chart
  variant="pie"
  data={[
    { name: 'Desktop', value: 45 },
    { name: 'Mobile', value: 35 },
    { name: 'Tablet', value: 20 },
  ]}
  pieConfig={{ nameKey: 'name', dataKey: 'value', showLabels: true }}
/>`,
    `// Donut Chart
import { Chart } from 'gd-design-library';

<Chart
  variant="donut"
  data={data}
  pieConfig={{ nameKey: 'name', dataKey: 'value', paddingAngle: 2 }}
  title="Budget Distribution"
/>`,
    `// Interactive Legend with loading state
import { Chart, Skeleton, Column, Row } from 'gd-design-library';

<Chart
  variant="line"
  data={data}
  xKey="month"
  series={series}
  legend={{ interactive: true, position: 'top' }}
  loading={isLoading}
  loadingState={
    <Column gap="12px" padding="40px">
      <Skeleton variant="rounded" width="100%" height="200px" />
    </Column>
  }
/>`,
  ],
  bestPractices: [
    'CRITICAL: Do NOT import visx directly. Always use the Chart component from gd-design-library.',
    'Use xKey for line, bar, and area charts to specify the x-axis data key.',
    'Use pieConfig (with nameKey and dataKey) for pie and donut charts instead of xKey/series.',
    'Use chartHeight (not height) to control the chart rendering area size. height controls the outer container.',
    'Always provide a title for accessibility - it renders as a visually hidden heading.',
    'Use legend.interactive: true to allow users to toggle series visibility by clicking legend items.',
    'Provide loading, empty, and error states for production-ready charts.',
    'Use the colors prop with theme token paths to override the default palette while staying aligned with the active theme.',
    'Use yAxis.tickFormatter to format numeric values (e.g., currency, percentages).',
    'Use stackId on series items to create stacked bar charts.',
    'The component is fully responsive - it adapts to container width automatically.',
    'CRITICAL: Do NOT use tickFormatter, valueFormatter, or labelFormatter in A2UI/JSON context — functions cannot be serialized. The Chart component handles default formatting automatically.',
    'Always ensure series[].dataKey values match actual keys in the data array objects.',
    'Always ensure pieConfig.nameKey and pieConfig.dataKey match actual keys in the data array objects.',
  ],
  commonMistakes: [
    'Importing visx components directly instead of using the Chart component API',
    'Using height instead of chartHeight to size the chart (height affects the outer container)',
    'Missing xKey for cartesian charts (line, bar, area)',
    'Missing pieConfig for pie/donut charts',
    'Not providing series array for cartesian charts',
    'Using the same dataKey in multiple series without stackId for stacked bars',
    'Passing tickFormatter/valueFormatter/labelFormatter as a string instead of a function — JSON cannot serialize functions; these props are stripped at runtime',
    'xAxis/yAxis with tickFormatter like "(v) => `$${v}`" — this is a string, not a callable function',
    'series[].dataKey not matching any key in data records — series will be silently filtered out',
    'pieConfig.nameKey or dataKey not matching data keys — chart falls back to auto-detection',
    'Providing colors as non-string values — invalid entries are filtered out',
    'chartHeight as string (e.g. "300px") instead of number — prop is ignored, default used',
  ],
  relatedComponents: ['Table', 'Card', 'Skeleton', 'Column', 'Row'],
  validationRules: [
    {
      prop: 'variant',
      rule: 'Must be one of: line, bar, area, pie, donut. Falls back to "bar" if invalid.',
      level: 'warn',
    },
    {
      prop: 'data',
      rule: 'Must be Array of objects. Non-object entries are filtered. Empty array triggers empty state.',
      level: 'warn',
    },
    {
      prop: 'xKey',
      rule: 'Must be a string matching a key in data records. Auto-detected from first string key if missing.',
      level: 'warn',
    },
    {
      prop: 'series[].dataKey',
      rule: 'Must exist as a key in data records. Non-matching series are filtered out.',
      level: 'warn',
    },
    {
      prop: 'pieConfig.nameKey',
      rule: 'Must exist as a key in data records. Auto-detected if missing/invalid.',
      level: 'warn',
    },
    {
      prop: 'pieConfig.dataKey',
      rule: 'Must exist as a key in data records. Auto-detected from first numeric field if missing.',
      level: 'warn',
    },
    {
      prop: 'xAxis.tickFormatter',
      rule: 'Must be a function. Cannot be serialized in JSON — will be stripped if not callable.',
      level: 'debug',
    },
    {
      prop: 'yAxis.tickFormatter',
      rule: 'Must be a function. Cannot be serialized in JSON — will be stripped if not callable.',
      level: 'debug',
    },
    {
      prop: 'tooltip.valueFormatter',
      rule: 'Must be a function. Stripped if not callable.',
      level: 'debug',
    },
    {
      prop: 'tooltip.labelFormatter',
      rule: 'Must be a function. Stripped if not callable.',
      level: 'debug',
    },
    {
      prop: 'pieConfig.labelFormatter',
      rule: 'Must be a function. Stripped if not callable.',
      level: 'debug',
    },
    {
      prop: 'colors',
      rule: 'Must be string[]. Non-string entries filtered. If empty after filter, prop removed.',
      level: 'debug',
    },
    {
      prop: 'chartHeight',
      rule: 'Must be a positive number. Ignored if non-numeric or <= 0.',
      level: 'debug',
    },
  ],
};

const compositionTips: string[] = [
  'CRITICAL: Do NOT import visx directly. Use the Chart component from gd-design-library for all data visualization needs.',
  'Use Chart variant="line" for time-series data, trends, and continuous data visualization.',
  'Use Chart variant="bar" for category comparisons and discrete data. Add stackId to series for stacked bars.',
  'Use Chart variant="area" for cumulative or volume data. Areas get automatic gradient fills.',
  'Use Chart variant="pie" for proportional data. Use variant="donut" for a hollow center variant.',
  'Use xKey for line/bar/area charts to specify which data field maps to the x-axis.',
  'Use pieConfig with nameKey and dataKey for pie/donut charts. nameKey maps to labels, dataKey to values.',
  'Use chartHeight (not height) to set the chart rendering area. The height prop controls the outer container.',
  'Use legend={{ interactive: true }} to let users click legend items to show/hide individual series.',
  'Use legend={{ position: "top" }} to place the legend above the chart. Default is "bottom".',
  'Use yAxis={{ tickFormatter: (v) => `$${v}` }} to format axis tick labels as currency.',
  'Always provide Chart title prop for screen reader accessibility. It renders as a visually hidden h3.',
  'Combine Chart with Card for dashboard panels: <Card><Card.Title>Sales</Card.Title><Chart ... /></Card>.',
  'Use Chart loading prop with loadingState for async data. Use Skeleton components in loadingState.',
  'Use Chart error prop with errorState for failed API calls. Provide a retry button in errorState.',
  'Use Chart emptyState for when data is empty. Provide a helpful message or action.',
  'Use Chart colors prop to override the default palette. The palette has 10 colors that cycle for additional series.',
  'Use chartMargin to control spacing around the chart area: { top: 20, right: 20, bottom: 20, left: 20 }.',
  'Chart supports all BoxCssComponentProps (width, padding, margin, etc.) on the outer container.',
  'Use onDataPointClick callback to implement drill-down or detail views when users click data points.',
];

export default { component, compositionTips };
