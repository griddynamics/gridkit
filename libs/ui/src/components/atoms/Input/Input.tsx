'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { InputVariantType, SizeVariant } from '@types';

import { COMPONENT_NAME, DEFAULT_PROPS, FOCUS_EXCLUDED_LIST } from './constants';
import { useInputHandlers } from './useInputHandlers';
import { InputWrapper } from './InputWrapper';
import { InputAdornment } from './InputAdornment';
import { InputHelper } from './InputHelper';
import { InputStyled } from './InputStyled';
import { InputFieldProps, InputFieldRestHtmlProps } from './Input.types';

export const Input = forwardRef<HTMLInputElement, InputFieldProps & InputFieldRestHtmlProps>(
  (
    {
      wrapperAs = 'label',
      // Layout props
      styles = {},
      className = '',
      width,

      // Input behavior props
      variant = DEFAULT_PROPS.variant,
      color = DEFAULT_PROPS.color,
      disabled = DEFAULT_PROPS.disabled,
      readOnly = DEFAULT_PROPS.readOnly,

      // Accessibility props
      ariaRequired = DEFAULT_PROPS.ariaRequired,
      role,
      tabIndex = DEFAULT_PROPS.tabIndex,
      ariaDescribedBy,

      // Event handling props
      debounceCallbackTime,
      onChange,
      onKeyDown,
      onMouseDown,
      onBlur,

      // Adornments
      adornmentStart,
      adornmentEnd,

      // Helper text
      label,
      helperText,

      ...rest
    },
    forwardedRef
  ) => {
    const { theme } = useTheme();

    const shouldShowInputFocus = !FOCUS_EXCLUDED_LIST.includes(variant as InputVariantType);
    const hasHelpers = !!(label || helperText);
    const { handlers, isMouseInteraction } = useInputHandlers({
      onKeyDown,
      onBlur,
      onMouseDown,
      onChange,
      debounceCallbackTime,
    });

    return (
      <InputWrapper as={wrapperAs} withGap={hasHelpers} className={className} width={width} styles={styles}>
        {label && <InputHelper>{label}</InputHelper>}
        <InputWrapper width="100%">
          {adornmentStart && <InputAdornment>{adornmentStart}</InputAdornment>}
          <InputStyled
            $isMouseInteraction={isMouseInteraction && shouldShowInputFocus}
            $color={color}
            ref={forwardedRef}
            disabled={disabled}
            role={role}
            theme={theme}
            type={variant}
            readOnly={readOnly}
            tabIndex={tabIndex}
            aria-required={ariaRequired}
            data-testid={COMPONENT_NAME}
            {...handlers}
            {...(ariaDescribedBy ? { 'aria-describedby': ariaDescribedBy } : {})}
            {...rest}
          />
          {shouldShowInputFocus && (
            <>
              <span className={`${COMPONENT_NAME}__border`} />
              <span className={`${COMPONENT_NAME}__outline`} />
            </>
          )}
          {adornmentEnd && <InputAdornment>{adornmentEnd}</InputAdornment>}
        </InputWrapper>
        {helperText && (
          <InputHelper color={color} size={SizeVariant.Sm}>
            {helperText}
          </InputHelper>
        )}
      </InputWrapper>
    );
  }
);

Input.displayName = COMPONENT_NAME;
