import { within, userEvent, expect } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import {
  openModal,
  closeModal,
  closeModalWithEscape,
  waitForElementToDisappear,
  waitForElementToAppear,
  pressKey,
} from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>, documentBody: ReturnType<typeof within>) => ({
  openButton: () => canvas.getByTestId('open-modal'),
  modal: () => documentBody.getByTestId('Modal'),
  queryModal: () => documentBody.queryByTestId('Modal'),
  modalHeader: () => documentBody.getByTestId('Modal-header'),
  modalTitle: () => documentBody.getByTestId('Modal-title'),
  modalBody: () => documentBody.getByTestId('Modal-body'),
  modalFooter: () => documentBody.getByTestId('Modal-footer'),
  closeButton: () => documentBody.getByTestId('close-button'),
  footerCloseButton: () => documentBody.getByRole('button', { name: 'Close' }),
  overlay: () => documentBody.getByTestId('Modal').parentElement as HTMLElement,
});

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render open modal button', async () => {
    const openButton = locators.openButton();
    expect(openButton).toBeInTheDocument();
    expect(openButton).toHaveTextContent('Open Modal');
  });

  await step('Should open modal on button click', async () => {
    await openModal(
      () => locators.openButton(),
      () => locators.modal()
    );
  });

  await step('Should display modal with title', async () => {
    const modal = locators.modal();
    const modalTitle = locators.modalTitle();

    expect(modal).toBeInTheDocument();
    expect(modal).toBeVisible();
    expect(modalTitle).toHaveTextContent('Modal Title');
  });

  await step('Should render modal header with close button', async () => {
    const modalHeader = locators.modalHeader();
    const closeButton = locators.closeButton();

    expect(modalHeader).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toBeVisible();
  });

  await step('Should render modal body with content', async () => {
    const modalBody = locators.modalBody();
    expect(modalBody).toBeInTheDocument();
    expect(modalBody).toHaveTextContent('This is the modal content.');
  });

  await step('Should render modal footer with close button', async () => {
    const modalFooter = locators.modalFooter();
    const footerCloseButton = locators.footerCloseButton();

    expect(modalFooter).toBeInTheDocument();
    expect(footerCloseButton).toBeInTheDocument();
    expect(footerCloseButton).toHaveTextContent('Close');
  });

  await step('Should close modal via header close button', async () => {
    await closeModal(
      () => locators.closeButton(),
      () => locators.queryModal()
    );
  });

  await step('Should reopen modal for footer button test', async () => {
    await openModal(
      () => locators.openButton(),
      () => locators.modal()
    );
  });

  await step('Should close modal via footer close button', async () => {
    await closeModal(
      () => locators.footerCloseButton(),
      () => locators.queryModal()
    );
  });

  await step('Should reopen modal for Escape key test', async () => {
    await openModal(
      () => locators.openButton(),
      () => locators.modal()
    );
  });

  await step('Should close modal on Escape key press', async () => {
    await closeModalWithEscape(() => locators.queryModal());
  });

  await step('Should reopen modal for overlay click test', async () => {
    await openModal(
      () => locators.openButton(),
      () => locators.modal()
    );
  });

  await step('Should close modal on overlay click', async () => {
    const overlay = locators.overlay();
    await userEvent.click(overlay);
    await waitForElementToDisappear(() => locators.queryModal(), 2000);
  });

  await step('Should reopen modal for content click test', async () => {
    await openModal(
      () => locators.openButton(),
      () => locators.modal()
    );
  });

  await step('Should NOT close modal when clicking modal content', async () => {
    const modalBody = locators.modalBody();
    await userEvent.click(modalBody);

    expect(locators.modal()).toBeInTheDocument();
  });

  await step('Should close modal after content click test', async () => {
    await closeModal(
      () => locators.closeButton(),
      () => locators.queryModal()
    );
  });
};

export const noEscapeCloseContentWithScrollActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render open modal button', async () => {
    const openButton = locators.openButton();
    expect(openButton).toBeInTheDocument();
    expect(openButton).toHaveTextContent('Open Modal');
  });

  await step('Should open modal with scrollable content', async () => {
    await openModal(
      () => locators.openButton(),
      () => locators.modal()
    );
  });

  await step('Should display modal with long scrollable content', async () => {
    const modal = locators.modal();
    const modalBody = locators.modalBody();

    expect(modal).toBeInTheDocument();
    expect(modal).toBeVisible();
    expect(modalBody).toBeInTheDocument();
    expect(modalBody.textContent).toContain('Lorem ipsum dolor sit amet');
  });

  await step('Should NOT close modal on Escape key press', async () => {
    await pressKey('Escape');

    await waitForElementToAppear(() => locators.modal(), 500);
    expect(locators.modal()).toBeInTheDocument();
  });

  await step('Should still close modal via header close button', async () => {
    await closeModal(
      () => locators.closeButton(),
      () => locators.queryModal()
    );
  });

  await step('Should reopen modal for footer button test', async () => {
    await openModal(
      () => locators.openButton(),
      () => locators.modal()
    );
  });

  await step('Should still close modal via footer button', async () => {
    await closeModal(
      () => locators.footerCloseButton(),
      () => locators.queryModal()
    );
  });

  await step('Should reopen modal for overlay click test', async () => {
    await openModal(
      () => locators.openButton(),
      () => locators.modal()
    );
  });

  await step('Should still close modal on overlay click', async () => {
    const overlay = locators.overlay();
    await userEvent.click(overlay);
    await waitForElementToDisappear(() => locators.queryModal(), 2000);
  });
};

