import { expect } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { SearchModal } from './SearchModal';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const props = {};
    const { container } = render(<SearchModal {...props} />);
    expect(container).toMatchSnapshot();
  });
});
