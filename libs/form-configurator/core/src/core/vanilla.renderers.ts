import { UISchema } from '../store';
import { Renderer, RendererRegistryEntry, Tester } from './renderer.types';
import { styleClasses } from './styleClasses';
import { categorizationLayoutRenderer, groupLayoutRenderer } from './layouts';

const createControlElement = (
  path: string,
  schema: any,
  isEnabled: boolean,
  registerControl: (path: string, element: HTMLElement) => void,
  isRequired: boolean,
  elementType: 'input' | 'select' = 'input'
) => {
  const container = document.createElement('div');
  container.className = styleClasses.layout.formGroup;
  registerControl(path, container);

  const label = document.createElement('label');
  label.htmlFor = path;
  label.textContent = schema.title || 'Field';
  label.classList.add(styleClasses.label.root);
  if (isRequired) {
    label.classList.add(styleClasses.label.required);
  }
  const control = document.createElement(elementType);
  control.id = path;
  control.className = styleClasses.control.input;
  (control as HTMLInputElement | HTMLSelectElement).disabled = !isEnabled;
  (control as HTMLInputElement | HTMLSelectElement).required = isRequired;

  container.appendChild(label);
  container.appendChild(control);

  return { container, control };
};

const createInputHandler = (
  path: string,
  valueTransformer: (value: string) => any,
  updateField: (path: string, updater: (existingData: any) => any) => void
) => {
  return (event: Event) => {
    const newValue = (event.target as HTMLInputElement).value;
    updateField(path, () => valueTransformer(newValue));
  };
};

export const stringControlTester: Tester = (uischema, schema) => {
  return uischema.type === 'Control' && schema.type === 'string' ? 1 : -1;
};

export const numberControlTester: Tester = (uischema, schema) => {
  return uischema.type === 'Control' && schema.type === 'number' ? 1 : -1;
};

export const selectControlTester: Tester = (uischema, schema) => {
  return uischema.type === 'Control' && schema.type === 'string' && schema.enum ? 2 : -1;
};

export const selectControlRenderer: Renderer = ({
  schema,
  data,
  path,
  isEnabled,
  isVisible,
  registerControl,
  isRequired,
  updateField,
}) => {
  if (!isVisible) {
    return null;
  }
  const { container, control } = createControlElement(path, schema, isEnabled, registerControl, !!isRequired, 'select');
  const selectElement = control as HTMLSelectElement;

  if (schema.enum) {
    schema.enum.forEach((optionValue: string) => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue;
      if (data === optionValue) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    });
  }
  selectElement.addEventListener(
    'change',
    createInputHandler(path, (value) => value, updateField)
  );

  return container;
};

export const stringControlRenderer: Renderer = ({
  schema,
  data,
  path,
  isEnabled,
  isVisible,
  registerControl,
  isRequired,
  updateField,
}) => {
  if (!isVisible) {
    return null;
  }
  const { container, control } = createControlElement(path, schema, isEnabled, registerControl, !!isRequired);
  const input = control as HTMLInputElement;
  input.type = 'text';
  input.value = data || '';
  input.addEventListener(
    'input',
    createInputHandler(path, (value) => value, updateField)
  );
  return container;
};

export const numberControlRenderer: Renderer = ({
  schema,
  data,
  path,
  isEnabled,
  isVisible,
  registerControl,
  isRequired,
  updateField,
}) => {
  if (!isVisible) {
    return null;
  }
  const { container, control } = createControlElement(path, schema, isEnabled, registerControl, !!isRequired);
  const input = control as HTMLInputElement;
  input.type = 'number';
  input.value = data ?? '';
  input.addEventListener(
    'input',
    createInputHandler(
      path,
      (value) => {
        return value === '' ? null : Number(value);
      },
      updateField
    )
  );
  return container;
};

export const verticalLayoutTester: Tester = (uischema) => {
  return uischema.type === 'VerticalLayout' ? 1 : -1;
};

export const horizontalLayoutTester: Tester = (uischema) => {
  return uischema.type === 'HorizontalLayout' ? 1 : -1;
};

export const verticalLayoutRenderer: Renderer = ({ uischema, schema, data, errors, renderChild, engine }) => {
  const container = document.createElement('div');
  container.className = styleClasses.verticalLayout.root;
  (uischema as any).elements.forEach((childElement: any) => {
    const childPath = childElement.scope.replace('#/properties/', '');
    const childSchema = schema.properties?.[childPath];
    if (childSchema) {
      const isVisible = engine.getVisibility(childPath, data);
      if (isVisible) {
        const childRenderer = renderChild(childElement, childSchema, childPath, errors);
        if (childRenderer) {
          container.appendChild(childRenderer);
        }
      }
    }
  });
  return container;
};

export const horizontalLayoutRenderer: Renderer = ({ uischema, schema, data, errors, renderChild, engine }) => {
  const container = document.createElement('div');
  container.className = styleClasses.horizontalLayout.root;
  (uischema as any).elements.forEach((childElement: any) => {
    const childPath = childElement.scope.replace('#/properties/', '');
    const childSchema = schema.properties?.[childPath];
    if (childSchema) {
      const isVisible = engine.getVisibility(childPath, data);
      if (isVisible) {
        const childRenderer = renderChild(childElement, childSchema, childPath, errors);
        if (childRenderer) {
          container.appendChild(childRenderer);
        }
      }
    }
  });
  return container;
};

export const groupLayoutTester: Tester = (uischema: UISchema) => {
  return uischema.type === 'Group' ? 1 : -1;
};

export const categorizationLayoutTester: Tester = (uischema: UISchema) => {
  return uischema.type === 'Categorization' ? 1 : -1;
};

export const vanillaRenderers: RendererRegistryEntry[] = [
  { tester: selectControlTester, renderer: selectControlRenderer },
  { tester: stringControlTester, renderer: stringControlRenderer },
  { tester: verticalLayoutTester, renderer: verticalLayoutRenderer },
  { tester: numberControlTester, renderer: numberControlRenderer },
  { tester: horizontalLayoutTester, renderer: horizontalLayoutRenderer },
  { tester: groupLayoutTester, renderer: groupLayoutRenderer },
  { tester: categorizationLayoutTester, renderer: categorizationLayoutRenderer },
];
