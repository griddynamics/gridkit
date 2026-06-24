import { expect } from 'vitest';
import { render } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { ChatBubble } from './ChatBubble';

describe(COMPONENT_NAME, () => {
  const props = {
    actions: [<div key="1">1</div>, <div key="2">2</div>, <div key="3">3</div>],
  };

  it('SHOULD match snapshot', () => {
    const { container } = render(
      <ChatBubble {...props}>
        Sure! Please paste the code you'd like me to convert, and I’ll generate the SVG file for you.
      </ChatBubble>
    );
    expect(container).toMatchSnapshot();
  });
});
