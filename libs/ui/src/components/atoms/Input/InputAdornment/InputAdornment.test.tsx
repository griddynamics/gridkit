import { describe, expect, it } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { InputAdornment } from './';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<InputAdornment>text node</InputAdornment>);
    expect(container).toMatchSnapshot();
  });
});
