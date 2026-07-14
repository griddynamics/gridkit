'use client';
import { forwardRef, PropsWithChildren } from 'react';

import { useTheme } from '@hooks/useTheme';
import { ButtonVariant, CardSizeVariant, CardVariant } from '@types';
import { Button, CardButtonProps } from '@components';

import { COMPONENT_NAME } from './constants';
import { CardButtonStyled } from './CardButtonStyled';

export const CardButton = forwardRef<HTMLDivElement, PropsWithChildren<CardButtonProps>>((props, forwardedRef) => {
  const {
    sizeVariant = CardSizeVariant.Default,
    children,
    variant = ButtonVariant.Outlined,
    cardVariant = CardVariant.Vertical,
    ...rest
  } = props;
  const { theme } = useTheme();

  return (
    <CardButtonStyled
      ref={forwardedRef}
      theme={theme}
      $cardVariant={cardVariant}
      $sizeVariant={sizeVariant}
      data-testid={COMPONENT_NAME}
    >
      <Button variant={variant} fullWidth {...rest}>
        {children}
      </Button>
    </CardButtonStyled>
  );
});

CardButton.displayName = COMPONENT_NAME;
