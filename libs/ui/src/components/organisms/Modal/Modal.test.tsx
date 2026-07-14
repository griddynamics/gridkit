import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { COMPONENT_NAME as WRAPPER_COMPONENT_NAME } from '@components/atoms/Wrapper/constants';

import { COMPONENT_NAME } from './constants';
import { Modal } from './Modal';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot & render correctly when isOpen is true', () => {
    const onClose = vi.fn();
    const { baseElement } = render(
      <Modal isOpen={true} onClose={onClose}>
        Modal Content
      </Modal>
    );
    const modal = screen.getByTestId('Modal');
    const content = screen.getByText('Modal Content');
    expect(document.body.contains(modal)).toBe(true);
    expect(document.body.contains(content)).toBe(true);

    expect(baseElement).toMatchSnapshot();
  });

  it('SHOULD not render when isOpen is false', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={false} onClose={onClose}>
        Modal Content
      </Modal>
    );
    const modal = screen.queryByTestId('Modal');
    expect(modal).toBeNull();
  });

  it('SHOULD render title when provided', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Title">
        Modal Content
      </Modal>
    );
    const title = screen.getByText('Test Title');
    expect(document.body.contains(title)).toBe(true);
  });

  it('SHOULD render close button by default and calls onClose when clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        Modal Content
      </Modal>
    );
    const closeButton = screen.getByTestId('close-button').firstChild;
    expect(document.body.contains(closeButton)).toBe(true);

    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('SHOULD not render close button when showCloseButton is false', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} showCloseButton={false}>
        Modal Content
      </Modal>
    );
    const closeButton = screen.queryByText('×');
    expect(closeButton).toBeNull();
  });

  it('SHOULD call onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        Modal Content
      </Modal>
    );
    const overlay = screen.getByTestId(WRAPPER_COMPONENT_NAME).firstChild;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('SHOULD not call onClose when overlay is clicked and closeOnClickOutside is false', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} closeOnClickOutside={false}>
        Modal Content
      </Modal>
    );
    const overlay = screen.getByTestId(WRAPPER_COMPONENT_NAME).firstChild;
    fireEvent.click(overlay);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('SHOULD not call onClose when content is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        Modal Content
      </Modal>
    );
    const content = screen.getByTestId('Modal');
    fireEvent.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('SHOULD close on escape key when closeOnEscape is true', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} closeOnEscape={true}>
        Modal Content
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('SHOULD not close on escape key when closeOnEscape is false', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} closeOnEscape={false}>
        Modal Content
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('SHOULD render footer when provided', () => {
    const footerContent = <div>Footer Content</div>;
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} footer={footerContent}>
        Modal Content
      </Modal>
    );
    const footer = screen.getByText('Footer Content');
    expect(document.body.contains(footer)).toBe(true);
  });

  it('SHOULD clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const onClose = vi.fn();
    const { unmount } = render(
      <Modal isOpen={true} onClose={onClose} closeOnEscape={true}>
        Modal Content
      </Modal>
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('SHOULD not render header WHEN no title provided', () => {
    render(<Modal isOpen={true}>Modal Content</Modal>);
    const title = screen.queryByTestId('Modal-header');
    expect(title).toBeNull();
  });

  it('SHOULD not render footer WHEN no footer content provided', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        Modal Content
      </Modal>
    );
    const footer = screen.queryByTestId('Modal-footer');
    expect(footer).toBeNull();
  });

  it('SHOULD render custom view WHEN isCustomView is true', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} isCustomView={true}>
        Custom Modal Content
      </Modal>
    );
    const content = screen.getByText('Custom Modal Content');
    expect(document.body.contains(content)).toBe(true);
  });

  it('SHOULD NOT render header and footer WHEN isCustomView is true', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} isCustomView={true} title="Test Title" footer={<div>Footer</div>}>
        Custom Modal Content
      </Modal>
    );
    const header = screen.queryByTestId('Modal-header');
    const footer = screen.queryByTestId('Modal-footer');
    expect(header).toBeNull();
    expect(footer).toBeNull();
  });
});
