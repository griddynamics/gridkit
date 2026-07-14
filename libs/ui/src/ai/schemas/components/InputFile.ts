const component = {
  name: 'InputFile',
  import: "import { InputFile } from 'gd-design-library'",
  description:
    'File picker button wrapping a native file input with design system styling. Use DragAndDrop instead when a full drop zone with inline validation is needed.',
  a2uiName: 'input-file',
  category: 'Forms & Input',
  complexity: 'Medium',
  accessibility: 'WCAG 2.1 AA Compliant - Keyboard navigation, proper focus management, ARIA attributes',
  performance: 'Optimized - Lightweight wrapper around native input with minimal overhead',
  dependencies: ['@emotion/react', '@emotion/styled', 'Button component'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~2KB gzipped (excluding Button dependency)',
  browserSupport: 'All modern browsers with full file input support',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Button text shown on the file picker trigger (for example "Browse Files").',
    },
    {
      name: 'accept',
      type: 'string',
      description: 'MIME types or file extensions to accept (e.g. "image/*", ".pdf,.doc")',
    },
    { name: 'multiple', type: 'boolean', description: 'Whether multiple files can be selected at once' },
    { name: 'disabled', type: 'boolean', description: 'Whether the file picker is disabled' },
    {
      name: 'capture',
      type: "boolean | 'user' | 'environment'",
      description: 'Mobile camera capture mode: "user" for front camera, "environment" for rear camera',
    },
    {
      name: 'variant',
      type: 'string',
      description: 'Internal button variant (for example outlined, text, or primary).',
    },
    { name: 'icon', type: 'string', description: 'Leading icon name for the internal button trigger.' },
    { name: 'iconEnd', type: 'string', description: 'Trailing icon name for the internal button trigger.' },
    {
      name: 'fullWidth',
      type: 'boolean',
      description: 'Whether the internal button stretches to the full available width.',
    },
    {
      name: 'actions',
      type: 'string[]',
      description: 'Action IDs from ui.actions to trigger when files are selected.',
    },
    {
      name: 'isIcon',
      type: 'boolean',
      description: 'Whether to render the internal button as an icon-only trigger.',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the input file component' },
  ],
  examples: [
    '// Basic file upload with change handler\nconst handleFileChange = (e) => {\n  const files = e.target.files;\n  console.log("Selected files:", files);\n};\n<InputFile onChange={handleFileChange}>Browse Files</InputFile>',

    '// Image upload with file type restriction\n<InputFile \n  accept="image/*" \n  onChange={(e) => {\n    const file = e.target.files[0];\n    if (file) uploadImage(file);\n  }}\n>\n  Upload Photo\n</InputFile>',

    '// Multiple file selection for batch uploads\n<InputFile \n  multiple \n  accept=".pdf,.doc,.docx"\n  onChange={(e) => {\n    const fileArray = Array.from(e.target.files);\n    fileArray.forEach(file => console.log(file.name));\n  }}\n>\n  Select Documents\n</InputFile>',

    '// Custom button styling with icons\n<InputFile \n  accept="image/*,video/*"\n  buttonProps={{\n    variant: "contained",\n    color: "primary",\n    iconStart: <Icon name="upload" />\n  }}\n  onChange={handleMediaUpload}\n>\n  Upload Media\n</InputFile>',

    '// Mobile camera capture (selfie mode)\n<InputFile \n  accept="image/*" \n  capture="user"\n  onChange={(e) => {\n    const photo = e.target.files[0];\n    if (photo) processSelfie(photo);\n  }}\n>\n  Take Selfie\n</InputFile>',

    '// Mobile rear camera capture\n<InputFile \n  accept="image/*" \n  capture="environment"\n  onChange={handlePhotoCapture}\n>\n  Take Photo\n</InputFile>',

    '// Disabled during upload with full width\n<InputFile \n  disabled={isUploading}\n  accept="video/*"\n  buttonProps={{ fullWidth: true }}\n  onChange={handleVideoUpload}\n>\n  {isUploading ? "Uploading..." : "Choose Video"}\n</InputFile>',

    '// Icon-only button for compact layouts\n<InputFile \n  isIcon\n  accept="*/*"\n  onChange={handleFileUpload}\n  buttonProps={{ \n    ariaLabel: "Upload file",\n    variant: "text"\n  }}\n>\n  <Icon name="attachment" />\n</InputFile>',

    '// With file size validation\n<InputFile \n  accept="image/*"\n  onChange={(e) => {\n    const file = e.target.files[0];\n    if (file.size > 5 * 1024 * 1024) {\n      alert("File too large (max 5MB)");\n      return;\n    }\n    uploadFile(file);\n  }}\n>\n  Upload Image (Max 5MB)\n</InputFile>',

    '// CSV/Excel file import\n<InputFile \n  accept=".csv,.xlsx,.xls"\n  onChange={(e) => {\n    const file = e.target.files[0];\n    if (file) parseSpreadsheet(file);\n  }}\n  buttonProps={{ iconStart: <Icon name="table" /> }}\n>\n  Import Data\n</InputFile>',

    '// With box model props for spacing\n<InputFile \n  accept="application/pdf"\n  onChange={handlePdfUpload}\n  marginTop="16px"\n  marginBottom="8px"\n>\n  Upload PDF\n</InputFile>',

    '// Audio file upload\n<InputFile \n  accept="audio/*"\n  onChange={(e) => {\n    const audioFile = e.target.files[0];\n    if (audioFile) processAudio(audioFile);\n  }}\n>\n  Upload Audio\n</InputFile>',
  ],
};

const compositionTips: string[] = [
  'Use label for the trigger text and accept to constrain allowed file types.',
  'Use multiple for batch uploads and capture for mobile camera/photo flows.',
  'Use variant, icon, iconEnd, fullWidth, and isIcon to tune the internal button presentation.',
  'Wire file selection through actions[] instead of raw onChange callbacks.',
  'Keep upload requirements clear in nearby UI copy when accepted formats or size limits matter.',
];

export default { component, compositionTips };
