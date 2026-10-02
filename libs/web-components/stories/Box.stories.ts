// Generated from libs/ui/src/components/atoms/Box/Box.stories.tsx; edit the source example or native-story adapter.
import * as fixtures from './fixtures/Box.generated.js';
import { nativeMeta, nativeStory } from './native-story';
import { sectionedArgTypes } from './helpers';

const sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('Box', {}));
const meta = {
  title: 'Atoms/Box',
  tags: ['autodocs'],
  args: sourceMeta.args,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Layout container with orientation, border, hover highlight, shadow, accessibility, and custom styling.',
      },
    },
  },
  argTypes: sourceMeta.argTypes,
  render: sourceMeta.render,
};
export default meta;
export const Default = { ...nativeStory(fixtures.Default, meta) };
export const Bordered = { ...nativeStory(fixtures.Bordered, meta) };
export const Highlighted = { ...nativeStory(fixtures.Highlighted, meta) };
export const WithShadowHover = { ...nativeStory(fixtures.WithShadowHover, meta) };
export const VerticalLayout = { ...nativeStory(fixtures.VerticalLayout, meta) };
export const HorizontalLayout = { ...nativeStory(fixtures.HorizontalLayout, meta) };
export const CenteredContent = { ...nativeStory(fixtures.CenteredContent, meta) };
export const Examples = { ...nativeStory(fixtures.Examples, meta) };
export const WithAccessibility = { ...nativeStory(fixtures.WithAccessibility, meta) };
export const DefaultTokens = { ...nativeStory(fixtures.DefaultTokens, meta) };
