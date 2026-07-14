import { forwardRef } from 'react';
import { get } from '@utils';
import { convertJsonToCssKeyframeCss, defaultTheme } from '@tokens';
import { resolveThemeColor, tokensHandler } from '@tokens/utils';
import type { Theme } from '@hooks';
import {
  DeterminateFillStyledProps,
  IndeterminateFillStyledProps,
  PercentLabelStyledProps,
  ProgressBarStyledProps,
  TrackStyledProps,
} from './ProgressBar.types';

const createProgressBarThemeProxy = (theme: Theme = defaultTheme) => {
  const { progressbar, ...themeRest } = theme;

  return {
    themeProgressBar: new Proxy(
      (progressbar || {}) as Record<string, unknown>,
      tokensHandler(themeRest) as ProxyHandler<Record<string, unknown>>
    ),
    themeRest,
  };
};

export const ProgressBarStyled = forwardRef<HTMLDivElement, ProgressBarStyledProps>((props, forwardedRef) => {
  const { theme = defaultTheme, styles = {}, ...restProps } = props;
  const { themeProgressBar } = createProgressBarThemeProxy(theme);
  const computedStyles = [get(themeProgressBar, 'styledProgressBar.default', {}), styles];

  return <div css={computedStyles} ref={forwardedRef} {...restProps} />;
});

export const TrackStyled = (props: TrackStyledProps) => {
  const { theme = defaultTheme, $backgroundColor, ...restProps } = props;
  const { themeProgressBar, themeRest } = createProgressBarThemeProxy(theme);
  const backgroundColor = resolveThemeColor(themeRest.colors, $backgroundColor);
  const componentStyles = [get(themeProgressBar, 'styledTrack.default', {}), backgroundColor && { backgroundColor }];

  return <div css={componentStyles} {...restProps} />;
};

export const DeterminateFillStyled = (props: DeterminateFillStyledProps) => {
  const { theme = defaultTheme, fill, $width = 0, ...restProps } = props;
  const { themeProgressBar, themeRest } = createProgressBarThemeProxy(theme);
  const resolvedFill = resolveThemeColor(themeRest.colors, fill);
  const computedStyles = [
    get(themeProgressBar, 'styledDeterminateFill.default', {}),
    resolvedFill && { backgroundColor: resolvedFill },
    $width && { width: `${$width}%` },
  ];

  return <div css={computedStyles} {...restProps} />;
};

export const IndeterminateFillStyled = (props: IndeterminateFillStyledProps) => {
  const { theme = defaultTheme, fill, $animationName, $animationProps, ...restProps } = props;
  const { themeProgressBar, themeRest } = createProgressBarThemeProxy(theme);
  const defaultAnimationName = get(
    themeProgressBar,
    'styledIndeterminateFillAnimations.animationName',
    'progressIndeterminate'
  );
  const animationNameToUse = $animationName || defaultAnimationName;

  const animationKeyframeName = animationNameToUse ? get(themeRest.animations, animationNameToUse, null) : null;
  const animationName = animationKeyframeName ? convertJsonToCssKeyframeCss(animationKeyframeName) : animationNameToUse;
  const animationProps = $animationProps
    ? $animationProps
    : get(themeProgressBar, 'styledIndeterminateFillAnimations.animationProps', '');
  const resolvedFill = resolveThemeColor(themeRest.colors, fill);

  const animation = {
    animation: `${animationName} ${animationProps}`,
  };

  const computedStyles = [
    get(themeProgressBar, 'styledIndeterminateFill.default', {}),
    resolvedFill ? { backgroundColor: resolvedFill } : {},
    animationName ? animation : {},
  ];

  return <div css={computedStyles} {...restProps} />;
};

export const PercentLabelStyled = (props: PercentLabelStyledProps) => {
  const { theme = defaultTheme, ...restProps } = props;
  const { themeProgressBar } = createProgressBarThemeProxy(theme);
  const computedStyles = [get(themeProgressBar, 'styledPercentLabel.default', {})];
  return <span css={computedStyles} {...restProps} />;
};
