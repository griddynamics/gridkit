import type { ReactNode } from 'react';
import { Column, FlexContainer, Portal, Row, Scroll, Wrapper } from '@components';
import type { A2UIComponent } from '../../../ai';
import {
  getMergedComponentStyles,
  getComponentText,
  getTopLevelBoolean,
  getTopLevelString,
  getPortalContainer,
  getCssLengthValue,
} from '../helpers';
import { ROW_AND_COLUMN_MANAGED_INLINE_STYLE_KEYS, FLEX_CONTAINER_MANAGED_INLINE_STYLE_KEYS } from '../constants';

export const layoutRenderers = {
  row: (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <Row
      key={component.id}
      as={component.as as never}
      gutter={component.gutter ?? component.gap}
      align={(component.align ?? component.alignItems) as never}
      justify={(component.justify ?? component.justifyContent) as never}
      isWrap={component.isWrap}
      isReversed={component.isReversed}
      flex={component.flex}
      className={component.className}
      styles={getMergedComponentStyles(component, undefined, ROW_AND_COLUMN_MANAGED_INLINE_STYLE_KEYS)}
    >
      {renderChildren(component.children)}
    </Row>
  ),
  column: (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <Column
      key={component.id}
      as={component.as as never}
      gutter={component.gutter ?? component.gap}
      align={(component.align ?? component.alignItems) as never}
      justify={(component.justify ?? component.justifyContent) as never}
      isWrap={component.isWrap}
      isReversed={component.isReversed}
      flex={component.flex}
      className={component.className}
      styles={getMergedComponentStyles(component, undefined, ROW_AND_COLUMN_MANAGED_INLINE_STYLE_KEYS)}
    >
      {renderChildren(component.children)}
    </Column>
  ),
  'flex-container': (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <FlexContainer
      key={component.id}
      gap={getCssLengthValue(component.gap)}
      flexDirection={component.flexDirection as never}
      alignItems={component.alignItems}
      justifyContent={component.justifyContent}
      className={component.className}
      styles={getMergedComponentStyles(component, undefined, FLEX_CONTAINER_MANAGED_INLINE_STYLE_KEYS)}
    >
      {renderChildren(component.children)}
    </FlexContainer>
  ),
  scroll: (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <Scroll
      key={component.id}
      className={component.className}
      vertical={(component.vertical ?? getTopLevelString(component, 'vertical')) as never}
      horizontal={(component.horizontal ?? getTopLevelString(component, 'horizontal')) as never}
      autoHide={component.autoHide ?? getTopLevelBoolean(component, 'autoHide')}
      styles={getMergedComponentStyles(component)}
    >
      {renderChildren(component.children)}
    </Scroll>
  ),
  wrapper: (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => {
    const text = getComponentText(component);

    return (
      <Wrapper
        key={component.id}
        as={component.as as never}
        variant={component.variant as never}
        className={component.className}
        styles={getMergedComponentStyles(component)}
        onClick={component.actions?.length ? () => component.actions!.forEach((id) => dispatchAction?.(id)) : undefined}
      >
        {renderChildren(component.children)}
        {!component.children?.length && text ? text : null}
      </Wrapper>
    );
  },
  portal: (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <Portal
      key={component.id}
      container={getPortalContainer(component)}
      withWrapper={component.withWrapper ?? getTopLevelBoolean(component, 'withWrapper')}
      wrapperVariant={(component.wrapperVariant ?? getTopLevelString(component, 'wrapperVariant')) as never}
      blocksScroll={component.blocksScroll ?? getTopLevelBoolean(component, 'blocksScroll')}
      WrapperView={(component.WrapperView ?? getTopLevelString(component, 'WrapperView')) as never}
      className={component.className}
      styles={getMergedComponentStyles(component)}
    >
      {renderChildren(component.children)}
    </Portal>
  ),
};
