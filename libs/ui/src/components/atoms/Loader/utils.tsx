'use client';
import { CSSObject } from '@emotion/react';

import { convertJsonToCssKeyframeCss } from '@tokens';

export const getAnimationDataByName = (
  animationName?: string,
  animationKeyframes: Record<string, CSSObject> = {},
  animationProps?: string
) => {
  const cssFrames = convertJsonToCssKeyframeCss(animationKeyframes);
  const animation = `${cssFrames} ${animationProps}`;

  switch (animationName) {
    case 'dots':
      return {
        animation: null,
        AnimationView: () => (
          <>
            <span css={{ animation }} className="dot" />
            <span css={{ animation }} className="dot" />
            <span css={{ animation }} className="dot" />
          </>
        ),
      };
    case 'circle':
      return {
        animation,
        AnimationView: () => null,
      };
    default: {
      return {
        animation: null,
        AnimationView: () => null,
      };
    }
  }
};
