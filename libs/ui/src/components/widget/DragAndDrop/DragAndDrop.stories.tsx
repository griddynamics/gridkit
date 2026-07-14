import { PropsWithChildren, useRef, useState } from 'react';
import { Meta, StoryFn, StoryObj } from '@storybook/react';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Button, Icon, Input, Loader, Typography, FileTypes } from '@components';
import { ButtonVariant, SizeVariant, TextAlign, TypographyVariant } from '@types';
import { Column, Row } from '@components/layout';

import { defaultTheme } from '@tokens';
import { DragAndDrop } from './DragAndDrop';
import { DragAndDropProps } from './DragAndDrop.types';
import {
  defaultActions,
  disabledActions,
  loadingActions,
  errorActions,
  usageAsWrapperActions,
} from './DragAndDrop.stories.play';

const acceptedFileTypeOptions = Object.keys(FileTypes);
const acceptedFileTypeMapping = Object.fromEntries(Object.entries(FileTypes).map(([key, value]) => [key, value]));

const meta: Meta<typeof DragAndDrop> = {
  title: 'Templates/DragAndDrop',
  component: DragAndDrop,
  args: {},

  argTypes: {
    title: {
      control: 'text',
      description: 'Main title shown in drop area',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Drop items here' },
      },
    },
    description: {
      control: 'text',
      description: 'Description text below button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'File Up to 25MB - Format: .jpg, .png, .bmp, .tif or .webp' },
      },
    },
    inputFileButtonLabel: {
      control: 'text',
      description: 'Button label for file input',
      table: {
        type: { summary: 'string' },
      },
    },
    acceptedFileTypes: {
      control: {
        type: 'multi-select',
      },
      options: acceptedFileTypeOptions,
      mapping: acceptedFileTypeMapping,
      description: 'Array of accepted MIME types for uploaded files',
      table: {
        type: {
          summary: 'FileTypes[]',
          detail: Object.entries(FileTypes)
            .map(([key, value]) => `${key}: "${value}"`)
            .join('\n'),
        },
        defaultValue: { summary: '[]' },
      },
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files allowed',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'Infinity' },
      },
    },
    maxFileSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '20971520' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the upload area and input',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading state with overlay',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loadingOverlay: {
      control: 'object',
      description: 'Custom loading overlay content',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    errors: {
      control: 'object',
      description: 'Array of error messages to display',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' },
      },
    },
    triggerRef: {
      control: 'object',
      description: 'Reference to trigger element for file drop',
      table: {
        type: { summary: 'RefObject<HTMLElement>' },
      },
    },
    targetRef: {
      control: 'object',
      description: 'Reference to target element for file drop',
      table: {
        type: { summary: 'RefObject<HTMLElement>' },
      },
    },
    onFilesChanged: {
      action: 'onFilesChanged',
      description: 'Triggered when valid files are selected',
      table: {
        type: { summary: '(files: File[]) => void' },
      },
    },
    onError: {
      action: 'onError',
      description: 'Triggered when validation errors occur',
      table: {
        type: { summary: '(errors: string[]) => void' },
      },
    },
    styles: {
      control: 'object',
      description: 'Custom styles for the component',
      table: {
        type: { summary: 'CSSProperties' },
      },
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
  The \`DragAndDrop\` component is a flexible wrapper for file upload functionality that supports both drag-and-drop and traditional file input methods.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Upload Methods</b>
  <ul>
  <li>Drag and drop files</li>
  <li>Traditional file input</li>
  <li>Custom trigger areas</li>
  </ul>
  </li>
  <li>
  <b>Validation</b>
  <ul>
  <li>File type restrictions</li>
  <li>File size limits</li>
  <li>Maximum file count</li>
  </ul>
  </li>
  <li><b>States</b> - Loading, disabled, error states</li>
  <li><b>Customization</b> - Custom loading overlays</li>
  <li><b>Error Handling</b> - Validation error display</li>
  </ul>
  <br/>
  <h3>Layout Options:</h3>
  <ul>
  <li><b>Drop Area</b>
  <ul>
  <li>Customizable content layout</li>
  <li>Flexible dimensions</li>
  <li>Visual feedback states</li>
  </ul>
  </li>
  <li><b>File Display</b>
  <ul>
  <li>List or grid layouts</li>
  <li>File preview options</li>
  <li>Progress indicators</li>
  </ul>
  </li>
  <li><b>Error Display</b>
  <ul>
  <li>Error message positioning</li>
  <li>Visual error indicators</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
} as Meta<typeof DragAndDrop>;

export default meta;
type Story = StoryObj<typeof DragAndDrop>;

const Template: StoryFn<PropsWithChildren<DragAndDropProps>> = (args) => {
  const [errors, setErrors] = useState<string[]>([]);
  return (
    <div style={{ padding: '40px' }}>
      <DragAndDrop errors={errors} {...args} onError={setErrors} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Drop items here',
  description: ' File Up to 25MB - Format: .jpg, .png, .bmp, .tif or .webp',
};
Default.play = defaultActions;

export const Disabled = Template.bind({});
Disabled.args = {
  title: 'Drop items here',
  description: ' File Up to 25MB - Format: .jpg, .png, .bmp, .tif or .webp',
  disabled: true,
};
Disabled.play = disabledActions;

export const Loading = Template.bind({});
Loading.args = {
  title: 'Drop items here',
  description: ' File Up to 25MB - Format: .jpg, .png, .bmp, .tif or .webp',
  isLoading: true,
  loadingOverlay: (
    <>
      <Loader name="circle" withWrapper={false} size={SizeVariant.Xl} />
      <Typography variant={TypographyVariant.H6} styles={{ margin: 0 }}>
        Uploading
      </Typography>
    </>
  ),
};
Loading.play = loadingActions;

export const Error = Template.bind({});
Error.args = {
  title: 'Drop items here',
  description: ' File Up to 25MB - Format: .jpg, .png, .bmp, .tif or .webp',
  errors: ['File too large: screenshot.png (30 MB). Max allowed is 20 MB.'],
};
Error.play = errorActions;

const DragAndDropWrapper = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const bodyRef2 = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={bodyRef2}>
      <DragAndDrop
        triggerRef={bodyRef2}
        targetRef={targetRef}
        files={files}
        errors={errors}
        onFilesChanged={(files) => {
          setFiles(files);
        }}
        onError={(errorList) => {
          setErrors(errorList);
        }}
        loadingOverlay={
          <>
            <Loader withWrapper={false} size={SizeVariant.Xl} />
            <Typography variant={TypographyVariant.H6} styles={{ margin: 0 }}>
              Uploading
            </Typography>
          </>
        }
      >
        <Column ref={targetRef} padding="28px 8px 28px 8px " gutter="15px" styles={{ border: '1px solid #E0E0E0' }}>
          <Row gutter="8px">
            {files.map((file) => {
              return (
                <Column key={file.name} padding="8px" styles={{ border: '1px solid #E0E0E0', width: '98px' }}>
                  <Row flex="1" justify="center" align="center">
                    <Icon height={42} width={42} name="folderOpen" />
                  </Row>

                  <Typography align={TextAlign.Center} variant={TypographyVariant.Caption}>
                    {file.name}
                  </Typography>
                </Column>
              );
            })}
          </Row>
          <Row justify="between" gutter="8px">
            <Column>
              <Button variant={ButtonVariant.Text}>
                <Icon name="mobileMenu" width={24} height={24} />
              </Button>
            </Column>
            <Column flex="1">
              <Input placeholder="Enter your message..." />
            </Column>
            <Button variant={ButtonVariant.Text}>
              <Icon name="arrowRight" />
            </Button>
          </Row>
        </Column>
      </DragAndDrop>
    </div>
  );
};

export const UsageAsWrapper: Story = {
  render: () => <DragAndDropWrapper />,
};
UsageAsWrapper.play = usageAsWrapperActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ draganddrop: defaultTheme.draganddrop }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
