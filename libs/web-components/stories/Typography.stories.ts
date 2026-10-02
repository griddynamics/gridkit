import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdTypography } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes } from './helpers';

type Args = Pick<GdTypography, 'variant' | 'as' | 'size' | 'align' | 'color' | 'styleVariant'> & { children: string };
const variants = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'small',
  'div',
  'span',
  'strong',
  'i',
  'code',
  'kbd',
  'caption',
  'header',
  'sup',
  'sub',
] as const;
const styleVariants = [
  'light',
  'normal',
  'semibold',
  'bold',
  'italic',
  'small',
  'uppercase',
  'lowercase',
  'underline',
  'strike',
] as const;
const typographyElement = ({ children, ...props }: Args, text = children) => element('gd-typography', props, text);
const meta = {
  title: 'Atoms/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Typography matching React semantic overrides, combined style variants, disclaimer, display, heading, body, color, alignment, and accessibility states.',
      },
    },
  },
  args: {
    variant: 'p',
    as: 'p',
    size: 'md',
    align: 'start',
    color: '',
    styleVariant: [],
    children: 'Body paragraph text for comparison.',
  },
  argTypes: sectionedArgTypes('Typography', {
    variant: { control: 'select', options: variants },
    as: { control: 'select', options: variants },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] },
    align: { control: 'select', options: ['start', 'end', 'center', 'left', 'right', 'justify'] },
    color: { control: 'color' },
    styleVariant: { control: 'multi-select', options: styleVariants },
  }),
  render: (args: Args) => typographyElement(args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Heading1: Story = { args: { variant: 'h1', as: 'h1', children: 'Heading 1' } };
export const Heading2: Story = { args: { variant: 'h2', as: 'h2', children: 'Heading 2' } };
export const AllVariants: Story = {
  render: (args) => {
    const section = document.createElement('section');
    section.style.cssText = 'display:grid;gap:8px';
    for (const variant of variants)
      section.append(typographyElement({ ...args, variant, as: variant }, `${variant} — GridKit typography`));
    return section;
  },
};
export const DisplaySizes: Story = {
  render: (args) => {
    const section = document.createElement('section');
    for (const size of ['xl', 'lg', 'md', 'sm', 'xs'] as const)
      section.append(typographyElement({ ...args, variant: 'div', as: 'div', size }, `Display ${size}`));
    return section;
  },
};
export const StyleVariants: Story = {
  render: (args) => {
    const section = document.createElement('section');
    section.style.cssText = 'display:grid;gap:8px';
    for (const styleVariant of styleVariants)
      section.append(typographyElement({ ...args, variant: 'p', as: 'p', styleVariant }, `${styleVariant} text`));
    section.append(
      typographyElement(
        { ...args, variant: 'p', as: 'p', styleVariant: ['bold', 'italic', 'underline'] },
        'Combined: bold + italic + underline'
      )
    );
    return section;
  },
};
export const SemanticOverride: Story = {
  args: { variant: 'h2', as: 'h3', children: 'H2 appearance rendered as an H3' },
};
export const CodeAndKeyboard: Story = {
  render: (args) => {
    const section = document.createElement('section');
    section.style.cssText = 'display:grid;gap:12px';
    section.append(typographyElement({ ...args, variant: 'code', as: 'code' }, 'const gridkit = true;'));
    section.append(typographyElement({ ...args, variant: 'kbd', as: 'kbd' }, '⌘ + K'));
    return section;
  },
};
export const CaptionAndHeader: Story = {
  render: (args) => {
    const section = document.createElement('section');
    section.append(typographyElement({ ...args, variant: 'caption', as: 'span' }, 'Caption text'));
    section.append(typographyElement({ ...args, variant: 'header', as: 'header' }, 'Header text'));
    return section;
  },
};
export const AsCustomComponent: Story = SemanticOverride;
export const AsCustomHtmlTag: Story = SemanticOverride;
export const CombinedStyleVariant: Story = StyleVariants;
export const Disclaimers: Story = CaptionAndHeader;
export const Display: Story = DisplaySizes;
export const Heading: Story = AllVariants;
export const Body: Story = { args: { variant: 'p', as: 'p', children: 'Body paragraph text' } };
export const WithAccessibility: Story = {
  args: { variant: 'h2', as: 'h2', children: 'Accessible section heading' },
};
export const DefaultTokens: Story = { render: () => defaultTokenViewer('typography') };
