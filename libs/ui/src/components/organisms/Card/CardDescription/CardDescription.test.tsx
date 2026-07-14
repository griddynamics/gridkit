import { expect } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { CardDescription } from './CardDescription';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<CardDescription>Line 1</CardDescription>);
    expect(container).toMatchSnapshot();
  });
});
