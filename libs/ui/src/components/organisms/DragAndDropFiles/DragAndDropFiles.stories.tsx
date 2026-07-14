import React, { useRef, useState } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { DragAndDropFiles } from '@components/organisms/DragAndDropFiles';
import { InputFile } from '@components/atoms/InputFile';
import { Button } from '@components/atoms/Button';
import { Icon } from '@components/atoms/Icon';
import { Typography } from '@components/atoms/Typography';
import { defaultTheme } from '@tokens';
import { ButtonVariant } from '@types';
import {
  defaultActions,
  withButtonStylesActions,
  withCustomStylesActions,
  dragAndDropLifecycleActions,
} from './DragAndDropFiles.stories.play';

const meta: Meta<typeof DragAndDropFiles> = {
  title: 'Organisms/DragAndDropFiles',
  component: DragAndDropFiles,
  tags: ['autodocs'],
  argTypes: {
    styles: {
      description: 'Custom CSS properties for the component',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    triggerRef: {
      description: 'Reference to the element that triggers the drag event',
      table: {
        type: { summary: 'RefObject<HTMLElement>' },
        defaultValue: { summary: 'undefined' },
      },
    },
    targetRef: {
      description: 'Reference to the target element where files can be dropped',
      table: {
        type: { summary: 'RefObject<HTMLElement>' },
        defaultValue: { summary: 'undefined' },
      },
    },
    dragOverContent: {
      description: 'Content to display when dragging over the drop zone',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onDragEnter: {
      description: 'Callback fired when dragging enters the drop zone',
      table: {
        type: { summary: '(event: DragEvent) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onDragOver: {
      description: 'Callback fired when dragging over the drop zone',
      table: {
        type: { summary: '(event: DragEvent) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onDragLeave: {
      description: 'Callback fired when dragging leaves the drop zone',
      table: {
        type: { summary: '(event: DragEvent) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onDrop: {
      description: 'Callback fired when files are dropped',
      table: {
        type: { summary: '(files: FileList, event: DragEvent) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    children: {
      description: 'Content to render within the drop zone',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`DragAndDropFiles\` component is a flexible file upload interface that enables drag-and-drop functionality with visual feedback and event handling.
<br/>
<br/>
<h3>Key Features:</h3>
<ul>
<li>
<b>Drop Zone Management</b>
<ul>
<li>Internal or external drop targets</li>
<li>Portal-rendered overlay content</li>
<li>Visual feedback during drag operations</li>
</ul>
</li>
<li>
<b>Event Handling</b>
<ul>
<li>Complete drag-and-drop lifecycle events</li>
<li>File extraction and processing</li>
<li>Custom event handlers</li>
</ul>
</li>
<li>
<b>Customization</b>
<ul>
<li>Custom drag-over content</li>
<li>Flexible styling options</li>
<li>Theme integration</li>
</ul>
</li>
</ul>

<h3>Usage Examples:</h3>
<h4>Basic Implementation:</h4>

\`\`\`tsx
<DragAndDropFiles 
  onDrop={(files) => console.log(files)}
  dragOverContent={<div>Drop files here!</div>}
>
  <p>Drag files into this area</p>
</DragAndDropFiles>
\`\`\`

<h4>With External Trigger:</h4>

\`\`\`tsx
const triggerRef = useRef(null);

<button ref={triggerRef}>Start dragging from here</button>

<DragAndDropFiles
  triggerRef={triggerRef}
  onDrop={handleFileDrop}
  dragOverContent={<UploadIndicator />}
/>
\`\`\`

<h3>Layout Props:</h3>
<ul>
<li>
<b>Container Styling</b>
<ul>
<li><code>styles</code>: Custom CSS properties</li>
<li>Theme-based styling support</li>
<li>Responsive layout options</li>
</ul>
</li>
</ul>

<h3>Accessibility:</h3>
<ul>
<li>Color contrast for drag indicators</li>
<li>Text alternatives for visual elements</li>
<li>Keyboard-accessible upload options</li>
<li>ARIA attributes for drag states</li>
</ul>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DragAndDropFiles>;

const DragAndDropExample: React.FC = () => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  return (
    <div
      ref={bodyRef}
      style={{
        padding: '2rem',
        border: '1px dashed gray',
        minHeight: '300px',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <Typography variant="h4">Drop files here</Typography>

      <DragAndDropFiles
        triggerRef={bodyRef}
        targetRef={carouselRef}
        dragOverContent={
          <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.1)' }}>Drop your files here!</div>
        }
        onDragEnter={(e) => console.log('onDragEnter', e)}
        onDragOver={(e) => console.log('onDragOver', e)}
        onDragLeave={(e) => console.log('onDragLeave', e)}
        onDrop={(droppedFiles, e) => {
          console.log('onDrop', droppedFiles);
          setFiles(droppedFiles);
        }}
      >
        <div ref={carouselRef} style={{ padding: '1rem', background: '#f0f0f0', minHeight: '150px' }}>
          <Typography variant="h5">Drag and drop area</Typography>
          <InputFile
            accept="image/*"
            multiple
            onChange={(e) => console.log('InputFile', e.target.files)}
            buttonProps={{
              variant: 'text',
            }}
          >
            <Icon name="attachment" />
          </InputFile>
        </div>

        {files && (
          <div style={{ marginTop: '1rem' }}>
            <Typography variant="p">
              Dropped Files:
              <ul>
                {Array.from(files).map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </Typography>
          </div>
        )}
      </DragAndDropFiles>
    </div>
  );
};

const CustomButtonStylesExample: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      style={{
        minHeight: '300px',
        border: '2px dashed teal',
        padding: '1rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <DragAndDropFiles
        triggerRef={ref}
        targetRef={ref}
        styles={{ backgroundColor: '#e0f7fa', padding: '1rem' }}
        dragOverContent={<div style={{ padding: '1rem', backgroundColor: '#b2ebf2' }}>Custom Dragging Content</div>}
        onDrop={(files) => console.log('Dropped files:', files)}
      >
        <InputFile
          accept="image/*"
          multiple
          onChange={(e) => console.log('InputFile', e.target.files)}
          buttonProps={{
            variant: 'text',
          }}
        >
          <Button variant={ButtonVariant.Text}>Upload</Button>
        </InputFile>
      </DragAndDropFiles>
    </div>
  );
};

const CustomStylesExample: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      style={{
        minHeight: '300px',
        border: '2px dashed teal',
        padding: '1rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <DragAndDropFiles
        triggerRef={ref}
        targetRef={ref}
        styles={{ backgroundColor: '#e0f7fa', padding: '1rem' }}
        dragOverContent={<div style={{ padding: '1rem', backgroundColor: '#b2ebf2' }}>Custom Dragging Content</div>}
        onDrop={(files) => console.log('Dropped files:', files)}
      >
        <Typography variant="p">Drop files in the teal area!</Typography>
      </DragAndDropFiles>
    </div>
  );
};

// === Export Stories ===
export const Default: Story = {
  render: () => <DragAndDropExample />,
};
Default.play = defaultActions;

export const WithButtonStyles: Story = {
  render: () => <CustomButtonStylesExample />,
};
WithButtonStyles.play = withButtonStylesActions;

export const WithCustomStyles: Story = {
  render: () => <CustomStylesExample />,
};
WithCustomStyles.play = withCustomStylesActions;

const DragAndDropLifecycleExample: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  return (
    <div
      ref={targetRef}
      data-testid="drop-container"
      style={{
        minHeight: '300px',
        border: '2px dashed #4caf50',
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <Typography variant="h4">Drag and Drop Files Here</Typography>

      <DragAndDropFiles
        targetRef={targetRef}
        dragOverContent={
          <Typography variant="h5" data-testid="drag-overlay">
            Drop files here!
          </Typography>
        }
        onDrop={(files) => setDroppedFiles(Array.from(files))}
      >
        <div style={{ padding: '1rem', minHeight: '150px' }}>
          <Typography variant="p">Drag files to see them listed below</Typography>

          {droppedFiles.length > 0 && (
            <div data-testid="dropped-files-list">
              <Typography variant="h6">Files:</Typography>
              <ul>
                {droppedFiles.map((file, index) => (
                  <li key={index} data-testid={`file-${index}`}>
                    {file.name} - {file.size} bytes
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DragAndDropFiles>
    </div>
  );
};

export const DragAndDropLifecycle: Story = {
  render: () => <DragAndDropLifecycleExample />,
};
DragAndDropLifecycle.play = dragAndDropLifecycleActions;

export const DefaultTokens: StoryFn = () => (
  <TokenViewer tokens={{ draganddropfiles: defaultTheme.draganddropfiles }} />
);
DefaultTokens.parameters = {
  layout: 'padded',
};
