import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Box } from './Box';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(
      <Box flexDirection="column" justifyContent="center" alignItems="center" gap="10px">
        <div>Child 1</div>
        <div>Child 2</div>
      </Box>
    );
    expect(container).toMatchSnapshot();
  });
});
