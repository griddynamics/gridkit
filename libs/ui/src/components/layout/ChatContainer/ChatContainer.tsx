'use client';
import { forwardRef, useImperativeHandle, useRef, useState, useCallback, type RefObject, type MouseEvent } from 'react';

import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';
import { useMediaQuery } from '@hooks/useMediaQuery';

import { get } from '@utils';
import { Icon } from '@components';

import { COMPONENT_NAME } from './constants';
import {
  BodyStyled,
  ContentStyled,
  MainHeaderStyled,
  MainWrapperStyled,
  SidebarStyled,
  SidebarMinifiedStyled,
  SidebarHeaderStyled,
  SidebarWrapperStyled,
  SidebarToggleButtonStyled,
  SidebarContentWrapperStyled,
} from './ChatContainerStyled';
import type { ChatContainerProps, ChatContainerRef } from './';

export const ChatContainer = forwardRef<ChatContainerRef, ChatContainerProps>(
  (
    {
      sidebarContent,
      headerContent,
      children,
      isOpen,
      sidebarHeaderContent,
      sidebarMinifiedContent,
      onToggleSidebar,
      styles = {},
      showSidebarAsideControl = true,
      showSidebarHeaderControl = true,
      ...rest
    },
    forwardedRef
  ) => {
    const { theme } = useTheme();
    const logger = useLogger();
    const triggerRef = useRef<HTMLDivElement>(null);
    const [sidebarOpen, setSidebarOpen] = useState(isOpen);
    const isMobile = useMediaQuery(`(max-width: ${get(theme, 'values.screenMedium', '768px')})`);

    const toggleSidebar = useCallback(() => {
      const nextState = !sidebarOpen;

      logger.debug(`${COMPONENT_NAME}: Toggle triggered (user interaction)`, {
        isOpen: nextState,
      });

      setSidebarOpen(nextState);
      onToggleSidebar?.(nextState);
    }, [sidebarOpen, onToggleSidebar, logger]);

    const handleSidebarWrapperClick = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        if (isMobile && sidebarOpen && event.target === event.currentTarget) {
          logger.debug(`${COMPONENT_NAME}: Sidebar wrapper clicked (mobile close)`, {
            isMobile,
            wasOpen: sidebarOpen,
          });
          setSidebarOpen(false);
          onToggleSidebar?.(false);
        }
      },
      [isMobile, sidebarOpen, onToggleSidebar, logger]
    );

    useImperativeHandle(forwardedRef, () => ({
      ref: triggerRef as RefObject<HTMLDivElement>,
      isOpen: sidebarOpen,
      open: () => {
        logger.debug(`${COMPONENT_NAME}: Ref method called - open()`);
        setSidebarOpen(true);
      },
      close: () => {
        logger.debug(`${COMPONENT_NAME}: Ref method called - close()`);
        setSidebarOpen(false);
      },
      toggle: () => {
        logger.debug(`${COMPONENT_NAME}: Ref method called - toggle()`);
        toggleSidebar();
      },
    }));

    return (
      <MainWrapperStyled
        className="gd-chat-container"
        data-testid={`${COMPONENT_NAME}-main-wrapper`}
        theme={theme}
        ref={triggerRef}
        {...rest}
        styles={styles}
      >
        <SidebarWrapperStyled
          theme={theme}
          data-testid={`${COMPONENT_NAME}-sidebar-wrapper`}
          $open={sidebarOpen}
          onClick={handleSidebarWrapperClick}
        >
          <SidebarStyled
            theme={theme}
            data-testid={`${COMPONENT_NAME}-sidebar`}
            $open={sidebarOpen}
            onClick={(e: MouseEvent) => e.stopPropagation()}
            aria-label="Sidebar content"
          >
            {sidebarHeaderContent ? (
              <SidebarHeaderStyled theme={theme} data-testid={`${COMPONENT_NAME}-sidebar-header`}>
                {showSidebarAsideControl && (
                  <SidebarToggleButtonStyled
                    theme={theme}
                    onClick={toggleSidebar}
                    $open={sidebarOpen}
                    aria-label="Toggle sidebar - close"
                  >
                    <Icon {...get(theme, 'chat.toggleIcon', { name: 'arrowDown' })} />
                  </SidebarToggleButtonStyled>
                )}
                {sidebarHeaderContent}
              </SidebarHeaderStyled>
            ) : null}
            <SidebarContentWrapperStyled theme={theme}>{sidebarContent}</SidebarContentWrapperStyled>
          </SidebarStyled>
        </SidebarWrapperStyled>

        {sidebarMinifiedContent && (
          <SidebarMinifiedStyled
            theme={theme}
            data-testid={`${COMPONENT_NAME}-sidebar-minified`}
            $open={!sidebarOpen}
            aria-label="Sidebar minified content"
          >
            {sidebarMinifiedContent}
          </SidebarMinifiedStyled>
        )}

        <BodyStyled theme={theme} data-testid={`${COMPONENT_NAME}-body`}>
          {headerContent ? (
            <MainHeaderStyled theme={theme} data-testid={`${COMPONENT_NAME}-main-header`}>
              {!sidebarOpen && showSidebarHeaderControl && (
                <SidebarToggleButtonStyled theme={theme} onClick={toggleSidebar} aria-label="Toggle sidebar - open">
                  <Icon {...get(theme, 'chat.toggleIcon', { name: 'arrowDown' })} />
                </SidebarToggleButtonStyled>
              )}
              {headerContent}
            </MainHeaderStyled>
          ) : null}
          <ContentStyled theme={theme} data-testid={`${COMPONENT_NAME}-content`}>
            {children}
          </ContentStyled>
        </BodyStyled>
      </MainWrapperStyled>
    );
  }
);

ChatContainer.displayName = COMPONENT_NAME;
