// Generated from libs/ui/src/components/atoms/Badge/Badge.stories.tsx; edit the source example or native-story adapter.
import * as fixtures from './fixtures/Badge.generated.js';
import { nativeMeta, nativeStory } from './native-story';
import { sectionedArgTypes } from './helpers';

const sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('Badge', {}));
const meta = {
  title: 'Atoms/Badge',
  tags: ['autodocs'],
  args: sourceMeta.args,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Status badge with variants, appearances, sizes, disabled state, icon positions, and style overrides.',
      },
    },
  },
  argTypes: sourceMeta.argTypes,
  render: sourceMeta.render,
};
export default meta;
export const Default = { ...nativeStory(fixtures.Default, meta) };
export const Sizes = { ...nativeStory(fixtures.Sizes, meta) };
export const Variants = { ...nativeStory(fixtures.Variants, meta) };
export const WithIcons = { ...nativeStory(fixtures.WithIcons, meta) };
export const WithBoxStyles = { ...nativeStory(fixtures.WithBoxStyles, meta) };
export const Disabled = { ...nativeStory(fixtures.Disabled, meta) };
export const WithAccessibility = { ...nativeStory(fixtures.WithAccessibility, meta) };
export const DefaultTokens = { ...nativeStory(fixtures.DefaultTokens, meta) };
