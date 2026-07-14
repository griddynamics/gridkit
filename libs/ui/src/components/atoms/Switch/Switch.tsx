'use client';
import { forwardRef, useCallback, useEffect, useState, type ChangeEventHandler } from 'react';

import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';
import { get } from '@utils';

import { Loader } from '@components/atoms/Loader';

import { COMPONENT_NAME } from './constants';
import {
  HiddenCheckboxStyled,
  SwitchWrapperStyled,
  SwitchStyled,
  SwitchLabelStyled,
  SwitchSliderStyled,
} from './SwitchStyled';
import type { SwitchProps } from './';

export const Switch = forwardRef<HTMLLabelElement, SwitchProps<HTMLLabelElement>>(
  (
    { onValueChange, checked, disabled = false, isLoading = false, label = 'right', children, ...rest },
    forwardedRef
  ) => {
    const { theme } = useTheme();
    const logger = useLogger();

    const isControlled = checked !== undefined;
    const [checkedInternal, setCheckedInternal] = useState(checked ?? false);

    const currentChecked = isControlled ? checked! : checkedInternal;
    const isDisabled = disabled || isLoading;

    const updateValue = useCallback(
      (newChecked: boolean) => {
        logger.debug(`${COMPONENT_NAME}: Value changed`, {
          newChecked,
          isControlled,
        });
        if (!isControlled) {
          setCheckedInternal(newChecked);
        }
        onValueChange?.(newChecked);
      },
      [onValueChange, isControlled, logger]
    );

    const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
      (event) => {
        logger.debug(`${COMPONENT_NAME}: Value change is disabled:`, {
          isDisabled,
        });
        if (isDisabled) return;
        updateValue(get(event, 'target.checked', false));
      },
      [isDisabled, updateValue, logger]
    );

    // Update internal value when external value changes (controlled mode)
    useEffect(() => {
      logger.debug(`${COMPONENT_NAME}: Update internal value when external value changes:`, {
        checked,
        isControlled,
      });
      if (isControlled) {
        setCheckedInternal(checked!);
      }
    }, [checked, isControlled, logger]);

    return (
      <SwitchWrapperStyled
        theme={theme}
        ref={forwardedRef}
        $disabled={isDisabled}
        data-testid={`${COMPONENT_NAME}-wrapper`}
        {...rest}
      >
        {children && (
          <SwitchLabelStyled
            className="gd-switch-label"
            theme={theme}
            $label={label}
            data-testid={`${COMPONENT_NAME}-label`}
          >
            {children}
          </SwitchLabelStyled>
        )}

        <SwitchStyled data-testid={COMPONENT_NAME} $checked={currentChecked} theme={theme}>
          {isLoading ? (
            <Loader
              {...get(theme, 'switchToken.slider.loader.attrs', {})}
              styles={{ position: 'relative', zIndex: 1 }}
            />
          ) : null}
          <SwitchSliderStyled
            className="gd-switch-slider"
            theme={theme}
            $checked={currentChecked}
            $disabled={isDisabled}
            data-testid={`${COMPONENT_NAME}-slider`}
          />

          <HiddenCheckboxStyled
            theme={theme}
            checked={currentChecked}
            disabled={isDisabled}
            // @ts-expect-error - TS2322: Type 'ChangeEventHandler<HTMLInputElement>' is not assignable to type 'FormEventHandler<HTMLInputElement>'.
            onChange={onChange}
            data-testid={`${COMPONENT_NAME}-checkbox`}
            {...rest}
          />
        </SwitchStyled>
      </SwitchWrapperStyled>
    );
  }
);
