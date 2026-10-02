import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdLoader } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes } from './helpers';

type Args = Pick<
  GdLoader,
  'name' | 'variant' | 'size' | 'rounded' | 'withWrapper' | 'wrapperAs' | 'animationProps' | 'styles'
> & { WrapperView?: keyof HTMLElementTagNameMap };
const meta = {
  title: 'Atoms/Loader',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Loading indicator matching React Loader circle/dots animations, five sizes, rounding, inline/section/full-page wrappers, custom animation timing, custom content, styles, and status accessibility.',
      },
    },
  },
  args: { name: 'circle', variant: 'inline', size: 'md', rounded: 'none', withWrapper: true },
  argTypes: sectionedArgTypes('Loader', {
    name: { control: 'select', options: ['circle', 'dots'] },
    variant: { control: 'select', options: ['inline', 'section', 'fullPage'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    rounded: {
      description: 'Radius token used by dot loaders',
      control: 'select',
      options: ['none', 'default', 'round', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    withWrapper: { description: 'Whether the positioning wrapper is rendered', control: 'boolean' },
    animationProps: { description: 'CSS animation timing, easing, and iteration values', control: 'text' },
    styles: { description: 'Custom loader style overrides', control: 'object' },
  }),
  render: ({ WrapperView, ...args }: Args) =>
    element('gd-loader', { ...args, wrapperAs: WrapperView ?? args.wrapperAs }),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const LoaderNames: Story = { args: { name: 'dots' } };
export const LoaderSizes: Story = { args: { size: 'xl' } };
export const LoaderRounded: Story = { args: { name: 'dots', rounded: 'round' } };
export const LoaderSectionVariant: Story = { args: { variant: 'section' } };
export const LoaderVariantsWithWrapperViewAsHeaderTag: Story = {
  args: { variant: 'inline', WrapperView: 'header' },
  parameters: {
    docs: {
      description: {
        story:
          'The React WrapperView prop maps to the Web Component wrapperAs property and composes gd-wrapper with a semantic header element.',
      },
    },
  },
};
export const CustomLoaderTailwindClassBounceAnimation: Story = {
  args: { name: 'dots', animationProps: '600ms ease-in-out infinite', styles: { color: '#7b2cbf' } },
};
export const SectionLoaderButtonVariant: Story = {
  render: (args) => {
    const button = element('gd-button', { variant: 'primary' }, 'Loading');
    button.append(element('gd-loader', { ...args, variant: 'section', size: 'sm' }));
    return button;
  },
};
export const InlineLoaderButtonVariant: Story = {
  render: (args) => {
    const button = element('gd-button', { variant: 'primary' }, 'Save ');
    button.append(element('gd-loader', { ...args, variant: 'inline', size: 'sm', withWrapper: false }));
    return button;
  },
};
export const WithAccessibility: Story = {
  render: (args) => {
    const loader = element('gd-loader', args);
    loader.setAttribute('aria-label', 'Saving changes');
    return loader;
  },
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('loader'),
};
