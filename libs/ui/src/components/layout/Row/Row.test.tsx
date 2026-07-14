import { render, screen } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Row } from './Row';

describe(COMPONENT_NAME, () => {
  it('SHOULD renders children correctly', () => {
    render(
      <Row>
        <div>Child 1</div>
      </Row>
    );
    const container = screen.getByTestId(COMPONENT_NAME);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD applies gutter spacing correctly', () => {
    render(
      <Row gutter={20}>
        <div>Test</div>
      </Row>
    );

    const container = screen.getByTestId(COMPONENT_NAME);
    expect(container).toMatchSnapshot();

    const styles = window.getComputedStyle(container);

    expect(styles.gap).toBe('20px');
  });

  it('SHOULD applies alignment correctly', () => {
    render(
      <Row align="center">
        <div>Test</div>
      </Row>
    );

    const container = screen.getByTestId(COMPONENT_NAME);
    expect(container).toMatchSnapshot();

    const styles = window.getComputedStyle(container);

    expect(styles.alignItems).toBe('center');
  });

  it('SHOULD applies justify content correctly', () => {
    render(
      <Row justify="between">
        <div>Test</div>
      </Row>
    );

    const container = screen.getByTestId(COMPONENT_NAME);
    const styles = window.getComputedStyle(container);

    expect(styles.justifyContent).toBe('space-between');
  });

  it('SHOULD supports flex wrapping', () => {
    render(
      <Row isWrap={false}>
        <div>Test</div>
      </Row>
    );
    const container = screen.getByTestId(COMPONENT_NAME);
    const styles = window.getComputedStyle(container);

    expect(styles.flexWrap).toBe('nowrap');
  });
});
