import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdInputFile } from '../src';
import { element, observed } from './helpers';

type Args = Pick<GdInputFile, 'accept' | 'capture' | 'multiple' | 'disabled' | 'isIcon' | 'buttonVariant'>;
const meta = {
  title: 'Atoms/InputFile',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'File picker matching React InputFile accept, capture, multiple, disabled, icon-label, button variant, custom styles, and accessibility behavior. Emits gd-change with serializable file metadata.',
      },
    },
  },
  args: { accept: '', capture: undefined, multiple: false, disabled: false, isIcon: false, buttonVariant: 'outlined' },
  argTypes: {
    accept: { description: 'Accepted file MIME types or extensions', control: 'text' },
    capture: {
      description: 'Preferred camera capture source',
      control: 'select',
      options: [undefined, 'user', 'environment'],
    },
    multiple: { description: 'Allows selection of multiple files', control: 'boolean' },
    disabled: { description: 'Disables the file picker', control: 'boolean' },
    isIcon: { description: 'Uses icon-only button sizing', control: 'boolean' },
    buttonVariant: {
      description: 'Visual variant passed to the internal button',
      control: 'select',
      options: ['primary', 'secondary', 'outlined'],
    },
  },
  render: (args: Args) => observed(element('gd-input-file', args), 'gd-change', { files: [] }),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Multiple: Story = { args: { multiple: true } };
export const WithAccept: Story = { args: { accept: 'image/*' } };
export const CustomLabel: Story = { render: (args) => element('gd-input-file', args, 'Choose documents') };
export const IconLabel: Story = {
  render: (args) => {
    const input = element('gd-input-file', { ...args, isIcon: true });
    input.append(element('gd-icon', { name: 'upload' }));
    return input;
  },
};
export const WithCustomStyles: Story = {
  render: (args) => element('gd-input-file', { ...args, styles: { borderRadius: '8px' } }, 'Styled file picker'),
};
export const WithAccessibility: Story = {
  render: (args) => {
    const input = element('gd-input-file', args, 'Upload résumé');
    input.setAttribute('aria-label', 'Upload résumé');
    return input;
  },
};
export const DefaultTokens: Story = {
  render: () => {
    const pre = document.createElement('pre');
    pre.textContent = 'defaultTheme.inputfile';
    return pre;
  },
};
