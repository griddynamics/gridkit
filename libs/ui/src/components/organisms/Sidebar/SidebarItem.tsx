'use client';
import { useState, useCallback, useEffect, useMemo, type MouseEvent } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Icon } from '@components/atoms/Icon';
import { get } from '@utils';

import type { SidebarItemProps, SidebarItem as SidebarItemType } from './Sidebar.types';
import { SidebarItemStyled, SidebarGroupStyled } from './SidebarStyled';

export const SidebarItemComponent = (props: SidebarItemProps) => {
  const { item, activeItemId, collapsed = false, depth = 0, onItemClick } = props;
  const { theme } = useTheme();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.id === activeItemId;

  const isChildActive = useMemo(() => {
    const check = (items: SidebarItemType[]): boolean =>
      items.some((child) => child.id === activeItemId || (child.children && check(child.children)));
    return hasChildren ? check(item.children!) : false;
  }, [activeItemId, hasChildren, item.children]);

  const [isExpanded, setIsExpanded] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) setIsExpanded(true);
  }, [isChildActive]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (item.disabled) return;
      if (hasChildren) {
        setIsExpanded((prev) => !prev);
      }
      onItemClick?.(event, item);
    },
    [item, hasChildren, onItemClick]
  );

  return (
    <>
      <SidebarItemStyled
        theme={theme}
        $isActive={isActive}
        $depth={depth}
        $disabled={!!item.disabled}
        $collapsed={collapsed}
        onClick={handleClick}
        data-testid={`SidebarItem-${item.id}`}
        aria-current={isActive ? 'page' : undefined}
        {...(item.disabled ? { 'aria-disabled': true } : {})}
      >
        {item.icon && item.icon}
        {!collapsed && <span>{item.label}</span>}
        {!collapsed && hasChildren && (
          <Icon
            {...get(theme, 'sidebar.expandIcon.icon', { name: 'arrowRight', width: 14, height: 14 })}
            styles={{
              ...get(theme, 'sidebar.expandIcon.default', {}),
              ...(isExpanded ? get(theme, 'sidebar.expandIcon.expanded', {}) : {}),
              marginLeft: 'auto',
            }}
          />
        )}
      </SidebarItemStyled>
      {hasChildren && !collapsed && (
        <SidebarGroupStyled theme={theme} $isExpanded={isExpanded}>
          {item.children!.map((child) => (
            <SidebarItemComponent
              key={child.id}
              item={child}
              activeItemId={activeItemId}
              collapsed={collapsed}
              depth={depth + 1}
              onItemClick={onItemClick}
            />
          ))}
        </SidebarGroupStyled>
      )}
    </>
  );
};
