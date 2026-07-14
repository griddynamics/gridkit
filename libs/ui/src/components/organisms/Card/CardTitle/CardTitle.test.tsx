import { expect } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { CardTitle } from './CardTitle';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<CardTitle>Sample Card Title</CardTitle>);
    expect(container).toMatchSnapshot();
  });
});
