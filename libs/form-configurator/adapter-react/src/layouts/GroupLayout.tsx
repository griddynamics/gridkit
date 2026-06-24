import React from 'react';
import { UISchema, styleClasses, parseScopePath } from 'gd-form-configurator';
import { Renderer } from '../lib/Renderer';

interface GroupLayoutProps {
  uischema: UISchema;
  schema: any;
  path: string;
}

export const GroupLayoutComponent: React.FC<GroupLayoutProps> = ({ uischema, schema, path }) => {
  if (uischema.type !== 'Group') {
    return null;
  }

  const { elements, label } = uischema as any;

  return (
    <fieldset className={styleClasses.groupLayout.root}>
      {label && <legend className={styleClasses.groupLayout.legend}>{label}</legend>}
      {elements.map((element: any, index: number) => {
        const elementPath = element.scope ? parseScopePath(element.scope) : '';

        return <Renderer key={index} uischema={element} schema={schema} path={elementPath} parentSchema={schema} />;
      })}
    </fieldset>
  );
};
