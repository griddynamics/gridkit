'use client';
import { useCallback, forwardRef, Fragment, MouseEvent } from 'react';
import { useTheme } from '@hooks/useTheme';
import { StepStatus, StepValidationStatus } from '@types';

import { COMPONENT_NAME } from './constants';
import { getStepStatusIcon } from './utils';
import { StepperProps } from './Stepper.types';
import { SeparatorStyled, StepIconStyled, StepLabelStyled, StepperStyled, StepStyled } from './StepperStyled';

export const Stepper = forwardRef<HTMLDivElement, StepperProps>((props, forwardedRef) => {
  const { steps = [], isIconsView = false, activeStep = 0, onStepClick, ...rest } = props;
  const { theme } = useTheme();
  const onStepClickHandler = useCallback(
    (idx: number, status: StepStatus) => (event: MouseEvent) => onStepClick?.(idx, status, event),
    [onStepClick]
  );
  const getStepStatus = (idx: number) => {
    if (idx === activeStep) {
      return StepStatus.Active;
    }
    if (idx < activeStep) {
      return StepStatus.Complete;
    }
    return StepStatus.Inactive;
  };

  return (
    <StepperStyled ref={forwardedRef} theme={theme} data-testid={COMPONENT_NAME} {...rest}>
      {steps.map(({ validationStatus = StepValidationStatus.Success, customView, label }, idx) => {
        const status = getStepStatus(idx);
        const isLastItem = idx < steps.length - 1;
        const contentView =
          getStepStatusIcon({
            status,
            validationStatus,
            customView,
            isIconsView,
            theme,
          }) || idx + 1;

        return (
          <Fragment key={`${COMPONENT_NAME}-step-${idx}`}>
            <StepStyled
              theme={theme}
              $status={status}
              onClick={onStepClick && onStepClickHandler(idx, status)}
              data-testid={`${COMPONENT_NAME}-step`}
            >
              <StepIconStyled
                theme={theme}
                $status={status}
                $validationStatus={validationStatus}
                data-testid={`${COMPONENT_NAME}-step-icon`}
              >
                {contentView}
              </StepIconStyled>
              {label && (
                <StepLabelStyled
                  theme={theme}
                  $status={status}
                  $validationStatus={validationStatus}
                  data-testid={`${COMPONENT_NAME}-step-label`}
                >
                  {label}
                </StepLabelStyled>
              )}
            </StepStyled>
            {isLastItem && <SeparatorStyled theme={theme} $status={status} />}
          </Fragment>
        );
      })}
    </StepperStyled>
  );
});
