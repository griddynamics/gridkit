import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdBox, GdTruncate } from '../src';
import { element } from './helpers';
import { defined, storyParameters, typography } from './text-atoms-helpers';
import { defaultActions, lineTruncationActions, withCustomStylingActions } from './Truncate.stories.play';

type Args = Partial<Pick<GdTruncate, 'lines' | 'styles' | 'isTruncated'>> & { children?: string };

const truncate = ({ children, ...props }: Args) =>
  element('gd-truncate', defined(props) as Partial<GdTruncate>, children);

// The source stories wrap the truncated text in a Box that is half as wide as the canvas.
const centeredBox = (props: Partial<GdBox>, ...children: Node[]) => {
  const node = element('gd-box', props);
  node.append(...children);
  return node;
};

const meta = {
  title: 'Atoms/Truncate',
  component: 'gd-truncate',
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      table: {
        category: 'Content',
      },
      description: 'Content to display (default slot). Accepts string text or any node for flexible content.',
    },
    lines: {
      control: { type: 'number' },
      table: {
        defaultValue: { summary: '1' },
        category: 'Truncation',
      },
      description: 'Number of lines before truncation (default: 1)',
    },
    styles: {
      control: { type: 'object' },
      table: {
        defaultValue: { summary: '{}' },
        category: 'Appearance',
      },
      description:
        'Custom CSS styles object for one-off styling needs. Accepts a CSS object with camelCase property names.',
    },
    isTruncated: {
      control: false,
      description:
        'Read-only property providing access to the truncation state. `isTruncated` (boolean) indicates if content is truncated. Useful for conditionally showing tooltips or for analytics.',
      table: {
        category: 'Ref API',
        type: {
          summary: 'boolean',
          detail: 'Read from the element: truncate.isTruncated',
        },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Truncate\` component provides uniform text truncation with line-based truncation support.
It ensures consistent visual alignment in lists, tables, or any component that requires text truncation.
<br/><br/>

<h3>🎯 Core Features</h3>
<ul>
  <li><b>Line-based Truncation</b> – Truncate text by number of lines using the \`lines\` prop (uses CSS line-clamp)</li>
  <li><b>Element API</b> – Access truncation state through the element: \`isTruncated\` (boolean)</li>
  <li><b>Children Support</b> – Accepts string text or nodes as slotted content for flexible content</li>
</ul>

<h3>💡 Usage Guidelines</h3>
<ul>
  <li>Use \`lines\` prop to specify the maximum number of lines (default: 1)</li>
  <li>Access truncation state programmatically via the element for charts and analytics</li>
  <li>Wrap the component in a container with fixed width to see truncation behavior</li>
</ul>
        `,
      },
    },
  },
  render: (args: Args) => truncate(args),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const boxedTruncate = (args: Args) => centeredBox({ width: '50%', margin: '0 auto' }, truncate(args));

export const Default: Story = {
  render: boxedTruncate,
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  parameters: storyParameters(
    `
Line-based truncation limits text to a maximum number of lines.
When text exceeds the specified number of lines, it's truncated and an ellipsis symbol is appended.
      `,
    `<gd-box width="50%" margin="0 auto">
  <gd-truncate>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </gd-truncate>
</gd-box>`
  ),
  play: defaultActions,
};

export const LineTruncation: Story = {
  render: boxedTruncate,
  args: {
    children: 'This is a very long text that will wrap to multiple ',
    lines: 2,
  },
  parameters: storyParameters(
    `
Line-based truncation uses CSS line-clamp to limit text to a specific number of lines.
The ellipsis is automatically handled by CSS, ensuring proper visual truncation.
      `,
    `<gd-box width="50%" margin="0 auto">
  <gd-truncate lines="2">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </gd-truncate>
</gd-box>`
  ),
  play: lineTruncationActions,
};

