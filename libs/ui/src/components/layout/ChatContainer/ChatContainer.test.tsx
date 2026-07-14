import { describe, it, expect, vi, afterEach } from 'vitest';
import { useRef } from 'react';
import { render, screen, fireEvent, act } from '@testUtils';

import { ChatContainer } from './ChatContainer';
import { COMPONENT_NAME } from './constants';

// Mock useMediaQuery to return false by default (not mobile)
vi.mock('@hooks/useMediaQuery', () => {
  return {
    useMediaQuery: vi.fn(() => false),
  };
});

const sidebarContent = <div data-testid="sidebar-content">Sidebar Content</div>;
const sidebarHeaderContent = <div data-testid="sidebar-header-content">Sidebar Header</div>;
const headerContent = <div data-testid="header-content">Main Header</div>;
const mainContent = <div data-testid="main-content">Main Content</div>;

describe(COMPONENT_NAME, () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('SHOULD match snapshot', () => {
    const { container } = render(
      <ChatContainer
        sidebarContent={sidebarContent}
        sidebarHeaderContent={sidebarHeaderContent}
        headerContent={headerContent}
      >
        {mainContent}
      </ChatContainer>
    );
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render main content', () => {
    render(<ChatContainer>{mainContent}</ChatContainer>);
    // Not using .toBeInTheDocument()
    expect(!!screen.getByTestId('main-content')).toBe(true);
  });

  it('SHOULD render sidebar content and header', () => {
    render(
      <ChatContainer sidebarContent={sidebarContent} sidebarHeaderContent={sidebarHeaderContent}>
        {mainContent}
      </ChatContainer>
    );
    expect(!!screen.getByTestId('sidebar-content')).toBe(true);
    expect(!!screen.getByTestId('sidebar-header-content')).toBe(true);
  });

  it('SHOULD render main header', () => {
    render(<ChatContainer headerContent={headerContent}>{mainContent}</ChatContainer>);

    expect(!!screen.getByTestId('header-content')).toBe(true);
  });

  it('SHOULD open sidebar by default', () => {
    render(<ChatContainer sidebarContent={sidebarContent}>{mainContent}</ChatContainer>);
    const sidebar = screen.getByTestId('sidebar-content');

    expect(sidebar).not.toBeNull();
    expect(
      window.getComputedStyle(sidebar).display !== 'none' && window.getComputedStyle(sidebar).visibility !== 'hidden'
    ).toBe(true);
  });

  it('SHOULD open sidebar when button is clicked', () => {
    const onToggleSidebar = vi.fn();
    render(
      <ChatContainer sidebarContent={sidebarContent} sidebarHeaderContent="Title" onToggleSidebar={onToggleSidebar}>
        {mainContent}
      </ChatContainer>
    );
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    expect(onToggleSidebar).toHaveBeenCalledWith(true);
  });

  it('SHOULD respect defaultSidebarOpen=false', () => {
    render(
      <ChatContainer sidebarContent={sidebarContent} isOpen={false}>
        {mainContent}
      </ChatContainer>
    );
    const sidebarWrapper = screen.getByTestId(`${COMPONENT_NAME}-sidebar-wrapper`);
    expect(sidebarWrapper).not.toBeNull();
    expect(window.getComputedStyle(sidebarWrapper).opacity).toBe('0');
  });

  it('SHOULD open sidebar when button is clicked', () => {
    const onToggleSidebar = vi.fn();
    render(
      <ChatContainer
        sidebarContent={sidebarContent}
        headerContent="Title"
        onToggleSidebar={onToggleSidebar}
        isOpen={false}
      >
        {mainContent}
      </ChatContainer>
    );
    const toggleButton = screen.getByTestId('Button');

    fireEvent.click(toggleButton);
    expect(onToggleSidebar).toHaveBeenCalledWith(true);
  });

  it('SHOULD NOT render headerContent when not provided', () => {
    render(<ChatContainer>{mainContent}</ChatContainer>);
    expect(screen.queryByTestId(`${COMPONENT_NAME}-main-header`)).toBeNull();
  });

  it('SHOULD NOT render sidebarHeaderContent when not provided', () => {
    render(<ChatContainer sidebarContent={sidebarContent}>{mainContent}</ChatContainer>);
    expect(screen.queryByTestId(`${COMPONENT_NAME}-sidebar-header`)).toBeNull();
  });

  it('SHOULD open sidebar using ref.open()', () => {
    let refValue;
    const TestComponent = () => {
      refValue = useRef(null);
      return (
        <ChatContainer isOpen={false} ref={refValue} sidebarContent={sidebarContent}>
          {mainContent}
        </ChatContainer>
      );
    };

    render(<TestComponent />);
    act(() => {
      refValue.current?.open();
    });
    expect(refValue.current?.isOpen).toEqual(true);
    expect(screen.getByTestId(`${COMPONENT_NAME}-sidebar-wrapper`)).not.toBeNull();
  });

  it('SHOULD close sidebar using ref.close()', () => {
    let refValue;
    const TestComponent = () => {
      refValue = useRef(null);
      return (
        <ChatContainer isOpen ref={refValue} sidebarContent={sidebarContent}>
          {mainContent}
        </ChatContainer>
      );
    };

    render(<TestComponent />);
    act(() => {
      refValue.current?.close();
    });
    expect(refValue.current?.isOpen).toEqual(false);
    const sidebarWrapper = screen.getByTestId(`${COMPONENT_NAME}-sidebar-wrapper`);
    expect(sidebarWrapper).not.toBeNull();
    expect(window.getComputedStyle(sidebarWrapper).opacity).toBe('0');
  });

  it('SHOULD toggle sidebar using ref.toggle()', async () => {
    let refValue;
    const TestComponent = () => {
      refValue = useRef(null);
      return (
        <ChatContainer isOpen ref={refValue} sidebarContent={sidebarContent}>
          {mainContent}
        </ChatContainer>
      );
    };

    render(<TestComponent />);

    const sidebarWrapper = screen.getByTestId(`${COMPONENT_NAME}-sidebar-wrapper`);

    act(() => {
      refValue.current?.toggle();
    });

    expect(refValue.current?.isOpen).toEqual(false);
    expect(window.getComputedStyle(sidebarWrapper).opacity).toBe('0');

    act(() => {
      refValue.current?.toggle();
    });

    expect(refValue.current?.isOpen).toEqual(true);
    expect(window.getComputedStyle(sidebarWrapper).opacity).toBe('1');
  });
});
