import { expect } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { DragAndDropFiles } from './DragAndDropFiles';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const props = {};
    const { container } = render(<DragAndDropFiles {...props} />);
    expect(container).toMatchSnapshot();
  });
});
