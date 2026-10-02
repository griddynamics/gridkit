// Generated from libs/ui/src/components/atoms/Typography/Typography.stories.tsx; edit the source example or native-story adapter.
import * as fixtures from './fixtures/Typography.generated.js';
import { nativeMeta, nativeStory } from './native-story';
import { sectionedArgTypes } from './helpers';

const sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('Typography', {}));
const meta = {
  title: 'Atoms/Typography',
  tags: ['autodocs'],
  args: sourceMeta.args,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Typography with semantic overrides, combined style variants, disclaimer, display, heading, body, color, alignment, and accessibility options.',
      },
    },
  },
  argTypes: sourceMeta.argTypes,
  render: sourceMeta.render,
};
export default meta;
export const Default = { ...nativeStory(fixtures.Default, meta) };
export const AsCustomComponent = { ...nativeStory(fixtures.AsCustomComponent, meta) };
export const AsCustomHtmlTag = { ...nativeStory(fixtures.AsCustomHtmlTag, meta) };
export const CombinedStyleVariant = { ...nativeStory(fixtures.CombinedStyleVariant, meta) };
export const Disclaimers = { ...nativeStory(fixtures.Disclaimers, meta) };
export const Display = { ...nativeStory(fixtures.Display, meta) };
export const Heading = { ...nativeStory(fixtures.Heading, meta) };
export const Body = { ...nativeStory(fixtures.Body, meta) };
export const WithAccessibility = { ...nativeStory(fixtures.WithAccessibility, meta) };
export const DefaultTokens = { ...nativeStory(fixtures.DefaultTokens, meta) };
