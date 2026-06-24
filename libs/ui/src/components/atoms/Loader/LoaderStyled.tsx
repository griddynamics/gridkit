import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import { WrapperVariant, SizeVariant, type BoxStyles } from '@types';

import { getAnimationDataByName } from './utils';
import type { LoaderStyledProps } from './Loader.types';

export const LoaderStyled = forwardRef<HTMLSpanElement, LoaderStyledProps>(
  (
    {
      theme: { loader, animations, ...rest } = {},
      styles,
      $name,
      $variant = WrapperVariant.Inline,
      $size = SizeVariant.Md,
      $animationProps,
      children,
      $rounded,
      ...restProps
    },
    forwardedRef
  ) => {
    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
    const themeLoader = new Proxy(loader || {}, tokensHandler(rest));
    const animationName = get(themeLoader, ['animation', $name, 'name'], '');
    const animationKeyframe = get(animations, animationName, {});
    const { animation, AnimationView } = getAnimationDataByName($name, animationKeyframe, $animationProps);
    const computedStyles = [
      get(themeLoader, 'default', {}),
      get(themeLoader, $variant, {}),
      get(themeLoader, [$name, 'default'], {}),
      get(themeLoader, [$name, $size], {}),
      $name !== 'circle' ? { '.dot': { borderRadius: get(rest, ['radius', $rounded], '0px') } } : {},
      ...(animation ? [{ animation }] : []),
      boxStyles,
      styles,
    ];

    return (
      <span css={computedStyles} {...restNotStyledProps} ref={forwardedRef}>
        <AnimationView />
        {children}
      </span>
    );
  }
);
