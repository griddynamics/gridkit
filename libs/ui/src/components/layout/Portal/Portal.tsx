'use client';
import { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { Wrapper } from '@components/atoms/Wrapper';
import { WrapperVariant } from '@types';

import type { PortalProps } from './';

export const Portal = forwardRef<HTMLBaseElement, PortalProps>((props, forwardedRef) => {
  const {
    children,
    container,
    wrapperVariant = WrapperVariant.FullPage,
    withWrapper = true,
    WrapperView = 'div',
    blocksScroll,
    ...rest
  } = props;

  useEffect(() => {
    const isAlreadyBlocked = document.body.style.overflow === 'hidden';
    if (blocksScroll && !isAlreadyBlocked) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (isAlreadyBlocked) return;
      document.body.style.overflow = '';
    };
  }, [blocksScroll]);

  const target = container ?? (typeof document !== 'undefined' ? document.body : null);
  if (!target) return null;

  return createPortal(
    withWrapper ? (
      <Wrapper ref={forwardedRef} variant={wrapperVariant} as={WrapperView} {...rest}>
        {children}
      </Wrapper>
    ) : (
      children
    ),
    target
  );
});
