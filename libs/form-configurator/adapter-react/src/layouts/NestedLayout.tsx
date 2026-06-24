import React from 'react';
import { UISchema, styleClasses, parseScopePath } from 'gd-form-configurator';
import { Renderer } from '../lib/Renderer';
import { useFormStore } from '../context';

interface NestedLayoutProps {
  uischema: UISchema;
  schema: any;
  path: string;
  parentSchema?: any;
}

export const NestedLayoutComponent: React.FC<NestedLayoutProps> = ({ uischema, schema, path, parentSchema }) => {
  const rootSchema = useFormStore((state) => state.schema);

  if (uischema.type !== 'NestedLayout') {
    return null;
  }

  const { elements, scope, label } = uischema as any;

  if (!schema) {
    console.warn(`Could not resolve schema for scope ${scope}`);
    return null;
  }

  return (
    <fieldset className={styleClasses.groupLayout.root}>
      {label && <legend className={styleClasses.groupLayout.legend}>{label}</legend>}
      {elements.map((element: any, index: number) => {
        const childElementPath = element.scope ? parseScopePath(element.scope) : '';

        return (
          <Renderer key={index} uischema={element} schema={rootSchema} path={childElementPath} parentSchema={schema} />
        );
      })}
    </fieldset>
  );
};
