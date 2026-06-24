import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Search } from './Search';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<Search />);
    expect(container).toMatchSnapshot();
  });
});
