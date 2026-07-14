import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { pick } from '@utils';
import { InlineNotification } from '../InlineNotification';
import { COMPONENT_NAME, CONTENT_COMPONENT } from './constants';

describe(COMPONENT_NAME, () => {
  it('SHOULD match success snapshot', () => {
    const { container } = render(<InlineNotification variant="success">Success</InlineNotification>);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD match info snapshot', () => {
    const { container } = render(<InlineNotification variant="info">Info</InlineNotification>);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD match warning snapshot', () => {
    const { container } = render(<InlineNotification variant="warning">Warning</InlineNotification>);
    expect(container).toMatchSnapshot();
  });
  it('SHOULD match error snapshot', () => {
    const { container } = render(<InlineNotification variant="error">Error</InlineNotification>);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD match default snapshot', () => {
    const { container } = render(<InlineNotification>Default</InlineNotification>);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render simple text', () => {
    const notificationMessage = 'Notification Message';
    render(<InlineNotification variant="warning">{notificationMessage}</InlineNotification>);
    const inlineNotificationContent = screen.getByTestId(CONTENT_COMPONENT);
    expect(inlineNotificationContent).toHaveTextContent(notificationMessage);
  });
  it('SHOULD render simple text in <span />', () => {
    const notificationMessage = 'Notification Message';
    render(<InlineNotification variant="error">{notificationMessage}</InlineNotification>);
    const inlineNotificationContent = screen.getByTestId(CONTENT_COMPONENT);
    expect(inlineNotificationContent.tagName).toBe('SPAN');
  });

  it('SHOULD pass styles properly', () => {
    const expectedStyle = { backgroundColor: 'rgb(255, 0, 0)', height: '100px', width: '100px' };
    render(
      <InlineNotification variant="success" styles={expectedStyle}>
        Success Notification
      </InlineNotification>
    );
    const accordionItem = screen.getByTestId(COMPONENT_NAME);
    const computedStyles = pick(getComputedStyle(accordionItem), ['backgroundColor', 'height', 'width']);
    expect(computedStyles).toStrictEqual(expectedStyle);
  });

  it('SHOULD className properly', () => {
    const expectedClassname = 'custom-notification-classname';
    render(
      <InlineNotification variant="info" className={expectedClassname}>
        Info Notification
      </InlineNotification>
    );
    const inlineNotification = screen.getByTestId(COMPONENT_NAME);
    expect(inlineNotification.className).toContain(expectedClassname);
  });

  it('SHOULD render a ReactNode', () => {
    const testId = 'NotificationChildNode';
    render(
      <InlineNotification variant="info">
        <p data-testid={testId}>Notification Child Node</p>
      </InlineNotification>
    );

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  // Test Default notification aria values
  it('SHOULD have correct aria-live attribute for default notification', () => {
    render(<InlineNotification>Default notification</InlineNotification>);
    const inlineNotification = screen.getByTestId(COMPONENT_NAME);
    expect(inlineNotification).toHaveAttribute('aria-live', 'polite');
  });
  it('SHOULD have correct role attribute for default notification', () => {
    render(<InlineNotification>Default notification</InlineNotification>);
    const inlineNotification = screen.getByTestId(COMPONENT_NAME);
    expect(inlineNotification).toHaveAttribute('role', 'status');
  });

  // Test Info notification aria values
  it('SHOULD have correct aria-live attribute for info notification', () => {
    render(<InlineNotification variant="info">Info notification</InlineNotification>);
    const inlineNotification = screen.getByTestId(COMPONENT_NAME);
    expect(inlineNotification).toHaveAttribute('aria-live', 'polite');
  });
  it('SHOULD have correct role attribute for info notification', () => {
    render(<InlineNotification variant="info">Info notification</InlineNotification>);
    const inlineNotification = screen.getByTestId(COMPONENT_NAME);
    expect(inlineNotification).toHaveAttribute('role', 'status');
  });

  // Test Success notification aria values
  it('SHOULD have correct aria-live attribute for success notification', () => {
    render(<InlineNotification variant="success">Success notification</InlineNotification>);
    const inlineNotification = screen.getByTestId(COMPONENT_NAME);
    expect(inlineNotification).toHaveAttribute('aria-live', 'polite');
  });
  it('SHOULD have correct role attribute for success notification', () => {
    render(<InlineNotification variant="success">Success notification</InlineNotification>);
    const inlineNotification = screen.getByTestId(COMPONENT_NAME);
    expect(inlineNotification).toHaveAttribute('role', 'status');
  });

  // Test Error notification aria values
  it('SHOULD have correct aria-live attribute for error notification', () => {
    render(<InlineNotification variant="error">Error notification</InlineNotification>);
    const inlineNotification = screen.getByTestId(COMPONENT_NAME);
    expect(inlineNotification).toHaveAttribute('aria-live', 'assertive');
  });
  it('SHOULD have correct role attribute for success notification', () => {
    render(<InlineNotification variant="error">Error notification</InlineNotification>);
    const inlineNotification = screen.getByTestId(COMPONENT_NAME);
    expect(inlineNotification).toHaveAttribute('role', 'alert');
  });

  // Test Warning notification aria values
  it('SHOULD have correct aria-live attribute for warning notification', () => {
    render(<InlineNotification variant="warning">Warning notification</InlineNotification>);
    const inlineNotification = screen.getByTestId(COMPONENT_NAME);
    expect(inlineNotification).toHaveAttribute('aria-live', 'assertive');
  });
  it('SHOULD have correct role attribute for warning notification', () => {
    render(<InlineNotification variant="warning">Warning notification</InlineNotification>);
    const inlineNotification = screen.getByTestId(COMPONENT_NAME);
    expect(inlineNotification).toHaveAttribute('role', 'alert');
  });
});