export const WithCustomStyling: Story = {
  render: boxedTruncate,
  args: {
    children:
      'This text has custom styling applied via the styles prop. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    styles: {
      color: '#dc2626',
      fontWeight: 600,
      fontSize: '18px',
    },
  },
  play: withCustomStylingActions,
  parameters: storyParameters(
    `
The \`styles\` property allows you to apply custom CSS styling to the truncated text using a CSS object.
This is useful for one-off styling needs like custom colors, font sizes, weights, or other CSS properties
while maintaining the truncation behavior.
      `,
    `<gd-box width="50%" margin="0 auto">
  <gd-truncate id="truncate">
    This text has custom styling applied via the styles prop.
  </gd-truncate>
</gd-box>

<script type="module">
  document.querySelector('#truncate').styles = {
    color: '#dc2626',
    fontWeight: 600,
    fontSize: '18px',
  };
</script>`
  ),
};

export const RefAPIWithTooltipOnOverflow: Story = {
  render: () => {
    const content = truncate({
      children:
        '(Resize window): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt',
    });
    // There is no tooltip element: the native `title` tooltip shows the message while the content is truncated.
    const tooltipWrapper = document.createElement('div');
    tooltipWrapper.setAttribute('data-testid', 'Tooltip-wrapper');
    tooltipWrapper.append(content);

    const state = document.createTextNode('false');
    const stateBox = centeredBox(
      { padding: '12px', styles: { backgroundColor: '#f0f0f0', borderRadius: '4px' } },
      typography(
        { variant: 'small' },
        typography({ variant: 'strong' }, 'Ref API State:'),
        document.createElement('br'),
        'isTruncated: ',
        state
      )
    );
    const root = centeredBox({ width: '100%', margin: '0 auto' }, tooltipWrapper, stateBox);

    const updateState = () => {
      const isTruncated = (content as GdTruncate).isTruncated;
      state.data = isTruncated ? 'true' : 'false';
      if (isTruncated) tooltipWrapper.title = 'Content is truncated';
      else tooltipWrapper.removeAttribute('title');
    };
    // Ref values are calculated asynchronously after the first render, so the state is read after a delay,
    // on window resize and periodically as a fallback.
    requestAnimationFrame(() => setTimeout(updateState));
    window.addEventListener('resize', updateState);
    let wasConnected = false;
    const intervalId = setInterval(() => {
      if (root.isConnected) {
        wasConnected = true;
        updateState();
      } else if (wasConnected) {
        clearInterval(intervalId);
        window.removeEventListener('resize', updateState);
      }
    }, 200);
    return root;
  },
  parameters: storyParameters(
    `
Access truncation state programmatically via the \`isTruncated\` property and conditionally show a tooltip when content is truncated. The element exposes:
- \`isTruncated\`: boolean indicating if the content is truncated
<br/><br/>
**Note:** The state is calculated asynchronously after the component renders and truncation is measured. The example includes a delay to ensure the state is properly updated. Try resizing the window to see the state update dynamically.
      `,
    `<gd-box width="100%" margin="0 auto">
  <div id="tooltip-wrapper">
    <gd-truncate id="truncate">
      (Resize window): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
    </gd-truncate>
  </div>
  <gd-box padding="12px">
    <gd-typography variant="small">
      <gd-typography variant="strong">Ref API State:</gd-typography>
      <br />
      isTruncated: <span id="state">false</span>
    </gd-typography>
  </gd-box>
</gd-box>

<script type="module">
  const truncate = document.querySelector('#truncate');
  const wrapper = document.querySelector('#tooltip-wrapper');
  const state = document.querySelector('#state');

  const updateState = () => {
    state.textContent = truncate.isTruncated ? 'true' : 'false';
    wrapper.title = truncate.isTruncated ? 'Content is truncated' : '';
  };

  // Check after a delay to allow the element's internal calculation to complete
  requestAnimationFrame(() => setTimeout(updateState));

  // Check on window resize
  window.addEventListener('resize', updateState);
</script>`
  ),
};

export const WithAccessibility: Story = {
  args: Default.args,
  parameters: {
    ...Default.parameters,
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
  play: Default.play,
  tags: ['a11y'],
};
