import React from 'react';
import { ErrorObject } from 'ajv';
import { UISchema, RendererRegistryEntry, getNestedValue } from 'gd-form-configurator';
import { useFormStore, useFormEngine } from '../context';
import { defaultControlRegistry } from '../ControlRegistry';

interface ControlRendererProps {
  uischema: UISchema;
  schema: any;
  path: string;
}

export const ControlRenderer: React.FC<ControlRendererProps> = ({ uischema, schema, path }) => {
  const engine = useFormEngine();
  const {
    rendererRegistry = [],
    data,
    errors,
    enablement,
    visibility,
  } = useFormStore((state) => ({
    rendererRegistry: state.rendererRegistry,
    data: state.data,
    errors: state.errors,
    enablement: state.enablement,
    visibility: state.visibility,
  }));

  const controlType = uischema.type;

  const findRenderer = (registry: RendererRegistryEntry[]) =>
    registry.find((r: RendererRegistryEntry) => r.tester(uischema, schema));

  const renderer = findRenderer(rendererRegistry) || findRenderer(defaultControlRegistry);

  if (renderer) {
    const Component = renderer.renderer;
    const props = {
      uischema,
      schema,
      path,
      data: getNestedValue(data, path),
      errors: errors?.filter((e: ErrorObject) => e.instancePath.includes(path)),
      engine,
      isEnabled: enablement[path] !== false,
      isVisible: visibility[path] !== false,
      isRequired: schema?.required?.includes(path.split('.').pop() || ''),
      renderChild: () => <div>renderChild not implemented in react adapter</div>,
      registerControl: engine.registerControl,
      updateField: engine.updateField,
    };
    return <Component {...props} />;
  }

  return <div>Unknown control type: {controlType}</div>;
};
