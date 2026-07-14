import { describe, it, expect } from 'vitest';
import { render, screen } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Portal } from '.';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { baseElement } = render(<Portal>Hello World!</Portal>);

    const childElement = screen.getByText(/Hello World/i);
    expect(document.body.contains(childElement)).toBe(true);
    expect(baseElement).toMatchSnapshot();
  });

  it('SHOULD be a portal for defined container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const { baseElement } = render(<Portal container={container}>Hello World!</Portal>);
    const childElement = screen.getByText(/Hello World/i);
    expect(container.contains(childElement)).toBe(true);
    expect(baseElement).toMatchSnapshot();
  });
});
