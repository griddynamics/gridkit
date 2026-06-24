import React from 'react';
import { UISchema, DataSchema, ControlElement, RendererRegistryEntry } from 'gd-form-configurator';
import { ErrorObject } from 'ajv';
import { useFormEngine, useFormStore } from '../context';
import { resolveSchema } from './resolveSchema';

interface RendererProps {
  uischema: UISchema;
  schema: DataSchema;
  path: string;
  parentSchema?: DataSchema;
}

export const findRenderer = (
  renderers: RendererRegistryEntry[],
  uischema: UISchema,
  schema: DataSchema
): RendererRegistryEntry | undefined => {
  if (!renderers) {
    return undefined;
  }
  const applicableRenderers = renderers.filter((renderer) => renderer.tester(uischema, schema) > -1);
  applicableRenderers.sort((a, b) => b.tester(uischema, schema) - a.tester(uischema, schema));
  return applicableRenderers[0];
};

export const Renderer: React.FC<RendererProps> = ({ uischema, schema, path, parentSchema }) => {
  const engine = useFormEngine();
  const { controlRegistry, updateField, registerControl } = engine;

  const { data, errors, enablement, visibility } = useFormStore((state) => ({
    data: state.data,
    errors: state.errors,
    enablement: state.enablement,
    visibility: state.visibility,
  }));

  const elementSchema = (uischema as ControlElement).scope
    ? resolveSchema(schema, (uischema as ControlElement).scope)
    : schema;

  if (!elementSchema) {
    return null;
  }

  const rendererEntry = findRenderer(controlRegistry, uischema, elementSchema);

  if (!rendererEntry) {
    console.warn('No renderer found for', uischema, elementSchema);
    return null;
  }

  const RendererComponent = rendererEntry.renderer;

  const isVisible = visibility[path] !== false;

  const propertyName = (uischema as ControlElement).scope?.split('/').pop() || '';
  const isRequired = parentSchema?.required?.includes(propertyName) || schema?.required?.includes(propertyName);

  if (!isVisible) {
    return null;
  }

  const renderChild = (
    childUischema: UISchema,
    _childSchema: DataSchema,
    childPath: string,
    _errors: ErrorObject[]
  ) => {
    return <Renderer uischema={childUischema} schema={schema} path={childPath} parentSchema={schema} />;
  };

  const props = {
    uischema,
    schema: elementSchema,
    path,
    engine,
    data,
    errors: errors.filter((error: ErrorObject) => error.instancePath.substring(1).replace(/\//g, '.') === path),
    isEnabled: enablement[path] !== false,
    isVisible,
    isRequired: !!isRequired,
    renderChild,
    updateField,
    registerControl,
  };

  return <RendererComponent {...props} />;
};
