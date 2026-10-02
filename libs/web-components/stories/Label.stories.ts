// Generated from libs/ui/src/components/atoms/Label/Label.stories.tsx; edit the source example or native-story adapter.
import * as fixtures from './fixtures/Label.generated.js';
import { nativeMeta, nativeStory } from './native-story';
import { sectionedArgTypes } from './helpers';

const sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('Label', {}));
const meta = {
  title: 'Atoms/Label',
  tags: ['autodocs'],
  args: sourceMeta.args,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Native label with slotted content, child icons, custom styling, control association, and accessibility semantics.',
      },
    },
  },
  argTypes: sourceMeta.argTypes,
  render: sourceMeta.render,
};
export default meta;
export const LabelDefault = { ...nativeStory(fixtures.LabelDefault, meta) };
export const LabelWithChildIcon = { ...nativeStory(fixtures.LabelWithChildIcon, meta) };
export const CustomStyles = { ...nativeStory(fixtures.CustomStyles, meta) };
export const WithAccessibility = { ...nativeStory(fixtures.WithAccessibility, meta) };
export const DefaultTokens = { ...nativeStory(fixtures.DefaultTokens, meta) };
