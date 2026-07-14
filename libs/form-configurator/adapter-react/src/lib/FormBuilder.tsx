import React, { useState, useEffect, useMemo } from 'react';
import { FormEngine, DataSchema, UISchema, CoreState, CoreActions, ILogger } from 'gd-form-configurator';
import { FormContext, useFormStore } from '../context';
import { Renderer } from './Renderer';
import { ControlRegistry, CustomControl } from '../types';
import { defaultControlRegistry } from '../ControlRegistry';
import { withControlAdapter } from './withControlAdapter';
import { createTester } from './testers';

interface FormBuilderProps {
  schema: DataSchema;
  uischema: UISchema;
  initialData: any;
  customControls?: CustomControl[];
  onChange?: (data: any) => void;
  onSubmit?: (data: any) => void;
  children?: React.ReactNode;
  logger?: ILogger;
}

const FormRenderer = ({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) => {
  const { uischema, schema } = useFormStore((state) => ({
    uischema: state.uischema,
    schema: state.schema,
  }));

  if (!('elements' in uischema)) {
    return null;
  }

  return (
    <form onSubmit={onSubmit}>
      <Renderer uischema={uischema} schema={schema} path="" />
    </form>
  );
};

export const FormBuilder: React.FC<FormBuilderProps> = ({
  schema,
  uischema,
  initialData,
  customControls,
  onChange,
  onSubmit,
  children,
  logger,
}) => {
  const [, setRender] = useState({});

  const controlRegistry: ControlRegistry = useMemo(() => {
    const customRenderers =
      customControls
        ?.map(({ name, tester, renderer }) => ({
          tester: (name ? createTester(name) : tester) as any,
          renderer: withControlAdapter(renderer),
        }))
        .filter((r) => r.tester !== undefined) || [];
    return [...customRenderers, ...defaultControlRegistry];
  }, [customControls]);

  const [engine] = useState(
    () => new FormEngine(schema, uischema, initialData, controlRegistry, () => setRender({}), logger)
  );

  useEffect(() => {
    if (!onChange) return;
    const unsub = engine.subscribe((state: CoreState & CoreActions) => {
      onChange(state.data);
    });
    return () => unsub();
  }, [engine, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      const { data, errors } = engine.useStore.getState();
      if (errors.length === 0) {
        onSubmit(data);
      }
    }
  };

  return (
    <FormContext.Provider value={engine}>
      <FormRenderer onSubmit={handleSubmit} />
      {children}
    </FormContext.Provider>
  );
};
