// Generated from libs/ui/src/components/atoms/Loader/Loader.stories.tsx; edit the source example or native-story adapter.
import * as fixtures from './fixtures/Loader.generated.js';
import { nativeMeta, nativeStory } from './native-story';
import { sectionedArgTypes } from './helpers';

const sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('Loader', {}));
const meta = {
  title: 'Atoms/Loader',
  tags: ['autodocs'],
  args: sourceMeta.args,
  parameters: sourceMeta.parameters,
  argTypes: sourceMeta.argTypes,
  render: sourceMeta.render,
};
export default meta;
export const Default = { ...nativeStory(fixtures.Default, meta) };
export const LoaderNames = { ...nativeStory(fixtures.LoaderNames, meta) };
export const LoaderSizes = { ...nativeStory(fixtures.LoaderSizes, meta) };
export const LoaderRounded = { ...nativeStory(fixtures.LoaderRounded, meta) };
export const LoaderVariantsWithWrapperViewAsHeaderTag = {
  ...nativeStory(fixtures.LoaderVariantsWithWrapperViewAsHeaderTag, meta),
};
export const WithAccessibility = { ...nativeStory(fixtures.WithAccessibility, meta) };
export const DefaultTokens = { ...nativeStory(fixtures.DefaultTokens, meta) };