export const customViewActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render open modal button', async () => {
    const openButton = locators.openButton();
    expect(openButton).toBeInTheDocument();
    expect(openButton).toHaveTextContent('Open Modal');
  });

  await step('Should open modal with custom view', async () => {
    await openModal(
      () => locators.openButton(),
      () => locators.modal()
    );
  });

  await step('Should display modal with custom content', async () => {
    const modal = locators.modal();
    expect(modal).toBeInTheDocument();
    expect(modal).toBeVisible();
  });

  await step('Should NOT render standard header structure in custom view', async () => {
    const modalHeader = documentBody.queryByTestId('Modal-header');
    expect(modalHeader).not.toBeInTheDocument();
  });

  await step('Should NOT render standard body structure in custom view', async () => {
    const modalBody = documentBody.queryByTestId('Modal-body');
    expect(modalBody).not.toBeInTheDocument();
  });

  await step('Should NOT render standard footer structure in custom view', async () => {
    const modalFooter = documentBody.queryByTestId('Modal-footer');
    expect(modalFooter).not.toBeInTheDocument();
  });

  await step('Should render custom content directly', async () => {
    const modal = locators.modal();
    expect(modal).toHaveTextContent('Custom modal content');
  });

  await step('Should close modal on overlay click', async () => {
    const overlay = locators.overlay();
    await userEvent.click(overlay);
    await waitForElementToDisappear(() => locators.queryModal(), 2000);
  });
};

export const noClickOutsideCloseActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render open modal button', async () => {
    const openButton = locators.openButton();
    expect(openButton).toBeInTheDocument();
    expect(openButton).toHaveTextContent('Open Modal');
  });

  await step('Should open modal on button click', async () => {
    await openModal(
      () => locators.openButton(),
      () => locators.modal()
    );
  });

  await step('Should display modal with correct title', async () => {
    const modal = locators.modal();
    const modalTitle = locators.modalTitle();

    expect(modal).toBeInTheDocument();
    expect(modal).toBeVisible();
    expect(modalTitle).toHaveTextContent('Click Outside Disabled');
  });

  await step('Should render modal body with correct content', async () => {
    const modalBody = locators.modalBody();
    expect(modalBody).toBeInTheDocument();
    expect(modalBody).toHaveTextContent('This modal cannot be closed by clicking outside');
  });

  await step('Should NOT close modal when clicking overlay', async () => {
    const overlay = locators.overlay();
    await userEvent.click(overlay);

    await waitForElementToAppear(() => locators.modal(), 500);
    expect(locators.modal()).toBeInTheDocument();
    expect(locators.modal()).toBeVisible();
  });

  await step('Should NOT close modal on multiple overlay clicks', async () => {
    const overlay = locators.overlay();
    await userEvent.click(overlay);
    await userEvent.click(overlay);
    await userEvent.click(overlay);

    expect(locators.modal()).toBeInTheDocument();
    expect(locators.modal()).toBeVisible();
  });

  await step('Should NOT close modal when clicking modal content', async () => {
    const modalBody = locators.modalBody();
    await userEvent.click(modalBody);

    expect(locators.modal()).toBeInTheDocument();
    expect(locators.modal()).toBeVisible();
  });

  await step('Should still close modal via header close button', async () => {
    await closeModal(
      () => locators.closeButton(),
      () => locators.queryModal()
    );
  });

  await step('Should reopen modal for Escape key test', async () => {
    await openModal(
      () => locators.openButton(),
      () => locators.modal()
    );
  });

  await step('Should still close modal on Escape key press', async () => {
    await closeModalWithEscape(() => locators.queryModal());
  });

  await step('Should reopen modal for footer button test', async () => {
    await openModal(
      () => locators.openButton(),
      () => locators.modal()
    );
  });

  await step('Should still close modal via footer button', async () => {
    await closeModal(
      () => locators.footerCloseButton(),
      () => locators.queryModal()
    );
  });
};
