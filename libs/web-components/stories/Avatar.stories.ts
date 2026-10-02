// Generated from libs/ui/src/components/atoms/Avatar/Avatar.stories.tsx; edit the source example or native-story adapter.
import * as fixtures from './fixtures/Avatar.generated.js';
import { nativeMeta, nativeStory } from './native-story';
import { sectionedArgTypes } from './helpers';

const sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('Avatar', {}));
const meta = {
  title: 'Atoms/Avatar',
  tags: ['autodocs'],
  args: sourceMeta.args,
  parameters: sourceMeta.parameters,
  argTypes: sourceMeta.argTypes,
  render: sourceMeta.render,
};
export default meta;
export const Default = { ...nativeStory(fixtures.Default, meta) };
export const WithBadge = { ...nativeStory(fixtures.WithBadge, meta) };
export const WithCustomBadgeColor = { ...nativeStory(fixtures.WithCustomBadgeColor, meta) };
export const WithInitials = { ...nativeStory(fixtures.WithInitials, meta) };
export const WithCustomBackgroundColor = { ...nativeStory(fixtures.WithCustomBackgroundColor, meta) };
export const WithIcon = { ...nativeStory(fixtures.WithIcon, meta) };
export const WithImageAndFallback = { ...nativeStory(fixtures.WithImageAndFallback, meta) };
export const WithDifferentSize = { ...nativeStory(fixtures.WithDifferentSize, meta) };
export const WithAccessibility = { ...nativeStory(fixtures.WithAccessibility, meta) };
export const DefaultTokens = { ...nativeStory(fixtures.DefaultTokens, meta) };
