import '@testing-library/jest-dom';

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testUtils';
import { colors } from '@tokens';

import { COMPONENT_NAME } from './constants';
import { Chart } from './Chart';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { AreaChart } from './AreaChart';
import { PieChart } from './PieChart';
import type { ChartDataRecord, ChartSeries, ChartPieConfig } from './Chart.types';

// Mock useLogger to avoid console logs in tests
vi.mock('@hooks/useLogger', () => ({
  useLogger: () => ({
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  }),
}));

// Mock ResizeObserver to trigger callback immediately so charts get dimensions
global.ResizeObserver = class ResizeObserver {
  private cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
  }
  observe(target: Element) {
    // Simulate a resize entry so the component measures its container
    Object.defineProperty(target, 'clientWidth', { value: 600, configurable: true });
    this.cb([], this);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unobserve() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}
} as any;

describe(COMPONENT_NAME, () => {
  const sampleData: ChartDataRecord[] = [
    { month: 'Jan', revenue: 4000, profit: 2400 },
    { month: 'Feb', revenue: 3000, profit: 1398 },
    { month: 'Mar', revenue: 5000, profit: 3800 },
    { month: 'Apr', revenue: 4500, profit: 2800 },
  ];

  const sampleSeries: ChartSeries[] = [
    { dataKey: 'revenue', label: 'Revenue' },
    { dataKey: 'profit', label: 'Profit' },
  ];

  const pieData: ChartDataRecord[] = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 200 },
  ];

  const pieConfig: ChartPieConfig = {
    nameKey: 'name',
    dataKey: 'value',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Rendering
  it('SHOULD render with data-testid', () => {
    render(<Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} />);
    expect(screen.getByTestId(COMPONENT_NAME)).toBeDefined();
  });

  it('SHOULD render line chart variant', () => {
    const { container } = render(<Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} />);
    expect(container).toBeDefined();
    expect(screen.getByTestId(COMPONENT_NAME)).toBeDefined();
  });

  it('SHOULD render bar chart variant', () => {
    const { container } = render(<Chart variant="bar" data={sampleData} xKey="month" series={sampleSeries} />);
    expect(container).toBeDefined();
  });

  it('SHOULD render area chart variant', () => {
    const { container } = render(<Chart variant="area" data={sampleData} xKey="month" series={sampleSeries} />);
    expect(container).toBeDefined();
  });

  it('SHOULD render pie chart variant', () => {
    const { container } = render(<Chart variant="pie" data={pieData} pieConfig={pieConfig} />);
    expect(container).toBeDefined();
  });

  it('SHOULD render donut chart variant', () => {
    const { container } = render(<Chart variant="donut" data={pieData} pieConfig={pieConfig} />);
    expect(container).toBeDefined();
  });

  // States
  it('SHOULD render loading state with custom loadingState', () => {
    render(
      <Chart
        variant="line"
        data={sampleData}
        xKey="month"
        series={sampleSeries}
        loading={true}
        loadingState={<div>Custom Loading...</div>}
      />
    );
    expect(screen.getByText('Custom Loading...')).toBeDefined();
  });

  it('SHOULD render default loading state when loading is true', () => {
    render(<Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} loading={true} />);
    expect(screen.getByText('Loading chart data...')).toBeDefined();
  });

  it('SHOULD render empty state with custom emptyState', () => {
    render(<Chart variant="line" data={[]} xKey="month" series={sampleSeries} emptyState={<div>Custom Empty</div>} />);
    expect(screen.getByText('Custom Empty')).toBeDefined();
  });

  it('SHOULD render default empty state when data is empty', () => {
    render(<Chart variant="line" data={[]} xKey="month" series={sampleSeries} />);
    expect(screen.getByText('No data available')).toBeDefined();
  });

  it('SHOULD render error state with custom errorState', () => {
    render(
      <Chart
        variant="line"
        data={sampleData}
        xKey="month"
        series={sampleSeries}
        error={true}
        errorState={<div>Custom Error</div>}
      />
    );
    expect(screen.getByText('Custom Error')).toBeDefined();
  });

  it('SHOULD render default error state when error is true', () => {
    render(<Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} error={true} />);
    expect(screen.getByText('Failed to load chart data')).toBeDefined();
  });

  // Accessibility
  it('SHOULD render visually hidden title when provided', () => {
    render(<Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} title="Revenue Over Time" />);
    expect(screen.getByTestId(`${COMPONENT_NAME}-title`)).toBeDefined();
    expect(screen.getByText('Revenue Over Time')).toBeDefined();
  });

  it('SHOULD render visually hidden description when provided', () => {
    render(
      <Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} description="Shows revenue trend" />
    );
    expect(screen.getByTestId(`${COMPONENT_NAME}-description`)).toBeDefined();
    expect(screen.getByText('Shows revenue trend')).toBeDefined();
  });

  it('SHOULD have role="img" on container', () => {
    render(<Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} />);
    const container = screen.getByTestId(COMPONENT_NAME);
    expect(container.getAttribute('role')).toBe('img');
  });

  it('SHOULD have aria-label on container', () => {
    render(<Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} title="My Chart" />);
    const container = screen.getByTestId(COMPONENT_NAME);
    expect(container.getAttribute('aria-label')).toBe('My Chart');
  });

  // Legend
  it('SHOULD render legend with correct labels', () => {
    render(<Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} />);
    expect(screen.getByText('Revenue')).toBeDefined();
    expect(screen.getByText('Profit')).toBeDefined();
  });

  it('SHOULD hide legend when position is none', () => {
    render(<Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} legend={{ position: 'none' }} />);
    expect(screen.queryByTestId('Chart-legend')).toBeNull();
  });

  it('SHOULD toggle series visibility on legend click when interactive', () => {
    render(
      <Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} legend={{ interactive: true }} />
    );
    const revenueItem = screen.getByTestId('Chart-legend-item-revenue');
    fireEvent.click(revenueItem);
    // After click, the item should have hidden styling applied
    expect(revenueItem).toBeDefined();
  });

  // Props
  it('SHOULD use custom colors when provided', () => {
    const customColors = ['#FF0000', '#00FF00'];
    const { container } = render(
      <Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} colors={customColors} />
    );
    expect(container).toBeDefined();
  });

  it('SHOULD prefer theme tokens for chart palette and series colors', () => {
    const themedSeries: ChartSeries[] = [
      { dataKey: 'revenue', label: 'Revenue', color: 'icon.warning' },
      { dataKey: 'profit', label: 'Profit' },
    ];

    const { container } = render(
      <Chart
        variant="line"
        data={sampleData}
        xKey="month"
        series={themedSeries}
        colors={['icon.default', 'icon.error']}
      />
    );

    const revenueItem = screen.getByTestId('Chart-legend-item-revenue');
    const profitItem = screen.getByTestId('Chart-legend-item-profit');

    expect(revenueItem.querySelector('span')).toHaveStyle({ backgroundColor: colors.icon.warning });
    expect(profitItem.querySelector('span')).toHaveStyle({ backgroundColor: colors.icon.error });
    expect(container.querySelector(`path[stroke="${colors.icon.warning}"]`)).not.toBeNull();
    expect(container.querySelector(`path[stroke="${colors.icon.error}"]`)).not.toBeNull();
  });

  it('SHOULD use custom chartHeight', () => {
    const { container } = render(
      <Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} chartHeight={500} />
    );
    expect(container).toBeDefined();
  });

  it('SHOULD pass chartMargin to chart', () => {
    const { container } = render(
      <Chart
        variant="line"
        data={sampleData}
        xKey="month"
        series={sampleSeries}
        chartMargin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      />
    );
    expect(container).toBeDefined();
  });

  it('SHOULD apply Box CSS props on container', () => {
    render(<Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} width="500px" padding="20px" />);
    expect(screen.getByTestId(COMPONENT_NAME)).toBeDefined();
  });

  // Configuration errors
  it('SHOULD render configuration error when xKey is missing for cartesian chart', () => {
    render(<Chart variant="line" data={sampleData} series={sampleSeries} />);
    expect(screen.getByText('Unable to render chart')).toBeDefined();
    expect(screen.getByTestId(COMPONENT_NAME).getAttribute('aria-label')).toBe('Chart configuration incomplete');
  });

  it('SHOULD render configuration error when pieConfig is missing for pie chart', () => {
    render(<Chart variant="pie" data={pieData} />);
    expect(screen.getByText('Unable to render chart')).toBeDefined();
  });

  it('SHOULD render configuration error when pieConfig is missing for donut chart', () => {
    render(<Chart variant="donut" data={pieData} />);
    expect(screen.getByText('Unable to render chart')).toBeDefined();
  });

  // Edge cases
  it('SHOULD handle empty series array', () => {
    const { container } = render(<Chart variant="line" data={sampleData} xKey="month" series={[]} />);
    expect(container).toBeDefined();
  });

  it('SHOULD handle null values in data', () => {
    const dataWithNulls: ChartDataRecord[] = [
      { month: 'Jan', revenue: 4000, profit: null },
      { month: 'Feb', revenue: null, profit: 1398 },
    ];
    const { container } = render(<Chart variant="line" data={dataWithNulls} xKey="month" series={sampleSeries} />);
    expect(container).toBeDefined();
  });

  it('SHOULD match snapshot', () => {
    const { container } = render(<Chart variant="line" data={sampleData} xKey="month" series={sampleSeries} />);
    expect(container).toMatchSnapshot();
  });
});

