import { expect } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { CardCounter } from './CardCounter';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<CardCounter>Line 1</CardCounter>);
    expect(container).toMatchSnapshot();
  });
});
