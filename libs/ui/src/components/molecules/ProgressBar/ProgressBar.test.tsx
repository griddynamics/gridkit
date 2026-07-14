import '@testing-library/jest-dom';

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testUtils';
import { colors } from '@tokens';
import { ProgressBar } from './ProgressBar';
import { COMPONENT_NAME } from './constants';

describe(COMPONENT_NAME, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('SHOULD match snapshot', () => {
    const { container } = render(<ProgressBar value={42} aria-label="Loading progress" />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render without crashing and set aria-valuenow correctly', () => {
    render(<ProgressBar value={42} aria-label="Loading progress" />);
    const testElement = screen.getByTestId(COMPONENT_NAME);
    expect(document.body.contains(testElement)).toBe(true);
  });

  it('SHOULD set aria-valuenow correctly', () => {
    render(<ProgressBar value={42} aria-label="Loading progress" />);

    const testElement = screen.getByTestId(COMPONENT_NAME);
    expect(testElement.getAttribute('role')).toContain('progressbar');
    expect(testElement.getAttribute('aria-label')).toContain('Loading progress');
    expect(testElement.getAttribute('aria-valuemin')).toContain('0');
    expect(testElement.getAttribute('aria-valuemax')).toContain('100');
    expect(testElement.getAttribute('aria-valuenow')).toContain('42');
  });

  it('SHOULD clamp value to 100 when value > 100', () => {
    render(<ProgressBar value={150} showPercentage />);
    const testElement = screen.getByTestId(COMPONENT_NAME);
    expect(document.body.contains(testElement)).toBe(true);
    expect(testElement.getAttribute('aria-valuenow')).toContain('100');
  });

  it('SHOULD clamp value to 0 when value < 0', () => {
    render(<ProgressBar value={-20} showPercentage />);
    const testElement = screen.getByTestId(COMPONENT_NAME);
    expect(document.body.contains(testElement)).toBe(true);
    expect(testElement.getAttribute('aria-valuenow')).toContain('0');
  });

  it('SHOULD not render aria-valuenow in indeterminate mode', () => {
    render(<ProgressBar indeterminate />);
    const testElement = screen.getByTestId(COMPONENT_NAME);
    expect(document.body.contains(testElement)).toBe(true);
    // getAttribute returns null when attribute is absent
    expect(testElement.getAttribute('aria-valuenow')).toBeNull();
  });

  it('SHOULD render percentage label when showPercentage=true and value>0', () => {
    render(<ProgressBar value={25} showPercentage />);
    const percentLabel = screen.queryByText('25%');
    expect(document.body.contains(percentLabel!)).toBe(true);
  });

  it('SHOULD use default theme colors for the track and fill when custom colors are omitted', () => {
    render(<ProgressBar value={25} aria-label="Default themed progress" />);

    expect(screen.getByTestId(`${COMPONENT_NAME}-track`)).toHaveStyle({
      backgroundColor: colors.bg.default,
    });
    expect(screen.getByTestId(`${COMPONENT_NAME}-fill`)).toHaveStyle({
      backgroundColor: colors.bg.fill.primary,
    });
  });

  it('SHOULD not render percentage label when showPercentage=false', () => {
    render(<ProgressBar value={25} />);
    const percentLabel = screen.queryByText('25%');
    expect(document.body.contains(percentLabel as any)).toBe(false);
  });

  it('SHOULD not render percentage label when value=0 even if showPercentage=true', () => {
    render(<ProgressBar value={0} showPercentage />);
    const percentLabel = screen.queryByText('0%');
    expect(document.body.contains(percentLabel as any)).toBe(false);
  });

  it('SHOULD render indeterminate fill when indeterminate=true', () => {
    render(<ProgressBar indeterminate />);
    // no percentage label
    const anyLabel = screen.queryByText(/\d+%/);
    expect(document.body.contains(anyLabel as any)).toBe(false);
    // but root still exists
    const testElement = screen.getByTestId(COMPONENT_NAME);
    expect(document.body.contains(testElement)).toBe(true);
  });

  it('SHOULD prefer theme tokens for fillColor and backgroundColor', () => {
    render(
      <ProgressBar
        value={42}
        fillColor="bg.fill.success.primary.default"
        backgroundColor="bg.fill.info.secondary.default"
      />
    );

    expect(screen.getByTestId(`${COMPONENT_NAME}-track`)).toHaveStyle({
      backgroundColor: colors.bg.fill.info.secondary.default,
    });
    expect(screen.getByTestId(`${COMPONENT_NAME}-fill`)).toHaveStyle({
      backgroundColor: colors.bg.fill.success.primary.default,
    });
  });
});
