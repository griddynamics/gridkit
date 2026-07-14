import { get, set } from '@utils';
import { InputVariantType, ButtonTypes } from '@types';

import { FormFieldsData } from './Form.types';

export const transformFormDataToObjectWithValues = (targetForm?: HTMLFormElement): FormFieldsData => {
  const formElements = Array.from(get(targetForm, 'elements', []));
  return formElements.reduce((formFieldsData: FormFieldsData, element) => {
    return transformFormElementDataToObjectWithValues(element, formFieldsData);
  }, {});
};

export const transformFormElementDataToObjectWithValues = (
  targetElement: EventTarget,
  output: FormFieldsData = {}
): FormFieldsData => {
  const tagName = get(targetElement, 'tagName', '').toLowerCase();
  const name = get(targetElement, 'name');
  const type: HTMLFormElement['type'] = get(targetElement, 'type');
  const isChecked = get(targetElement, 'checked');
  const value = get(targetElement, 'value');
  const shouldIgnore = tagName === ButtonTypes.Button || type === ButtonTypes.Submit || !name;

  if (!shouldIgnore) {
    switch (type) {
      case InputVariantType.Checkbox:
        set(output, name, { value, isChecked });
        break;
      case InputVariantType.Radio:
        if (isChecked) {
          set(output, name, { value, isChecked });
        }
        // if radio group is not checked, do not add it to the form data
        if (!get(output, [name, 'isChecked'], false)) {
          set(output, name, { value: '', isChecked });
        }
        break;
      default:
        set(output, name, { value });
        break;
    }
  }

  return output;
};