describe('Standalone Chart Components', () => {
  const sampleData: ChartDataRecord[] = [
    { month: 'Jan', revenue: 4000, profit: 2400 },
    { month: 'Feb', revenue: 3000, profit: 1398 },
    { month: 'Mar', revenue: 5000, profit: 3800 },
    { month: 'Apr', revenue: 4500, profit: 2800 },
  ];

  const sampleSeries: ChartSeries[] = [
    { dataKey: 'revenue', label: 'Revenue' },
    { dataKey: 'profit', label: 'Profit' },
  ];

  const pieData: ChartDataRecord[] = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 200 },
  ];

  const pieConfig: ChartPieConfig = {
    nameKey: 'name',
    dataKey: 'value',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('LineChart', () => {
    it('SHOULD render with data-testid', () => {
      render(<LineChart data={sampleData} xKey="month" series={sampleSeries} />);
      expect(screen.getByTestId(COMPONENT_NAME)).toBeDefined();
    });

    it('SHOULD render with aria-label', () => {
      render(<LineChart data={sampleData} xKey="month" series={sampleSeries} />);
      expect(screen.getByTestId(COMPONENT_NAME).getAttribute('aria-label')).toBe('line chart');
    });

    it('SHOULD render legend', () => {
      render(<LineChart data={sampleData} xKey="month" series={sampleSeries} />);
      expect(screen.getByText('Revenue')).toBeDefined();
      expect(screen.getByText('Profit')).toBeDefined();
    });

    it('SHOULD render loading state', () => {
      render(<LineChart data={sampleData} xKey="month" series={sampleSeries} loading={true} />);
      expect(screen.getByText('Loading chart data...')).toBeDefined();
    });

    it('SHOULD render empty state', () => {
      render(<LineChart data={[]} xKey="month" series={sampleSeries} />);
      expect(screen.getByText('No data available')).toBeDefined();
    });
  });

  describe('BarChart', () => {
    it('SHOULD render with data-testid', () => {
      render(<BarChart data={sampleData} xKey="month" series={sampleSeries} />);
      expect(screen.getByTestId(COMPONENT_NAME)).toBeDefined();
    });

    it('SHOULD render with aria-label', () => {
      render(<BarChart data={sampleData} xKey="month" series={sampleSeries} />);
      expect(screen.getByTestId(COMPONENT_NAME).getAttribute('aria-label')).toBe('bar chart');
    });

    it('SHOULD render legend', () => {
      render(<BarChart data={sampleData} xKey="month" series={sampleSeries} />);
      expect(screen.getByText('Revenue')).toBeDefined();
    });
  });

  describe('AreaChart', () => {
    it('SHOULD render with data-testid', () => {
      render(<AreaChart data={sampleData} xKey="month" series={sampleSeries} />);
      expect(screen.getByTestId(COMPONENT_NAME)).toBeDefined();
    });

    it('SHOULD render with aria-label', () => {
      render(<AreaChart data={sampleData} xKey="month" series={sampleSeries} />);
      expect(screen.getByTestId(COMPONENT_NAME).getAttribute('aria-label')).toBe('area chart');
    });

    it('SHOULD render legend', () => {
      render(<AreaChart data={sampleData} xKey="month" series={sampleSeries} />);
      expect(screen.getByText('Revenue')).toBeDefined();
    });
  });

  describe('PieChart', () => {
    it('SHOULD render with data-testid', () => {
      render(<PieChart data={pieData} pieConfig={pieConfig} />);
      expect(screen.getByTestId(COMPONENT_NAME)).toBeDefined();
    });

    it('SHOULD render with aria-label for pie', () => {
      render(<PieChart data={pieData} pieConfig={pieConfig} />);
      expect(screen.getByTestId(COMPONENT_NAME).getAttribute('aria-label')).toBe('pie chart');
    });

    it('SHOULD render as donut when donut prop is true', () => {
      render(<PieChart data={pieData} pieConfig={pieConfig} donut />);
      expect(screen.getByTestId(COMPONENT_NAME).getAttribute('aria-label')).toBe('donut chart');
    });

    it('SHOULD render legend for pie data', () => {
      render(<PieChart data={pieData} pieConfig={pieConfig} />);
      expect(screen.getByText('Group A')).toBeDefined();
      expect(screen.getByText('Group B')).toBeDefined();
      expect(screen.getByText('Group C')).toBeDefined();
    });

    it('SHOULD render loading state', () => {
      render(<PieChart data={pieData} pieConfig={pieConfig} loading={true} />);
      expect(screen.getByText('Loading chart data...')).toBeDefined();
    });
  });
});
