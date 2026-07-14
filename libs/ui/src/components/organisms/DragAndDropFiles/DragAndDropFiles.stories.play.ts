import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { createMockFile, createMockDataTransfer } from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  dragAndDropContainer: () => canvas.getByTestId('DragAndDropFiles'),
  uploadButton: () => canvas.getAllByRole('button', { name: /upload/i })[0],
  queryUploadButton: () => canvas.queryByRole('button', { name: /upload/i }),
  inputFileButton: () => canvas.getByTestId('InputFile'),
  fileInput: () => canvas.getByTestId('InputFile').querySelector('input[type="file"]') as HTMLInputElement,
  queryFileInput: () => canvas.queryAllByTestId('InputFile'),
  dropZoneHeading: () => canvas.getByRole('heading', { name: /drop files here/i }),
  queryDropZoneHeading: () => canvas.queryByRole('heading', { name: /drop files here/i }),
  dragAndDropHeading: () => canvas.getByRole('heading', { name: /drag and drop area/i }),
  typographyText: () => canvas.getByText(/drop files in the teal area/i),
  fileList: () => canvas.getByText(/dropped files:/i),
  queryFileList: () => canvas.queryByText(/dropped files:/i),
  attachmentIcon: () => canvas.getByTestId('Icon-attachment'),
});

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render outer container with drop zone heading', async () => {
    const heading = locators.dropZoneHeading();
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Drop files here');
  });

  await step('Should render DragAndDropFiles container', async () => {
    const container = locators.dragAndDropContainer();
    expect(container).toBeInTheDocument();
    expect(container).toBeVisible();
  });

  await step('Should render drag and drop area heading', async () => {
    const heading = locators.dragAndDropHeading();
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Drag and drop area');
  });

  await step('Should render InputFile component with attachment icon', async () => {
    const inputFile = locators.inputFileButton();
    const icon = locators.attachmentIcon();

    expect(inputFile).toBeInTheDocument();
    expect(inputFile).toBeVisible();
    expect(icon).toBeInTheDocument();
  });

  await step('Should have file input element', async () => {
    const fileInput = locators.fileInput();
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', 'image/*');
    expect(fileInput).toHaveAttribute('multiple');
  });

  await step('Should not display dropped files list initially', async () => {
    const fileList = locators.queryFileList();
    expect(fileList).not.toBeInTheDocument();
  });

  await step('Should allow clicking on InputFile button', async () => {
    const inputFile = locators.inputFileButton();
    await userEvent.click(inputFile);
    expect(inputFile).toBeInTheDocument();
  });
};

export const withButtonStylesActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render DragAndDropFiles container with custom styles', async () => {
    const container = locators.dragAndDropContainer();
    expect(container).toBeInTheDocument();
    expect(container).toBeVisible();
  });

  await step('Should render Upload button', async () => {
    const uploadButton = locators.uploadButton();
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toBeVisible();
    expect(uploadButton).toHaveTextContent('Upload');
  });

  await step('Should have file input associated with Upload button', async () => {
    const fileInput = locators.fileInput();
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', 'image/*');
    expect(fileInput).toHaveAttribute('multiple');
  });

  await step('Should apply custom background color styling', async () => {
    const container = locators.dragAndDropContainer();
    const computedStyle = window.getComputedStyle(container);
    expect(computedStyle.backgroundColor).toBe('rgb(224, 247, 250)');
  });

  await step('Should allow clicking Upload button', async () => {
    const uploadButton = locators.uploadButton();
    await userEvent.click(uploadButton);
    expect(uploadButton).toBeInTheDocument();
  });

  await step('Should render InputFile component', async () => {
    const inputFile = locators.uploadButton();
    expect(inputFile).toBeInTheDocument();
    expect(inputFile).toBeVisible();
  });
};

export const withCustomStylesActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render DragAndDropFiles container', async () => {
    const container = locators.dragAndDropContainer();
    expect(container).toBeInTheDocument();
    expect(container).toBeVisible();
  });

  await step('Should render Typography with drop instruction text', async () => {
    const typography = locators.typographyText();
    expect(typography).toBeInTheDocument();
    expect(typography).toBeVisible();
    expect(typography).toHaveTextContent('Drop files in the teal area!');
  });

  await step('Should apply custom background color styling', async () => {
    const container = locators.dragAndDropContainer();
    const computedStyle = window.getComputedStyle(container);
    expect(computedStyle.backgroundColor).toBe('rgb(224, 247, 250)');
  });

  await step('Should apply custom padding styling', async () => {
    const container = locators.dragAndDropContainer();
    const computedStyle = window.getComputedStyle(container);
    expect(computedStyle.padding).toBe('16px');
  });

  await step('Should not render InputFile component', async () => {
    const inputFile = locators.queryUploadButton();
    expect(inputFile).not.toBeInTheDocument();
  });

  await step('Should not have Upload button', async () => {
    const uploadButton = locators.queryUploadButton();
    expect(uploadButton).not.toBeInTheDocument();
  });

  await step('Should be a pure drag-and-drop zone without file input fallback', async () => {
    const fileInput = locators.queryFileInput();
    expect(fileInput.length).toBe(0);
  });
};

export const dragAndDropLifecycleActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);

  await step('Should render drop container', async () => {
    const container = canvas.getByTestId('drop-container');
    expect(container).toBeInTheDocument();
  });

  await step('Should not show dropped files initially', async () => {
    const filesList = canvas.queryByTestId('dropped-files-list');
    expect(filesList).not.toBeInTheDocument();
  });

  await step('Should show overlay when dragging', async () => {
    const container = canvas.getByTestId('drop-container');
    const mockFiles = [createMockFile('test.txt', 1024, 'text/plain')];
    const dataTransfer = createMockDataTransfer(mockFiles);

    container.dispatchEvent(
      new DragEvent('dragenter', {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      })
    );

    await waitFor(() => {
      expect(documentBody.getByTestId('drag-overlay')).toBeInTheDocument();
    });
  });

  await step('Should display dropped files', async () => {
    const container = canvas.getByTestId('drop-container');
    const mockFiles = [
      createMockFile('document.pdf', 2048, 'application/pdf'),
      createMockFile('image.png', 4096, 'image/png'),
    ];
    const dataTransfer = createMockDataTransfer(mockFiles);

    container.dispatchEvent(
      new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      })
    );

    await waitFor(() => {
      const filesList = canvas.getByTestId('dropped-files-list');
      expect(filesList).toBeInTheDocument();
    });
  });

  await step('Should show correct file details', async () => {
    const file0 = canvas.getByTestId('file-0');
    const file1 = canvas.getByTestId('file-1');

    expect(file0).toHaveTextContent('document.pdf - 2048 bytes');
    expect(file1).toHaveTextContent('image.png - 4096 bytes');
  });

  await step('Should hide overlay after drop', async () => {
    await waitFor(() => {
      expect(documentBody.queryByTestId('drag-overlay')).not.toBeInTheDocument();
    });
  });
};
