import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, screen } from '@testUtils';

import { InputFile } from './InputFile';
import { COMPONENT_NAME, INPUT_FILE_DEFAULT_LABEL_VALUE, INPUT_FILE_TYPE } from './constants';

describe('InputFile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('SHOULD match snapshot', () => {
    const { container } = render(<InputFile />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render the upload button inside the component root', () => {
    render(<InputFile />);
    const container = screen.getByTestId(COMPONENT_NAME);
    const btn = container.querySelector('button');

    expect(document.body.contains(btn!)).toBe(true);

    expect(btn?.getAttribute('type')).toBe('button');
    expect(btn?.getAttribute('disabled')).toBeNull();
    expect(btn?.textContent).toBe(INPUT_FILE_DEFAULT_LABEL_VALUE);
  });

  it('SHOULD call click handler and open hidden file input when button is clicked', () => {
    const mockOnClick = vi.fn();
    const mockOnChange = vi.fn();
    render(<InputFile onClick={mockOnClick} onChange={mockOnChange} buttonProps={{ 'data-testid': 'upload-btn' }} />);

    const btn = screen.getByTestId('upload-btn');
    const fileInput = screen.getByTestId(COMPONENT_NAME).querySelector(`input[type="${INPUT_FILE_TYPE}"]`)!;

    // simulate click
    fireEvent.click(btn);

    expect(mockOnClick).toHaveBeenCalledTimes(1);

    fireEvent.change(fileInput, { target: { files: [new File(['a'], 'a.txt')] } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('SHOULD call onChange with selected files', () => {
    const handleChange = vi.fn();
    render(<InputFile onChange={handleChange} multiple />);
    const input = document.querySelector(`input[type="${INPUT_FILE_TYPE}"]`)!;

    const file1 = new File(['hello'], 'hello.png', { type: 'image/png' });
    const file2 = new File(['world'], 'world.jpg', { type: 'image/jpeg' });
    fireEvent.change(input, {
      target: { files: [file1, file2] },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    const eventArg = handleChange.mock.calls[0][0] as Event;
    expect((eventArg.target as HTMLInputElement).files).toHaveLength(2);
  });

  it('SHOULD disable both button and input when disabled prop is true (button)', () => {
    render(<InputFile disabled>Nope</InputFile>);
    const btn = screen.getByRole('button', { name: /nope/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('disabled')).not.toBeNull();
  });

  it('SHOULD disable both button and input when disabled prop is true (input)', () => {
    render(<InputFile disabled>Nope</InputFile>);
    const input = screen
      .getByTestId(COMPONENT_NAME)
      .querySelector(`input[type="${INPUT_FILE_TYPE}"]`) as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.getAttribute('disabled')).not.toBeNull();
  });

  it('SHOULD not trigger click when disabled', () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');
    render(<InputFile disabled>Nope</InputFile>);
    const btn = screen.getByRole('button', { name: /nope/i });
    fireEvent.click(btn);
    expect(clickSpy).not.toHaveBeenCalled();
  });
});
