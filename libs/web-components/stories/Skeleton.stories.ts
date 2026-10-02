// Generated from libs/ui/src/components/atoms/Skeleton/Skeleton.stories.tsx; edit the source example or native-story adapter.
import * as fixtures from './fixtures/Skeleton.generated.js';
import { nativeMeta, nativeStory } from './native-story';
import { sectionedArgTypes } from './helpers';

const sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('Skeleton', {}));
const meta = {
  title: 'Atoms/Skeleton',
  tags: ['autodocs'],
  args: sourceMeta.args,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Loading placeholder with rounded, rectangular and circular variants, theme colors, child content, composed layouts, and accessibility semantics.',
      },
    },
  },
  argTypes: sourceMeta.argTypes,
  render: sourceMeta.render,
};
export default meta;
export const Default = { ...nativeStory(fixtures.Default, meta) };
export const Circular = { ...nativeStory(fixtures.Circular, meta) };
export const Rectangular = { ...nativeStory(fixtures.Rectangular, meta) };
export const WithThemeColor = { ...nativeStory(fixtures.WithThemeColor, meta) };
export const WithChildren = { ...nativeStory(fixtures.WithChildren, meta), name: 'Skeleton with Child Content' };
export const ComposedLayout = { ...nativeStory(fixtures.ComposedLayout, meta), name: 'Example: Article Placeholder' };
export const WithAccessibility = { ...nativeStory(fixtures.WithAccessibility, meta) };
export const DefaultTokens = { ...nativeStory(fixtures.DefaultTokens, meta) };
