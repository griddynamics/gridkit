import { expect } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { SearchLoader } from './SearchLoader';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const props = { itemsCount: 3 };
    const { container } = render(<SearchLoader {...props} />);
    expect(container).toMatchSnapshot();
  });
});
