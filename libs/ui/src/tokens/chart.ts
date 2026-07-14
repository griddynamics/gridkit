import { get } from '@utils';

export const chart = {
  container: {
    default: {
      width: '100%',
      fontFamily: (theme: Record<symbol, unknown>) => get(theme, 'font.family', 'theme.font.family'),
      position: 'relative',
    },
  },
  animation: {
    cartesian: {
      revealDuration: { bar: '0.6s', line: '0.8s' },
      clipHidden: { bar: 'inset(100% 0 0 0)', line: 'inset(0 100% 0 0)' },
      clipVisible: 'inset(0 0 0 0)',
    },
    pie: {
      segmentDuration: 400,
      segmentStagger: 70,
      pushDistance: 12,
      hoverDistance: 5,
    },
  },
  hover: {
    bar: {
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.chart.bar', 'theme.values.transitions.chart.bar'),
      stroke: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
      strokeWidth: (theme: Record<symbol, unknown>) => get(theme, 'values.borderThick', 'theme.values.borderThick'),
    },
    line: {
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.chart.line', 'theme.values.transitions.chart.line'),
      brightness: 'brightness(1.2)',
      strokeWidth: (theme: Record<symbol, unknown>) => get(theme, 'values.borderThick', 'theme.values.borderThick'),
    },
    area: {
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.chart.area', 'theme.values.transitions.chart.area'),
      brightness: 'brightness(1.1)',
    },
    pie: {
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.chart.pie', 'theme.values.transitions.chart.pie'),
      brightness: 'brightness(1.06)',
    },
  },
  colors: {
    palette: [
      '#0069B4', // blue.50
      '#FFB800', // yellow.50 (primary)
      '#34A853', // green.50
      '#D21C1C', // red.50
      '#AF63F1', // purple.50
      '#53B7E8', // lightBlue.50
      '#F57C00', // orange.50
      '#EC4899', // pink.50
      '#14B8A6', // teal.50
      '#BD7A14', // yellow.80
    ],
  },
  axis: {
    default: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'theme.font.size.caption'),
      fill: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
    },
    line: {
      stroke: (theme: Record<symbol, unknown>) => get(theme, 'colors.border.default', 'theme.colors.border.default'),
    },
    label: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      fill: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.title', 'theme.colors.text.title'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
    },
  },
  grid: {
    default: {
      stroke: (theme: Record<symbol, unknown>) => get(theme, 'colors.neutral.30', 'theme.colors.neutral.30'),
      strokeDasharray: '3 3',
    },
  },
  tooltip: {
    container: {
      backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
      boxShadow: (theme: Record<symbol, unknown>) => get(theme, 'shadows.box["2"]', 'theme.shadows.box["2"]'),
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.default', 'theme.radius.default'),
      border: (theme: Record<symbol, unknown>) =>
        `1px solid ${get(theme, 'colors.border.default', 'theme.colors.border.default')}`,
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    },
    label: {
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      marginBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'theme.font.size.caption'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      padding: '2px 0',
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      flexShrink: 0,
    },
    enter: {
      animationDuration: '250ms',
      animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
  legend: {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'theme.font.size.caption'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      userSelect: 'none',
    },
    itemHidden: {
      opacity: 0.4,
      textDecoration: 'line-through',
    },
    labelText: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '120px',
    },
    dot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      flexShrink: 0,
    },
  },
  emptyState: {
    default: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xl', 'theme.spacing.xl'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      minHeight: '200px',
    },
  },
  errorState: {
    default: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xl', 'theme.spacing.xl'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.error', 'theme.colors.text.error'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      minHeight: '200px',
    },
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
};
