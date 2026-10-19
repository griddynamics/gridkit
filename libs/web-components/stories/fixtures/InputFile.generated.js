// Generated from libs/ui/src/components/atoms/InputFile/InputFile.stories.tsx. Run npm run generate:web-component-stories.
// Native DOM recipes only: no React runtime or React component implementation is imported.
import { demo, Fragment } from '../native-story';
import { defaultTheme } from 'gd-design-library/tokens';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
const COMPONENT_NAME = 'InputFile';
const InputFile = 'gd-input-file';
const Icon = 'gd-icon';
const TokenViewer = 'TokenViewer';
const meta = {
  title: 'Atoms/InputFile',
  component: InputFile,
  args: {
    accept: undefined,
    capture: undefined,
    multiple: false,
    disabled: false,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`InputFile\` component provides an enhanced file upload experience by combining a hidden native file input with a customizable button interface. This component follows design system guidelines while maintaining full browser file handling capabilities.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>File Selection</b>
  <ul>
  <li>Flexible file selection with support for single or multiple files</li>
  <li>Comprehensive file type filtering through MIME types or extensions</li>
  <li>Direct camera/microphone access on mobile devices via capture attribute</li>
  </ul>
  </li>
  <li>
  <b>Customization</b>
  <ul>
  <li>Extensive button styling options through ButtonProps interface</li>
  <li>Support for both text and icon-based labels</li>
  <li>Full control over wrapper styling using design tokens</li>
  </ul>
  </li>
  <li><b>Accessibility</b> - Fully accessible implementation with proper ARIA attributes and keyboard navigation</li>
  <li><b>State Management</b> - Comprehensive disabled state handling across all interactive elements</li>
  </ul>
  <br/>
  <h3>Usage Examples:</h3>
  <ul>
  <li>Basic file upload: \`<InputFile onChange={(e) => console.log(e.target.files)} />\`</li>
  <li>Image selection: \`<InputFile accept="image/*" capture="environment" />\`</li>
  <li>Enhanced styling: \`<InputFile styles={{border: '2px dashed', borderRadius: '8px'}} />\`</li>
  <li>Icon integration: \`<InputFile buttonProps={{variant: 'contained'}}><Icon name="upload"/></InputFile>\`</li>
  </ul>
        `,
      },
    },
  },
};
export default meta;
export const Default = {};
Default.args = { onClick: fn(), onChange: fn() };
export const Disabled = {
  args: { disabled: true },
};
export const Multiple = {
  args: {
    multiple: true,
  },
};
export const WithAccept = {
  args: {
    accept: 'image/*',
  },
};
export const CustomLabel = {
  args: {
    children: 'Pick a Photo',
  },
};
export const IconLabel = {
  args: {
    children: demo(Icon, { name: 'attachment' }),
    buttonProps: {
      variant: 'text',
    },
    onClick: fn(),
    onChange: fn(),
  },
};
export const WithCustomStyles = {
  args: {
    styles: {
      border: '2px dashed #FF6347',
      padding: '1rem',
      borderRadius: '4px',
      backgroundColor: '#fff8f0',
    },
  },
};
export const WithAccessibility = {
  args: {
    children: 'Accessible Input File',
    'aria-label': 'Accessible InputFile',
  },
  parameters: {
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
    tags: ['a11y'],
  },
};
export const DefaultTokens = () => demo(TokenViewer, { tokens: { inputfile: defaultTheme.inputfile } });
DefaultTokens.parameters = {
  layout: 'padded',
};
