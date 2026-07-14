import React from 'react';
import { UISchema, styleClasses } from 'gd-form-configurator';
import { Renderer } from '../lib/Renderer';

interface HorizontalLayoutProps {
  uischema: UISchema;
  schema: any;
  path: string;
}

export const HorizontalLayout: React.FC<HorizontalLayoutProps> = ({ uischema, schema, path }) => {
  if (uischema.type !== 'HorizontalLayout') {
    return null;
  }
  const { elements } = uischema as any;
  return (
    <div className={styleClasses.horizontalLayout.root}>
      {elements.map((element: any, index: number) => {
        const propertyName = element.scope.split('/').pop();
        const elementPath = path ? `${path}.${propertyName}` : propertyName;
        return <Renderer key={index} uischema={element} schema={schema} path={elementPath} parentSchema={schema} />;
      })}
    </div>
  );
};
