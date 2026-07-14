import { expect } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Card } from './Card';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<Card>Line 1</Card>);
    expect(container).toMatchSnapshot();
  });
});
