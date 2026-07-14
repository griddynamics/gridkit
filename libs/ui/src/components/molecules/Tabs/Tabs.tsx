'use client';
import { forwardRef, useCallback, useState } from 'react';

import { useTheme } from '@hooks/useTheme';
import { generateUniqueId } from '@utils';

import { COMPONENT_NAME, TabRoles } from './constants';
import { TabsProps } from './Tabs.types';
import {
  NoticeCounterStyled,
  TabLabelStyled,
  TabPanelStyled,
  TabPanelsWrapperStyled,
  TabsHeaderStyled,
  TabsStyled,
  TextButtonStyled,
} from './TabsStyled';

export const Tabs = forwardRef<HTMLDivElement, TabsProps>((props, forwardedRef) => {
  const { activeTab = 0, tabs = [], ariaLabel, onTabChange, ...rest } = props;

  const { theme } = useTheme();
  const [activeTabIdx, setActiveTabIdx] = useState(activeTab);

  const onTabClick = useCallback(
    (idx: number) => () => {
      setActiveTabIdx(idx);

      if (onTabChange) {
        onTabChange(idx);
      }
    },
    [onTabChange]
  );
  const getTabIdKey = useCallback(
    (prefix: string, id?: string | number) => generateUniqueId(id, `${COMPONENT_NAME}-${prefix}`),
    []
  );

  return (
    <TabsStyled
      ref={forwardedRef}
      theme={theme}
      data-testid={COMPONENT_NAME}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      {...rest}
    >
      <TabsHeaderStyled theme={theme} data-testid={`${COMPONENT_NAME}-header`} role={TabRoles.TabList}>
        {tabs.map(({ isDisabled, noticeCounter, label, id }, idx) => {
          const isActiveTab = idx === activeTabIdx;
          return (
            <TabLabelStyled
              key={getTabIdKey(`tab-${idx}`, id)}
              theme={theme}
              $isDisabled={isDisabled}
              $isActive={isActiveTab}
              data-testid={`${COMPONENT_NAME}-${TabRoles.Tab}`}
            >
              <TextButtonStyled
                onClick={onTabClick(idx)}
                disabled={isDisabled}
                id={getTabIdKey(`${TabRoles.Tab}-${idx}`, id)}
                theme={theme}
                iconEnd={
                  typeof noticeCounter !== 'undefined' && (
                    <NoticeCounterStyled
                      className={`${COMPONENT_NAME}__noticeCounter`}
                      theme={theme}
                      $isActive={isActiveTab}
                      $isDisabled={isDisabled}
                      data-testid={`${COMPONENT_NAME}-noticeCounter`}
                    >
                      {noticeCounter}
                    </NoticeCounterStyled>
                  )
                }
                aria-selected={isActiveTab}
                aria-controls={getTabIdKey(`${TabRoles.TabPanel}-${idx}`, id)}
              >
                {label}
              </TextButtonStyled>
            </TabLabelStyled>
          );
        })}
      </TabsHeaderStyled>
      <TabPanelsWrapperStyled theme={theme} data-testid={`${COMPONENT_NAME}-wrapper`}>
        {tabs.map(({ content, id }, idx) => (
          <TabPanelStyled
            key={getTabIdKey(`${TabRoles.TabPanel}-${idx}`, id)}
            id={getTabIdKey(`${TabRoles.TabPanel}-${idx}`, id)}
            aria-labelledby={getTabIdKey(`${TabRoles.Tab}-${idx}`, id)}
            role={TabRoles.TabPanel}
            hidden={idx !== activeTabIdx}
            data-testid={`${COMPONENT_NAME}-${TabRoles.TabPanel}`}
          >
            {content}
          </TabPanelStyled>
        ))}
      </TabPanelsWrapperStyled>
    </TabsStyled>
  );
});
