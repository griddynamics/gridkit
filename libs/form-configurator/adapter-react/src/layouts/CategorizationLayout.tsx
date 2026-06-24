import React, { useState } from 'react';
import { Layout, Category, styleClasses, UISchema } from 'gd-form-configurator';
import { Renderer } from '../lib/Renderer';

interface CategorizationLayoutProps {
  uischema: UISchema;
  schema: any;
  path: string;
}

export const CategorizationLayoutComponent: React.FC<CategorizationLayoutProps> = ({ uischema, schema, path }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (uischema.type !== 'Categorization') {
    return null;
  }
  const { elements } = uischema as Layout;
  const categories = elements as Category[];
  return (
    <div className={styleClasses.categorizationLayout.root}>
      <div className={styleClasses.categorizationLayout.tabs}>
        {categories.map((category: Category, index: number) => (
          <button
            key={index}
            type="button"
            className={`${styleClasses.categorizationLayout.tab} ${
              index === activeTab ? styleClasses.categorizationLayout.active : ''
            }`}
            onClick={() => setActiveTab(index)}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className={styleClasses.categorizationLayout.tabContent}>
        {categories.map((category: Category, index: number) => (
          <div
            key={index}
            className={`${styleClasses.categorizationLayout.tabPane} ${
              index === activeTab ? styleClasses.categorizationLayout.active : ''
            }`}
          >
            {category.elements.map((element: any, elIndex: number) => {
              const propertyName = element.scope ? element.scope.split('/').pop() : String(elIndex);
              const elementPath = path ? `${path}.${propertyName}` : propertyName;
              return (
                <Renderer key={elIndex} uischema={element} schema={schema} path={elementPath} parentSchema={schema} />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
