import type { ReactNode } from 'react';
import {
  Card,
  CardButton,
  CardCounter,
  CardDescription,
  CardImage,
  CardPrice,
  CardRating,
  CardTitle,
  Icon,
  InlineNotification,
} from '@components';
import type { A2UIComponent } from '../../../ai';
import {
  getMergedComponentStyles,
  getComponentStyles,
  getComponentText,
  getAttributeString,
  getAttributeNumber,
} from '../helpers';

export const cardRenderers = {
  card: (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <Card
      key={component.id}
      variant={(component.variant || 'vertical') as 'vertical' | 'horizontal'}
      isBordered={component.isBordered}
      isHighlighted={component.isHighlighted}
      withShadowHover={component.withShadowHover}
      padding={component.padding}
      className={component.className}
      styles={{
        gap: component.gutter,
        ...getComponentStyles(component.styling),
      }}
    >
      {renderChildren(component.children)}
    </Card>
  ),
  'card-row': (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <Card.Row
      key={component.id}
      gutter={component.gutter ?? component.gap}
      align={component.align as never}
      justify={component.justify as never}
      isWrap={component.isWrap}
      className={component.className}
      styles={{
        padding: component.padding,
        gap: component.gap,
        ...getComponentStyles(component.styling),
      }}
    >
      {renderChildren(component.children)}
    </Card.Row>
  ),
  'card-column': (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <Card.Column
      key={component.id}
      gutter={component.gutter ?? component.gap}
      align={component.align as never}
      justify={component.justify as never}
      isWrap={component.isWrap}
      className={component.className}
      styles={{
        padding: component.padding,
        ...getComponentStyles(component.styling),
      }}
    >
      {renderChildren(component.children)}
    </Card.Column>
  ),
  'card-title': (component: A2UIComponent) => (
    <CardTitle
      key={component.id}
      sizeVariant={component.size === 'sm' ? 'sm' : 'default'}
      styles={getComponentStyles(component.styling)}
    >
      {getComponentText(component)}
    </CardTitle>
  ),
  'card-description': (component: A2UIComponent) => (
    <CardDescription
      key={component.id}
      sizeVariant={component.size === 'sm' ? 'sm' : 'default'}
      styles={getComponentStyles(component.styling)}
    >
      {getComponentText(component)}
    </CardDescription>
  ),
  'card-image': (component: A2UIComponent) => (
    <CardImage
      key={component.id}
      src={getAttributeString(component, 'src')}
      alt={getAttributeString(component, 'alt') || component.label || component.id}
      width={getAttributeNumber(component, 'width')}
      height={getAttributeNumber(component, 'height')}
      fallbackComponent={
        <InlineNotification variant="warning">
          {`Image unavailable${component.label ? `: ${component.label}` : ''}`}
        </InlineNotification>
      }
      styles={getComponentStyles(component.styling)}
    />
  ),
  'card-price': (component: A2UIComponent) => (
    <CardPrice
      key={component.id}
      currentValue={getAttributeString(component, 'currentValue') || getComponentText(component)}
      oldValue={getAttributeString(component, 'oldValue')}
      currencySymbol={getAttributeString(component, 'currencySymbol')}
      currencySymbolPosition={getAttributeString(component, 'currencySymbolPosition') as 'before' | 'after' | undefined}
      sizeVariant={component.size === 'sm' ? 'sm' : 'default'}
      styles={getComponentStyles(component.styling)}
    />
  ),
  'card-button': (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <CardButton
      key={component.id}
      variant={component.variant as never}
      disabled={component.disabled}
      sizeVariant={component.size === 'sm' ? 'sm' : 'default'}
      styles={getComponentStyles(component.styling)}
      onClick={
        dispatchAction && component.actions?.length
          ? () => component.actions!.forEach((id) => dispatchAction(id))
          : undefined
      }
    >
      {getComponentText(component)}
    </CardButton>
  ),
  'card-counter': (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <CardCounter
      key={component.id}
      initial={getAttributeNumber(component, 'initial')}
      min={getAttributeNumber(component, 'min')}
      max={getAttributeNumber(component, 'max')}
      isDisabled={component.disabled}
      sizeVariant={component.size === 'sm' ? 'sm' : 'default'}
      onCounterChange={
        dispatchAction && component.actions?.length
          ? (qty: number) => component.actions!.forEach((id) => dispatchAction(id, { qty }))
          : undefined
      }
    />
  ),
  'card-rating': (component: A2UIComponent) => (
    <CardRating
      key={component.id}
      value={typeof component.value === 'number' ? component.value : 0}
      label={component.label}
      sizeVariant={component.size === 'sm' ? 'sm' : 'default'}
      readOnly
      styles={getComponentStyles(component.styling)}
    />
  ),
};
