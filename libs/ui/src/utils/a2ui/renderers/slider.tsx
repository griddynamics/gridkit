import type { ReactNode } from 'react';
import { Slider, SliderDots } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getComponentStyles, getAttributeNumber } from '../helpers';

function getSliderDotsCount(component: A2UIComponent) {
  if (typeof component.count === 'number') {
    return component.count;
  }

  return getAttributeNumber(component, 'count') ?? 0;
}

function getSliderDotsActiveIndex(component: A2UIComponent) {
  if (typeof component.activeIndex === 'number') {
    return component.activeIndex;
  }

  return getAttributeNumber(component, 'activeIndex') ?? 0;
}

export const sliderRenderers = {
  slider: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Slider
      key={component.id}
      min={component.min ?? getAttributeNumber(component, 'min')}
      max={component.max ?? getAttributeNumber(component, 'max')}
      step={component.step ?? getAttributeNumber(component, 'step')}
      value={typeof component.value === 'number' ? component.value : undefined}
      disabled={component.disabled}
      aria-label={component.ariaLabel}
      className={component.className}
      styles={getMergedComponentStyles(component)}
      onChange={
        dispatchAction && component.actions?.length
          ? (value: number) => component.actions!.forEach((id) => dispatchAction(id, { value }))
          : undefined
      }
    />
  ),
  'slider-dots': (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <SliderDots
      key={component.id}
      count={getSliderDotsCount(component)}
      activeIndex={getSliderDotsActiveIndex(component)}
      aria-label={component.ariaLabel}
      className={component.className}
      styles={getComponentStyles(component.styling)}
      onDotClick={
        dispatchAction && component.actions?.length
          ? (index: number) => component.actions!.forEach((id) => dispatchAction(id, { index, activeIndex: index }))
          : undefined
      }
    />
  ),
};
