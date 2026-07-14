import '@testing-library/jest-dom';
import '@testing-library/dom';
import { expect } from 'vitest';
import { render, screen } from '@testUtils';
import { COMPONENT_NAME } from './constants';
import { DragAndDrop } from './DragAndDrop';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(
      <DragAndDrop title="Drop items here" description=" File Up to 25MB - Format: .jpg, .png, .bmp, .tif or .webp" />
    );
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render the title', () => {
    const testTitle = 'Drag and Drop Your Files Here';
    render(<DragAndDrop title={testTitle} />);
    expect(screen.getByText(testTitle)).toBeInTheDocument();
  });

  it('SHOULD render the description', () => {
    const testDescription = 'Max file size 5MB';
    render(<DragAndDrop description={testDescription} />);
    expect(screen.getByText(testDescription)).toBeInTheDocument();
  });

  it('SHOULD render the loading overlay when isLoading and no children are present', () => {
    const loadingMessage = 'Loading files...';
    render(<DragAndDrop isLoading loadingOverlay={<div>{loadingMessage}</div>} />);
    expect(screen.getByText(loadingMessage)).toBeInTheDocument();
  });

  it('SHOULD render custom children when provided', () => {
    const customChildText = 'This is a custom child component';
    render(
      <DragAndDrop>
        <div>{customChildText}</div>
      </DragAndDrop>
    );

    expect(screen.getByText(customChildText)).toBeInTheDocument();
  });

  it('SHOULD render multiple error messages', () => {
    const error1 = 'File too large.';
    const error2 = 'Too many files.';
    render(<DragAndDrop errors={[error1, error2]} />);
    expect(screen.getByText(error1)).toBeInTheDocument();
    expect(screen.getByText(error2)).toBeInTheDocument();
  });
});
