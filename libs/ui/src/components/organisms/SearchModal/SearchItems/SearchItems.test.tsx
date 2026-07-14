import { expect } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { SearchItems } from './SearchItems';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const props = {};
    const { container } = render(<SearchItems {...props} />);
    expect(container).toMatchSnapshot();
  });
});
