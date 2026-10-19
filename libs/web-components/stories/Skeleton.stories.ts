import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdSkeleton } from '../src';
import { defaultTokenViewer, element } from './helpers';

type Args = Pick<
  GdSkeleton,
  'variant' | 'width' | 'height' | 'backgroundColor' | 'animationName' | 'animationProps' | 'styles'
>;
const meta = {
  title: 'Atoms/Skeleton',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A theme-aware animated loading placeholder with rounded, rectangular, and circular shapes, flexible dimensions, custom colors and animations, and slotted child content.',
      },
    },
  },
  argTypes: {
    variant: {
      description: 'Controls the shape of the skeleton.',
      control: 'select',
      options: ['rounded', 'rectangular', 'circular'],
    },
    width: { description: 'Sets the width using any valid CSS width.', control: 'text' },
    height: { description: 'Sets the height using any valid CSS height.', control: 'text' },
    backgroundColor: { description: 'A CSS color or GridKit theme/palette color path.', control: 'text' },
    animationName: {
      description: 'A theme animation token, raw CSS animation name, or null to disable animation.',
      control: 'text',
    },
    animationProps: { description: 'Animation duration, easing, delay, and iteration string.', control: 'text' },
    styles: { description: 'Custom CSS properties applied to the skeleton.', control: 'object' },
  },
  render: (args: Args) => element('gd-skeleton', args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { width: '250px', height: '15px', variant: 'rounded' },
  parameters: { docs: { description: { story: 'The standard rounded skeleton for text-line placeholders.' } } },
};
export const Circular: Story = {
  args: { width: '80px', height: '80px', variant: 'circular' },
  parameters: { docs: { description: { story: 'A circular placeholder for avatars and icons.' } } },
};
export const Rectangular: Story = {
  args: { width: '250px', height: '125px', variant: 'rectangular' },
  parameters: { docs: { description: { story: 'A rectangular placeholder for images, cards, and video.' } } },
};
export const WithThemeColor: Story = {
  args: { width: '250px', height: '40px', variant: 'rectangular', backgroundColor: 'theme.palette.success.main' },
  parameters: { docs: { description: { story: 'Uses the top-level theme-aware backgroundColor property.' } } },
};
export const WithCustomAnimation: Story = {
  name: 'Animation with Tailwind Class',
  args: { width: '250px', height: '15px', animationName: null },
  render: (args) => {
    const wrapper = document.createElement('div');
    const styles = document.createElement('style');
    styles.textContent = `
      @keyframes gd-story-skeleton-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      gd-skeleton.animate-pulse::part(skeleton) {
        animation: gd-story-skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    `;
    const skeleton = element('gd-skeleton', args);
    skeleton.className = 'animate-pulse';
    wrapper.append(styles, skeleton);
    return wrapper;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disables the built-in animation and applies the same animate-pulse behavior through the exposed skeleton CSS part.',
      },
    },
  },
};
export const WithChildren: Story = {
  name: 'Skeleton with Child Content',
  render: (args) => {
    const skeleton = element('gd-skeleton', { ...args, width: '250px', height: '50px' });
    skeleton.append(element('gd-typography', { variant: 'small' }, 'Loading Content...'));
    return skeleton;
  },
  parameters: {
    docs: { description: { story: 'The default slot preserves child content inside the animated wrapper.' } },
  },
};
export const ComposedLayout: Story = {
  name: 'Example: Article Placeholder',
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'max-width:480px;width:100%';

    const column = element('gd-column', { gutter: 10 });
    const header = element('gd-row', { gutter: 10, justify: 'between', align: 'center' });
    const avatarColumn = element('gd-column');
    avatarColumn.append(element('gd-skeleton', { variant: 'circular', styles: { width: '100px', height: '100px' } }));

    const textColumn = element('gd-column', { flex: '1' });
    for (const variant of ['h3', 'p', 'small'] as const) {
      // The source story renders the h3 token's 16px margin because it wins the style
      // cascade over `marginBottom: 10px`; preserve that rendered geometry here.
      const typography = element('gd-typography', {
        variant,
        styles: { marginBottom: variant === 'h3' ? '16px' : '10px' },
      });
      typography.append(element('gd-skeleton'));
      textColumn.append(typography);
    }
    header.append(avatarColumn, textColumn);
    column.append(header);
    wrapper.append(column);

    const footer = element('gd-row', { gutter: 10, align: 'center', styles: { marginTop: '20px' } });
    for (let index = 0; index < 3; index += 1) {
      const typography = element('gd-typography', {
        variant: 'p',
        styles: { width: '100%', ...(index === 2 ? { marginBottom: '10px' } : {}) },
      });
      typography.append(element('gd-skeleton'));
      footer.append(typography);
    }
    wrapper.append(footer);
    return wrapper;
  },
  parameters: { docs: { description: { story: 'Composes multiple skeletons as an article or profile placeholder.' } } },
};
export const WithAccessibility: Story = {
  ...Default,
  args: { ...Default.args, 'aria-label': 'Loading content' } as never,
  parameters: { a11y: { test: 'error' }, docs: { disable: true } },
  tags: ['a11y'],
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('skeleton'),
  parameters: { layout: 'padded' },
};
