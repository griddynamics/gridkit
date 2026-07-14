import { expect } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { SearchInput } from './SearchInput';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const props = {};
    const { container } = render(<SearchInput {...props} />);
    expect(container).toMatchSnapshot();
  });
});
