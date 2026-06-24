'use client';
import { forwardRef } from 'react';

import { get } from '@utils';
import { useTheme } from '@hooks/useTheme';
import { ButtonRole, ButtonTypes, ButtonVariant, TabIndex } from '@types';
import { convertToInlineBoxStyles } from '@tokens/utils';
import { Loader } from '@components/atoms/Loader';

import { COMPONENT_NAME } from './constants';
import { ButtonStyled, ContentStyled, EndIconStyled, StartIconStyled } from './ButtonStyled';
import type { ButtonProps } from './';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  const { theme } = useTheme();

  const {
    variant = ButtonVariant.Primary,
    rounded = get(theme, 'button.attrs.rounded', 'none'),
    children,
    iconStart = null,
    iconEnd = null,
    type = ButtonTypes.Button,
    disabled = false,
    isIcon = false,
    isLoading = false,
    ariaLabel,
    ariaPressed,
    role = ButtonRole.Button,
    fullWidth = false,
    tabIndex = TabIndex.Default,
    onClick,
    justifyContent,
    ...rest
  } = props;

  return (
    <ButtonStyled
      ref={forwardedRef}
      $variant={variant}
      $isIcon={isIcon}
      $fullWidth={fullWidth}
      $rounded={rounded}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      role={role}
      theme={theme}
      tabIndex={tabIndex}
      data-testid={COMPONENT_NAME}
      aria-busy={isLoading || undefined}
      {...convertToInlineBoxStyles(rest as Record<string, string | number | undefined>)}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      {...(ariaPressed ? { 'aria-pressed': ariaPressed } : {})}
    >
      <>
        {iconStart ? (
          <StartIconStyled theme={theme} data-testid={`${COMPONENT_NAME}-icon-start`}>
            {iconStart}
          </StartIconStyled>
        ) : null}
        {children ? (
          <ContentStyled
            theme={theme}
            styles={justifyContent ? { justifyContent } : {}}
            data-testid={`${COMPONENT_NAME}-content`}
          >
            {children}
          </ContentStyled>
        ) : null}
        {iconEnd ? (
          <EndIconStyled theme={theme} data-testid={`${COMPONENT_NAME}-icon-end`}>
            {iconEnd}
          </EndIconStyled>
        ) : null}
        {isLoading ? <Loader {...get(theme, 'button.loader.attrs', { withWrapper: false, size: 'md' })} /> : null}
      </>
    </ButtonStyled>
  );
});

Button.displayName = COMPONENT_NAME;
