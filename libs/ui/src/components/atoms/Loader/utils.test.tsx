import { Fragment } from 'react';
import { expect } from 'vitest';

import { getAnimationDataByName } from './utils';

describe('Utilities', () => {
  describe('getAnimationDataByName', () => {
    const animationKeyframes = {
      '0%': {
        transform: 'rotate(0deg)',
      },
    };
    const animationProps = '1s ease-in-out infinite';

    it('SHOULD return animation string and render method for "circle" and default cases', () => {
      const result = getAnimationDataByName('circle', animationKeyframes, animationProps);
      expect(result.AnimationView()).toBeNull();
      expect(result.animation).toMatch(
        `_EMO_animation-1xswr18_@keyframes animation-1xswr18{0% { transform: rotate(0deg) } }_EMO_ ${animationProps}`
      );
    });

    it('SHOULD return animation string and render method for "dots"', () => {
      const result = getAnimationDataByName('dots', animationKeyframes, animationProps);
      const fragment = result.AnimationView();

      expect(fragment.type).toBe(Fragment);
      expect(result.animation).toBeNull();
    });
  });
});
