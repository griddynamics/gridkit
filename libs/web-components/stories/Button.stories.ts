// Generated from libs/ui/src/components/atoms/Button/Button.stories.tsx; edit the source example or native-story adapter.
import * as fixtures from './fixtures/Button.generated.js';
import { nativeMeta, nativeStory } from './native-story';
import { sectionedArgTypes } from './helpers';

const sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('Button', {}));
const meta = {
  title: 'Atoms/Button',
  tags: ['autodocs'],
  args: sourceMeta.args,
  parameters: sourceMeta.parameters,
  argTypes: sourceMeta.argTypes,
  render: sourceMeta.render,
};
export default meta;
export const Default = { ...nativeStory(fixtures.Default, meta) };
export const AllVariants = { ...nativeStory(fixtures.AllVariants, meta) };
export const WithIcons = { ...nativeStory(fixtures.WithIcons, meta) };
export const IconOnly = { ...nativeStory(fixtures.IconOnly, meta) };
export const FullWidthButton = { ...nativeStory(fixtures.FullWidthButton, meta) };
export const RoundedButton = { ...nativeStory(fixtures.RoundedButton, meta) };
export const DisabledButton = { ...nativeStory(fixtures.DisabledButton, meta) };
export const ButtonStatesUsingClass = { ...nativeStory(fixtures.ButtonStatesUsingClass, meta) };
export const CustomStyledButton = { ...nativeStory(fixtures.CustomStyledButton, meta) };
export const RealWorldExamples = { ...nativeStory(fixtures.RealWorldExamples, meta) };
export const IsLoading = { ...nativeStory(fixtures.IsLoading, meta) };
export const WithAccessibility = { ...nativeStory(fixtures.WithAccessibility, meta) };
export const DefaultTokens = { ...nativeStory(fixtures.DefaultTokens, meta) };
