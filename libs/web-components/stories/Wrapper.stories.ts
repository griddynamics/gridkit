// Generated from libs/ui/src/components/atoms/Wrapper/Wrapper.stories.tsx; edit the source example or native-story adapter.
import * as fixtures from './fixtures/Wrapper.generated.js';
import { nativeMeta, nativeStory } from './native-story';
import { sectionedArgTypes } from './helpers';

const sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('Wrapper', {}));
const meta = {
  title: 'Atoms/Wrapper',
  tags: ['autodocs'],
  args: sourceMeta.args,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Layout wrapper with inline, section and full-page variants, semantic element selection, slotted content, and custom styling.',
      },
    },
  },
  argTypes: sourceMeta.argTypes,
  render: sourceMeta.render,
};
export default meta;
export const InteractiveExample = { ...nativeStory(fixtures.InteractiveExample, meta), name: 'Interactive Example' };
export const SectionWrapper = { ...nativeStory(fixtures.SectionWrapper, meta), name: 'Variant: Section' };
export const InlineWrapper = { ...nativeStory(fixtures.InlineWrapper, meta), name: 'Variant: Inline (Span)' };
export const FullPageWrapper = { ...nativeStory(fixtures.FullPageWrapper, meta), name: 'Variant: Full Page' };
export const CustomTagWrapper = { ...nativeStory(fixtures.CustomTagWrapper, meta), name: 'Custom tag Wrapper' };
export const WithAccessibility = { ...nativeStory(fixtures.WithAccessibility, meta) };
export const DefaultTokens = { ...nativeStory(fixtures.DefaultTokens, meta) };
