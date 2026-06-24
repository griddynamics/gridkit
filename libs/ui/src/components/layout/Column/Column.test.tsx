import { render, screen } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Column } from './Column';

describe(COMPONENT_NAME, () => {
  it('SHOULD renders children correctly', () => {
    const { container } = render(
      <Column>
        <div>Child 1</div>
      </Column>
    );
    expect(container).toMatchSnapshot();
  });

  it('SHOULD applies gutter spacing correctly', () => {
    render(
      <Column gutter={20}>
        <div>Test</div>
      </Column>
    );

    const container = screen.getByTestId(COMPONENT_NAME);
    const styles = window.getComputedStyle(container);

    expect(styles.gap).toBe('20px');
  });

  it('SHOULD applies alignment correctly', () => {
    render(
      <Column align="center">
        <div>Test</div>
      </Column>
    );

    const container = screen.getByTestId(COMPONENT_NAME);
    const styles = window.getComputedStyle(container);

    expect(styles.alignItems).toBe('center');
  });

  it('SHOULD applies justify content correctly', () => {
    render(
      <Column justify="between">
        <div>Test</div>
      </Column>
    );

    const container = screen.getByTestId(COMPONENT_NAME);
    const styles = window.getComputedStyle(container);

    expect(styles.justifyContent).toBe('space-between');
  });
});
