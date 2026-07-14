'use client';
import { useCallback, forwardRef, type FormEvent } from 'react';

import { get } from '@utils';

import { useTheme } from '@hooks/useTheme';

import { COMPONENT_NAME } from './constants';
import { transformFormDataToObjectWithValues, transformFormElementDataToObjectWithValues } from './utils';
import { FormStyled } from './FormStyled';
import type { FormProps } from './Form.types';

export const Form = forwardRef<HTMLFormElement, FormProps>((props, forwardedRef) => {
  const { children, ariaLabelBy, describedBy, role, onSubmit, onChange, onFormSubmit, onFormChange, ...rest } = props;
  const { theme } = useTheme();
  const submitHandler = onFormSubmit ?? onSubmit;
  const changeHandler = onFormChange ?? onChange;

  const handleChange = useCallback(
    (event: FormEvent) => {
      if (!changeHandler) return;

      const controlElement = get(event, 'target');
      const formData = transformFormDataToObjectWithValues(get(controlElement, 'form'));
      const controlValues = transformFormElementDataToObjectWithValues(controlElement);

      changeHandler({
        event,
        changedControlNames: Object.keys(controlValues),
        controlValues,
        formData,
      });
    },
    [changeHandler]
  );

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      if (!submitHandler) return;

      const formData = transformFormDataToObjectWithValues(get(event, 'target') as HTMLFormElement);
      submitHandler({ event, formData });
    },
    [submitHandler]
  );

  return (
    <FormStyled
      ref={forwardedRef}
      onSubmit={handleSubmit}
      onChange={handleChange}
      theme={theme}
      data-testid={COMPONENT_NAME}
      {...(ariaLabelBy ? { 'aria-labelledby': ariaLabelBy } : {})}
      {...(describedBy ? { 'aria-describedby': describedBy } : {})}
      {...(role ? { 'aria-role': role } : {})}
      {...rest}
    >
      {children}
    </FormStyled>
  );
});

Form.displayName = COMPONENT_NAME;
