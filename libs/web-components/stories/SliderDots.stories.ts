import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { action } from 'storybook/actions';
import type { GdColumn, GdSliderDots, GdTypography } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { formattedSource } from './layout-story-helpers';
import { defaultActions, interactiveActions, manyDotsActions } from './SliderDots.stories.play';

// `gd-change` only documents the element's event in the controls table; it is never passed to the element.
type Args = Pick<GdSliderDots, 'count' | 'activeIndex'> & { 'gd-change'?: unknown };

const meta = {
  title: 'Atoms/SliderDots',
  component: 'gd-slider-dots',
  argTypes: {
    // Core Properties
    count: {
      description: 'Total number of dots to render',
      control: { type: 'number' },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
        category: 'Core Properties',
      },
    },
    activeIndex: {
      description: 'Index of the currently active dot (zero-based)',
      control: { type: 'number' },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
        category: 'Core Properties',
      },
    },

    // Events & Callbacks
    'gd-change': {
      description: 'Event fired when a dot is clicked, `event.detail.index` is the dot index',
      table: {
        type: { summary: 'CustomEvent<{ index: number }>' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
  },
  args: {
    count: 5,
    activeIndex: 0,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`gd-slider-dots\` element renders a set of navigation dots commonly used with carousels, sliders, or paginated content.
<br/>
<br/>
<h3>Key Features:</h3>
<ul>
<li>
<b>Navigation</b>
<ul>
<li>Click any dot to navigate to the corresponding slide</li>
<li>The <code>gd-change</code> event provides the clicked dot index</li>
</ul>
</li>
<li>
<b>Active State</b>
<ul>
<li>Visually highlights the currently active dot</li>
<li>Controlled via the <code>activeIndex</code> property</li>
</ul>
</li>
<li><b>Accessibility</b> – Uses <code>role="tablist"</code> and <code>role="tab"</code> with ARIA labels</li>
<li><b>Theming</b> – Customizable via theme tokens for default and active dot styles</li>
</ul>
<br/>
<h3>Styling:</h3>
<ul>
<li><b>Theme Tokens</b>
<ul>
<li><code>sliderDots.dot.default</code> - Default dot appearance</li>
<li><code>sliderDots.dot.active</code> - Active dot appearance</li>
</ul>
</li>
</ul>
        `,
      },
    },
  },
  // The active dot is owned by the story arguments: clicking a dot reports its index and leaves the
  // active dot to the `activeIndex` argument.
  render: ({ count, activeIndex }: Args) => {
    const dots = element('gd-slider-dots', { count, activeIndex });
    dots.addEventListener('gd-change', (event) => {
      action('Dot clicked')((event as CustomEvent<{ index: number }>).detail.index);
      dots.activeIndex = activeIndex;
    });
    return dots;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    count: 5,
    activeIndex: 0,
  },
  play: defaultActions,
  parameters: {
    docs: {
      description: {
        story: 'Default slider dots with 5 dots and the first dot active.',
      },
      ...formattedSource(`<gd-slider-dots count="5" active-index="0"></gd-slider-dots>`).docs,
    },
  },
};

export const Interactive: Story = {
  play: interactiveActions,
  render: () => {
    const label = element('gd-typography') as GdTypography;
    const showActive = (index: number) => label.replaceChildren('Active slide: ', String(index + 1), ' of 5');
    showActive(0);
    const dots = element('gd-slider-dots', { count: 5, activeIndex: 0 });
    dots.addEventListener('gd-change', (event) => {
      const { index } = (event as CustomEvent<{ index: number }>).detail;
      action('onDotClick')(index);
      dots.activeIndex = index;
      showActive(index);
    });
    const column = element('gd-column', { gap: '16px', align: 'center' }) as GdColumn;
    column.append(label, dots);
    return column;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive slider dots with state management. Click any dot to change the active slide. The `gd-change` event updates the parent state.',
      },
      ...formattedSource(`<gd-column gap="16px" align="center">
  <gd-typography id="label">Active slide: 1 of 5</gd-typography>
  <gd-slider-dots id="dots" count="5" active-index="0"></gd-slider-dots>
</gd-column>

<script type="module">
  import 'web-components';
  import { defaultTheme } from 'gd-design-library/tokens';

  const label = document.querySelector('#label');
  const dots = document.querySelector('#dots');
  for (const node of document.querySelectorAll('gd-column, gd-typography, gd-slider-dots')) node.theme = defaultTheme;

  dots.addEventListener('gd-change', (event) => {
    const { index } = event.detail;
    console.log('Dot clicked:', index);
    dots.activeIndex = index;
    label.textContent = \`Active slide: \${index + 1} of 5\`;
  });
</script>`).docs,
    },
  },
};

export const ManyDots: Story = {
  args: {
    count: 10,
    activeIndex: 4,
  },
  play: manyDotsActions,
  parameters: {
    docs: {
      description: {
        story:
          'Slider dots with a larger number of dots (10), with the 5th dot active. Useful for testing layout behavior with many items.',
      },
      ...formattedSource(`<gd-slider-dots count="10" active-index="4"></gd-slider-dots>`).docs,
    },
  },
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('sliderDots'),
  parameters: {
    layout: 'padded',
  },
};
