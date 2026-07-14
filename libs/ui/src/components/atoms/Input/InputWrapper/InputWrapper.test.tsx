import { describe, expect, it } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { InputWrapper } from './';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<InputWrapper width="50px">text node</InputWrapper>);
    expect(container).toMatchSnapshot();
  });
});
