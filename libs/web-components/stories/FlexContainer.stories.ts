import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { defaultTokenViewer, element } from './helpers';
import { boxArgTypes, formattedSource, type BoxStoryArgs } from './layout-story-helpers';

type Args = BoxStoryArgs;

const meta = {
  title: 'Layout & Structure/FlexContainer',
  component: 'gd-flex-container',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A flexible layout container with custom styles, slotted children, the complete Box style surface, and native class and style attributes on the custom-element host.',
      },
    },
  },
  argTypes: boxArgTypes,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const justifyStartSource = `<gd-flex-container
  class="bg-gray-100 border border-gray-300"
  flex-direction="row"
  justify-content="flex-start"
  gap="8px"
  min-width="420px"
  padding="10px"
>
  <div style="padding: 6px 10px; background: #eef2ff; border-radius: 6px">Left</div>
  <div style="padding: 6px 10px; background: #e0f2fe; border-radius: 6px">Aligned</div>
  <div style="padding: 6px 10px; background: #dcfce7; border-radius: 6px">To Start</div>
</gd-flex-container>`;

export const Default: Story = {
  args: {
    gap: '8px',
    minWidth: '60vw',
    padding: '10px',
  },
  render: (args) => {
    const container = element('gd-flex-container', args);
    container.className = 'bg-gray-100 border border-gray-300';
    for (let index = 1; index <= 3; index += 1) {
      const paragraph = document.createElement('p');
      paragraph.textContent = `${index}. This is a container with maxWidth set to ${args.maxWidth}`;
      container.append(paragraph);
    }
    return container;
  },
  parameters: formattedSource(`
<gd-flex-container
  class="bg-gray-100 border border-gray-300"
  gap="8px"
  min-width="60vw"
  padding="10px"
>
  <p>1. This is a container with maxWidth set to undefined</p>
  <p>2. This is a container with maxWidth set to undefined</p>
  <p>3. This is a container with maxWidth set to undefined</p>
</gd-flex-container>
  `),
};

export const JustifyStart: Story = {
  args: {
    gap: '8px',
    minWidth: '420px',
    padding: '10px',
    flexDirection: 'row',
  },
  render: (args) => {
    const container = element('gd-flex-container', { ...args, justifyContent: 'flex-start' });
    container.className = 'bg-gray-100 border border-gray-300';
    for (const [label, background] of [
      ['Left', '#eef2ff'],
      ['Aligned', '#e0f2fe'],
      ['To Start', '#dcfce7'],
    ]) {
      const child = document.createElement('div');
      child.style.cssText = `padding:6px 10px;background:${background};border-radius:6px`;
      child.textContent = label;
      container.append(child);
    }
    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates horizontal alignment using the justify-content: flex-start Box style property.',
      },
      source: formattedSource(justifyStartSource).docs.source,
    },
  },
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('flexContainer'),
  parameters: formattedSource(`
import { defaultTheme } from 'gd-design-library/tokens';

console.log(defaultTheme.flexContainer);
  `),
};
