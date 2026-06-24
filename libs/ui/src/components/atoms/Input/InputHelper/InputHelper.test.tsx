import { describe, expect, it } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { InputHelper } from './';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<InputHelper>text node</InputHelper>);
    expect(container).toMatchSnapshot();
  });
});
