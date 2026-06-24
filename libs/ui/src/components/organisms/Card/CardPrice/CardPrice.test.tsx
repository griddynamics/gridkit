import { expect } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { CardPrice } from './CardPrice';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<CardPrice currentValue={3} oldValue={12} />);
    expect(container).toMatchSnapshot();
  });
});
