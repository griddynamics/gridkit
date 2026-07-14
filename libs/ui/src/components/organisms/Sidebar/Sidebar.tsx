'use client';
import { forwardRef, useCallback } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Icon } from '@components/atoms/Icon';
import { get } from '@utils';

import { COMPONENT_NAME } from './constants';
import { SidebarStyled, SidebarHeaderStyled, SidebarContentStyled, SidebarFooterStyled } from './SidebarStyled';
import { SidebarItemComponent } from './SidebarItem';
import type { SidebarProps } from './Sidebar.types';

export const Sidebar = forwardRef<HTMLElement, SidebarProps>((props, forwardedRef) => {
  const {
    items = [],
    activeItemId,
    collapsed = false,
    width = '260px',
    collapsedWidth = '64px',
    onItemClick,
    onCollapsedChange,
    header,
    footer,
    children,
    ...rest
  } = props;
  const { theme } = useTheme();

  const handleCollapseToggle = useCallback(() => {
    onCollapsedChange?.(!collapsed);
  }, [collapsed, onCollapsedChange]);

  const collapseButtonStyles = get(theme, 'sidebar.collapseButton.default', {});

  return (
    <SidebarStyled
      ref={forwardedRef}
      theme={theme}
      $collapsed={collapsed}
      $width={width}
      $collapsedWidth={collapsedWidth}
      data-testid={COMPONENT_NAME}
      aria-label="Sidebar navigation"
      {...rest}
    >
      {(header || onCollapsedChange) && (
        <SidebarHeaderStyled theme={theme}>
          {!collapsed && header}
          {onCollapsedChange && (
            <button
              type="button"
              css={collapseButtonStyles}
              onClick={handleCollapseToggle}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              data-testid={`${COMPONENT_NAME}-collapse`}
            >
              <Icon
                name="arrowRight"
                width={16}
                height={16}
                styles={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s ease' }}
              />
            </button>
          )}
        </SidebarHeaderStyled>
      )}
      <SidebarContentStyled theme={theme}>
        {items.map((item) => (
          <SidebarItemComponent
            key={item.id}
            item={item}
            activeItemId={activeItemId}
            collapsed={collapsed}
            onItemClick={onItemClick}
          />
        ))}
        {children}
      </SidebarContentStyled>
      {footer && <SidebarFooterStyled theme={theme}>{footer}</SidebarFooterStyled>}
    </SidebarStyled>
  );
});

Sidebar.displayName = COMPONENT_NAME;
