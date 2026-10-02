import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdWrapper } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes } from './helpers';

type Args = Pick<GdWrapper, 'variant' | 'as' | 'styles'> & { children: string };
const meta = {
  title: 'Atoms/Wrapper',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A minimal token-backed layout wrapper with inline, section and full-page variants, semantic internal tag selection, slotted content, and style overrides.',
      },
    },
  },
  args: { variant: 'inline', as: 'div', children: 'This is a basic wrapper.' },
  argTypes: sectionedArgTypes('Wrapper', {
    variant: { description: 'Layout context', control: 'select', options: ['inline', 'section', 'fullPage'] },
    as: { description: 'Internal semantic HTML tag', control: 'text' },
    children: { description: 'Slotted content', control: 'text' },
    styles: { description: 'Custom wrapper styles', control: 'object' },
  }),
  render: ({ children, ...args }: Args) => element('gd-wrapper', args, children),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const InteractiveExample: Story = {
  name: 'Interactive Example',
  args: { styles: { padding: '20px', border: '2px dashed #007bff', borderRadius: '8px', backgroundColor: '#f0f8ff' } },
};
export const SectionWrapper: Story = {
  name: 'Variant: Section',
  args: {
    variant: 'section',
    children: 'This content is semantically grouped within a section element.',
    styles: { padding: '20px', width: '400px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' },
  },
};
export const InlineWrapper: Story = {
  name: 'Variant: Inline (Span)',
  args: {
    variant: 'inline',
    children: 'this part is wrapped in a span',
    styles: {
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: '#fffbe6',
      color: '#856404',
      fontWeight: 'bold',
    },
  },
};
export const FullPageWrapper: Story = {
  name: 'Variant: Full Page',
  args: {
    variant: 'fullPage',
    children: 'This wrapper covers the entire viewport.',
    styles: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  },
  parameters: { layout: 'fullscreen' },
};
export const CustomTagWrapper: Story = {
  name: 'Custom tag Wrapper',
  args: { as: 'section', children: 'Custom tag Wrapper' },
};
export const WithAccessibility: Story = {
  args: { 'aria-label': 'Content wrapper' } as never,
  parameters: { a11y: { test: 'error' }, docs: { disable: true } },
  tags: ['a11y'],
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('wrapper'),
};
