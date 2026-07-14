import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { Icon } from '@components';

import { AttachmentFile, AttachmentFileProps } from './';

const noop = (): void => undefined;

const meta: Meta<typeof AttachmentFile> = {
  title: 'Molecules/Attachment File',
  component: AttachmentFile,
  argTypes: {
    fileName: {
      description: 'Name of the attached file',
      control: 'text',
      table: { category: 'File', type: { summary: 'string' } },
    },
    fileType: {
      description: 'File type label shown below the file name (e.g. "PDF", "doc")',
      control: 'text',
      table: { category: 'File', type: { summary: 'string' } },
    },
    fileSize: {
      description: 'File size label shown below the file name (e.g. "1.2 MB")',
      control: 'text',
      table: { category: 'File', type: { summary: 'string' } },
    },
    fileIcon: {
      description: 'Custom icon replacing the default fileCopy icon. Use an Icon component sized xl (32px).',
      table: { category: 'File', type: { summary: 'ReactNode' } },
    },
    separator: {
      description: 'Character rendered between fileType and fileSize in the meta row',
      control: 'text',
      table: { category: 'File', type: { summary: 'string' }, defaultValue: { summary: '·' } },
    },
    onRemove: {
      description: 'Callback fired when the remove button is clicked. Button is hidden when not provided.',
      table: { category: 'Remove Button', type: { summary: '() => void' } },
    },
    removeButtonLabel: {
      description: 'Accessible aria-label for the remove button',
      control: 'text',
      table: { category: 'Remove Button', type: { summary: 'string' }, defaultValue: { summary: 'Remove file' } },
    },
    disabled: {
      description: 'Disables the remove button',
      control: 'boolean',
      table: { category: 'Remove Button', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    isLoading: {
      description:
        'Shows a loader spinner in place of the remove button while the file is uploading. Requires onRemove to be provided.',
      control: 'boolean',
      table: { category: 'State', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`AttachmentFile\` component displays a file attachment chip inside an \`InputArea\` or any other context where a selected file needs to be shown with a remove action.

<br/>

<h3>Key Features:</h3>
<ul>
  <li><b>File name</b> — truncated with ellipsis for long names; full name revealed on hover via a <code>Tooltip</code></li>
  <li><b>File metadata</b> — optional type and size labels below the name; long <code>fileType</code> values truncate with ellipsis</li>
  <li><b>Separator</b> — configurable character between <code>fileType</code> and <code>fileSize</code> via the <code>separator</code> prop (defaults to <code>·</code>)</li>
  <li><b>Custom icon</b> — replace the default file icon with any ReactNode via <code>fileIcon</code></li>
  <li><b>Remove button</b> — rendered only when <code>onRemove</code> is provided</li>
  <li><b>Disabled state</b> — disables the remove button while keeping the chip visible</li>
  <li><b>Loading state</b> — replaces the remove button with a spinner via <code>isLoading</code> during upload</li>
</ul>

<br/>

<h3>Usage with InputArea:</h3>
Pass \`AttachmentFile\` as a child of \`InputArea\` to display selected files above the textarea:

\`\`\`tsx
<InputArea>
  <AttachmentFile fileName="report.pdf" fileType="PDF" fileSize="1.2 MB" onRemove={() => removeFile(id)} />
</InputArea>
\`\`\`
`,
      },
    },
  },
};

export default meta;

const Template: StoryFn<AttachmentFileProps> = (args) => <AttachmentFile {...args} />;

export const Default = Template.bind({});
Default.args = {
  fileName: 'Doc_Name.doc',
  fileType: 'doc',
  fileSize: '1.2 MB',
  onRemove: noop,
};

export const WithoutMeta = Template.bind({});
WithoutMeta.args = {
  fileName: 'Doc_Name.doc',
  onRemove: noop,
};

export const WithoutRemove = Template.bind({});
WithoutRemove.args = {
  fileName: 'Doc_Name.doc',
  fileType: 'doc',
  fileSize: '1.2 MB',
};

export const Disabled = Template.bind({});
Disabled.args = {
  fileName: 'Doc_Name.doc',
  fileType: 'doc',
  fileSize: '1.2 MB',
  disabled: true,
  onRemove: noop,
};

export const LongFileName = Template.bind({});
LongFileName.args = {
  fileName: 'Very_Long_Document_Name_That_Should_Truncate_With_Ellipsis.docx',
  fileType: 'docx',
  fileSize: '3.8 MB',
  onRemove: noop,
};
LongFileName.decorators = [
  (Story) => (
    <div style={{ width: 220 }}>
      <Story />
    </div>
  ),
];

export const LongFileType = Template.bind({});
LongFileType.args = {
  fileName: 'report.pdf',
  fileType: 'Application/PDF Document',
  fileSize: '1.2 MB',
  onRemove: noop,
};
LongFileType.decorators = [
  (Story) => (
    <div style={{ width: 220 }}>
      <Story />
    </div>
  ),
];

export const Loading = Template.bind({});
Loading.args = {
  fileName: 'report.pdf',
  fileType: 'PDF',
  fileSize: '1.2 MB',
  onRemove: noop,
  isLoading: true,
};

export const Error: StoryFn = () => (
  <AttachmentFile
    fileName="report.pdf"
    fileType="Upload failed"
    fileIcon={<Icon name="error" fill="icon.error" size="xl" />}
    onRemove={noop}
  />
);

export const Removable: StoryFn = () => {
  const [files, setFiles] = useState([
    { id: 1, name: 'report.pdf', type: 'PDF', size: '1.2 MB' },
    { id: 2, name: 'screenshot.png', type: 'PNG', size: '450 KB' },
    { id: 3, name: 'data.xlsx', type: 'xlsx', size: '2.1 MB' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: 280 }}>
      {files.map((f) => (
        <AttachmentFile
          key={f.id}
          fileName={f.name}
          fileType={f.type}
          fileSize={f.size}
          onRemove={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
        />
      ))}
    </div>
  );
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ attachmentFile: defaultTheme.attachmentFile }} />;
DefaultTokens.parameters = { layout: 'padded' };
