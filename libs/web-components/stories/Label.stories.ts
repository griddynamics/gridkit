import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdLabel } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes } from './helpers';

type Args = Pick<GdLabel, 'htmlFor' | 'styles'>;
const meta = {
  title: 'Atoms/Label',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Native label matching React Label content, child icons, custom styles, control association, and accessibility semantics.',
      },
    },
  },
  args: { htmlFor: 'example' },
  argTypes: sectionedArgTypes('Label', {
    htmlFor: { description: 'ID of the associated form control', control: 'text' },
    styles: { description: 'Custom inline style overrides', control: 'object' },
  }),
  render: (args: Args) => element('gd-label', args, 'Field label'),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const LabelDefault: Story = {};
export const LabelWithChildIcon: Story = {
  render: (args) => {
    const label = element('gd-label', args, 'Label ');
    label.prepend(element('gd-icon', { name: 'star' }), document.createTextNode(' '));
    return label;
  },
};
export const CustomStyles: Story = { args: { styles: { color: '#0069b4', fontWeight: 700, gap: '8px' } } };
export const DefaultWithTailwind: Story = {
  args: { styles: { fontSize: '18px', color: '#1f843a' } },
  parameters: {
    docs: { description: { story: 'Framework-neutral style properties reproduce the React utility-class example.' } },
  },
};
export const WithAccessibility: Story = {
  render: (args) => {
    const root = document.createElement('div');
    const label = element('gd-label', { ...args, htmlFor: 'label-story-input' }, 'Email address');
    const input = document.createElement('input');
    input.id = 'label-story-input';
    root.append(label, input);
    return root;
  },
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('label'),
};
