// Generated from libs/ui/src/components/atoms/Link/Link.stories.tsx; edit the source example or native-story adapter.
import * as fixtures from './fixtures/Link.generated.js';
import { nativeMeta, nativeStory } from './native-story';
import { sectionedArgTypes } from './helpers';

const sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('Link', {}));
const meta = {
  title: 'Atoms/Link',
  tags: ['autodocs'],
  args: sourceMeta.args,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Native anchor with variants, sizes, underline modes, colors, disabled behavior, targets, custom styling, accessibility, and child composition.',
      },
    },
  },
  argTypes: sourceMeta.argTypes,
  render: sourceMeta.render,
};
export default meta;
export const Variants = { ...nativeStory(fixtures.Variants, meta) };
export const Disabled = { ...nativeStory(fixtures.Disabled, meta) };
export const TargetBlankVisited = { ...nativeStory(fixtures.TargetBlankVisited, meta) };
export const InheritWithButtonAsChild = { ...nativeStory(fixtures.InheritWithButtonAsChild, meta) };
export const Inverted = { ...nativeStory(fixtures.Inverted, meta) };
export const InheritWithTypographyAsChild = { ...nativeStory(fixtures.InheritWithTypographyAsChild, meta) };
export const CustomStyles = { ...nativeStory(fixtures.CustomStyles, meta) };
export const WithUnderline = { ...nativeStory(fixtures.WithUnderline, meta) };
export const WithSizes = { ...nativeStory(fixtures.WithSizes, meta) };
export const WithAccessibility = { ...nativeStory(fixtures.WithAccessibility, meta) };
export const DefaultTokens = { ...nativeStory(fixtures.DefaultTokens, meta) };
