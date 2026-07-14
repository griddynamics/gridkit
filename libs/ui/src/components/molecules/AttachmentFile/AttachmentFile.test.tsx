import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { AttachmentFile } from './AttachmentFile';
import { COMPONENT_NAME } from './constants';

const NAME_TESTID = `${COMPONENT_NAME}-name`;
const META_TESTID = `${COMPONENT_NAME}-meta`;
const REMOVE_TESTID = `${COMPONENT_NAME}-remove`;

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot with all props', () => {
    const { container } = render(
      <AttachmentFile fileName="report.pdf" fileType="PDF" fileSize="1.2 MB" onRemove={vi.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  it('SHOULD match snapshot without meta', () => {
    const { container } = render(<AttachmentFile fileName="report.pdf" onRemove={vi.fn()} />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD match snapshot without remove button', () => {
    const { container } = render(<AttachmentFile fileName="report.pdf" fileType="PDF" fileSize="1.2 MB" />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render the file name', () => {
    render(<AttachmentFile fileName="report.pdf" />);
    expect(screen.getByTestId(NAME_TESTID)).toHaveTextContent('report.pdf');
  });

  it('SHOULD render fileType and fileSize in the meta row', () => {
    render(<AttachmentFile fileName="report.pdf" fileType="PDF" fileSize="1.2 MB" />);
    const meta = screen.getByTestId(META_TESTID);
    expect(meta).toBeInTheDocument();
    expect(meta).toHaveTextContent('PDF');
    expect(meta).toHaveTextContent('1.2 MB');
  });

  it('SHOULD render meta with only fileType', () => {
    render(<AttachmentFile fileName="report.pdf" fileType="PDF" />);
    const meta = screen.getByTestId(META_TESTID);
    expect(meta).toHaveTextContent('PDF');
  });

  it('SHOULD render meta with only fileSize', () => {
    render(<AttachmentFile fileName="report.pdf" fileSize="1.2 MB" />);
    const meta = screen.getByTestId(META_TESTID);
    expect(meta).toHaveTextContent('1.2 MB');
  });

  it('SHOULD NOT render meta row when neither fileType nor fileSize provided', () => {
    render(<AttachmentFile fileName="report.pdf" />);
    expect(screen.queryByTestId(META_TESTID)).not.toBeInTheDocument();
  });

  it('SHOULD NOT render remove button when onRemove is not provided', () => {
    render(<AttachmentFile fileName="report.pdf" />);
    expect(screen.queryByTestId(REMOVE_TESTID)).not.toBeInTheDocument();
  });

  it('SHOULD render remove button when onRemove is provided', () => {
    render(<AttachmentFile fileName="report.pdf" onRemove={vi.fn()} />);
    expect(screen.getByTestId(REMOVE_TESTID)).toBeInTheDocument();
  });

  it('SHOULD call onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(<AttachmentFile fileName="report.pdf" onRemove={handleRemove} />);
    await user.click(screen.getByTestId(REMOVE_TESTID));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('SHOULD NOT call onRemove when disabled', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(<AttachmentFile fileName="report.pdf" onRemove={handleRemove} disabled />);
    await user.click(screen.getByTestId(REMOVE_TESTID));
    expect(handleRemove).not.toHaveBeenCalled();
  });

  it('SHOULD render custom fileIcon', () => {
    const testId = 'custom-file-icon';
    render(<AttachmentFile fileName="image.png" fileIcon={<span data-testid={testId}>icon</span>} />);
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('SHOULD apply custom className', () => {
    const className = 'custom-chip-class';
    render(<AttachmentFile fileName="report.pdf" className={className} />);
    expect(screen.getByTestId(COMPONENT_NAME).className).toContain(className);
  });

  it('SHOULD apply custom styles', () => {
    const styles = { backgroundColor: 'rgb(255, 0, 0)' };
    render(<AttachmentFile fileName="report.pdf" styles={styles} />);
    const chip = screen.getByTestId(COMPONENT_NAME);
    expect(getComputedStyle(chip).backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('SHOULD forward ref to the container element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<AttachmentFile fileName="report.pdf" ref={ref} />);
    expect(ref.current).toBe(screen.getByTestId(COMPONENT_NAME));
  });

  it('SHOULD use removeButtonLabel as aria-label on remove button', () => {
    const label = 'Delete attachment';
    render(<AttachmentFile fileName="report.pdf" onRemove={vi.fn()} removeButtonLabel={label} />);
    expect(screen.getByTestId(REMOVE_TESTID)).toHaveAttribute('aria-label', label);
  });

  describe('isLoading', () => {
    it('SHOULD match snapshot when isLoading', () => {
      const { container } = render(
        <AttachmentFile fileName="report.pdf" fileType="PDF" fileSize="1.2 MB" onRemove={vi.fn()} isLoading />
      );
      expect(container).toMatchSnapshot();
    });

    it('SHOULD render remove button in loading state when isLoading and onRemove provided', () => {
      render(<AttachmentFile fileName="report.pdf" onRemove={vi.fn()} isLoading />);
      expect(screen.getByTestId(REMOVE_TESTID)).toHaveAttribute('aria-busy', 'true');
    });

    it('SHOULD keep remove button in DOM when isLoading', () => {
      render(<AttachmentFile fileName="report.pdf" onRemove={vi.fn()} isLoading />);
      expect(screen.getByTestId(REMOVE_TESTID)).toBeInTheDocument();
    });

    it('SHOULD NOT have aria-busy on remove button when isLoading is false', () => {
      render(<AttachmentFile fileName="report.pdf" onRemove={vi.fn()} />);
      expect(screen.getByTestId(REMOVE_TESTID)).not.toHaveAttribute('aria-busy', 'true');
    });

    it('SHOULD NOT render remove button when onRemove is absent even with isLoading', () => {
      render(<AttachmentFile fileName="report.pdf" isLoading />);
      expect(screen.queryByTestId(REMOVE_TESTID)).not.toBeInTheDocument();
    });
  });
});
