// Generated from libs/ui/src/components/molecules/Counter/Counter.stories.tsx; edit the source example or native-story adapter.
import * as fixtures from './fixtures/Counter.generated.js';
import { nativeMeta, nativeStory } from './native-story';
import { sectionedArgTypes } from './helpers';

const sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('Counter', {}));
const meta = {
  title: 'Molecules/Counter',
  tags: ['autodocs'],
  args: sourceMeta.args,
  parameters: sourceMeta.parameters,
  argTypes: sourceMeta.argTypes,
  render: sourceMeta.render,
};
export default meta;
export const Default = { ...nativeStory(fixtures.Default, meta) };
export const AdjustedMaxValue5 = { ...nativeStory(fixtures.AdjustedMaxValue5, meta) };
export const AdjustedMinValue3 = { ...nativeStory(fixtures.AdjustedMinValue3, meta) };
export const AdjustedMin2MaxValue10 = { ...nativeStory(fixtures.AdjustedMin2MaxValue10, meta) };
export const WithExternalCounterChangeHandler = { ...nativeStory(fixtures.WithExternalCounterChangeHandler, meta) };
export const Disabled = { ...nativeStory(fixtures.Disabled, meta) };
export const DefaultTokens = { ...nativeStory(fixtures.DefaultTokens, meta) };
