import type { ReactNode } from 'react';
import { FlexContainer, Icon, Tabs, Typography } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getOptionLikeItems } from '../helpers';

export const tabsRenderers = {
  tabs: (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => {
    const renderedChildren = renderChildren(component.children);
    const options = getOptionLikeItems(component);

    return (
      <Tabs
        key={component.id}
        activeTab={typeof component.value === 'number' ? component.value : 0}
        ariaLabel={component.ariaLabel}
        styles={getMergedComponentStyles(component)}
        onTabChange={
          dispatchAction && component.actions?.length
            ? (index: number) => {
                const option = options[index];
                component.actions!.forEach((id) =>
                  dispatchAction(id, { index, value: option?.value, label: option?.label })
                );
              }
            : undefined
        }
        tabs={options.map((option, index) => ({
          id:
            typeof option.value === 'string' || typeof option.value === 'number'
              ? option.value
              : `${component.id}-tab-${index}`,
          label: option.icon ? (
            <FlexContainer alignItems="center" gap="4px">
              <Icon name={option.icon as never} />
              <Typography as="span">{option.label}</Typography>
            </FlexContainer>
          ) : (
            option.label
          ),
          content: renderedChildren[index] ?? null,
          isDisabled: option.disabled,
          noticeCounter: option.noticeCounter,
        }))}
      />
    );
  },
};
