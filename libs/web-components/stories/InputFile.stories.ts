// Generated from libs/ui/src/components/atoms/InputFile/InputFile.stories.tsx; edit the source example or native-story adapter.
import * as fixtures from './fixtures/InputFile.generated.js';
import { nativeMeta, nativeStory } from './native-story';
import { sectionedArgTypes } from './helpers';

const sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('InputFile', {}));
const meta = {
  title: 'Atoms/InputFile',
  tags: ['autodocs'],
  args: sourceMeta.args,
  parameters: sourceMeta.parameters,
  argTypes: sourceMeta.argTypes,
  render: sourceMeta.render,
};
export default meta;
export const Default = { ...nativeStory(fixtures.Default, meta) };
export const Disabled = { ...nativeStory(fixtures.Disabled, meta) };
export const Multiple = { ...nativeStory(fixtures.Multiple, meta) };
export const WithAccept = { ...nativeStory(fixtures.WithAccept, meta) };
export const CustomLabel = { ...nativeStory(fixtures.CustomLabel, meta) };
export const IconLabel = { ...nativeStory(fixtures.IconLabel, meta) };
export const WithCustomStyles = { ...nativeStory(fixtures.WithCustomStyles, meta) };
export const WithAccessibility = { ...nativeStory(fixtures.WithAccessibility, meta) };
export const DefaultTokens = { ...nativeStory(fixtures.DefaultTokens, meta) };
