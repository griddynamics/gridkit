import { CategorizationLayout, GroupLayout, DataSchema } from '../store';
import { RendererProps } from './renderer.types';
import { styleClasses } from './styleClasses';

export const groupLayoutRenderer = ({ uischema, schema, renderChild, errors }: RendererProps) => {
  const groupLayout = uischema as GroupLayout;
  const container = document.createElement('fieldset');
  container.className = styleClasses.groupLayout.root;

  if (groupLayout.label) {
    const legend = document.createElement('legend');
    legend.textContent = groupLayout.label;
    legend.className = styleClasses.groupLayout.legend;
    container.appendChild(legend);
  }

  groupLayout.elements.forEach((childElement: any) => {
    let childRenderer;
    if (childElement.scope) {
      const childPath = childElement.scope.replace('#/properties/', '').replace(/\//g, '.');
      const pathSegments = childPath.split('.');
      let childSchema: DataSchema | undefined = schema;
      for (const segment of pathSegments) {
        if (childSchema && childSchema.properties) {
          childSchema = childSchema.properties[segment];
        } else if (childSchema && childSchema.type === 'object') {
          childSchema = (childSchema.properties as any)?.[segment];
        } else {
          childSchema = undefined;
          break;
        }
      }

      if (childSchema) {
        childRenderer = renderChild(childElement, childSchema, childPath, errors);
      }
    } else {
      childRenderer = renderChild(childElement, schema, '', errors);
    }

    if (childRenderer) {
      container.appendChild(childRenderer);
    }
  });

  return container;
};

export const categorizationLayoutRenderer = ({ uischema, schema, renderChild, errors }: RendererProps) => {
  const categorizationLayout = uischema as CategorizationLayout;
  const container = document.createElement('div');
  container.className = styleClasses.categorizationLayout.root;

  const tabContainer = document.createElement('div');
  tabContainer.className = styleClasses.categorizationLayout.tabs;
  container.appendChild(tabContainer);

  const contentContainer = document.createElement('div');
  contentContainer.className = styleClasses.categorizationLayout.tabContent;
  container.appendChild(contentContainer);

  categorizationLayout.elements.forEach((category: any, index: number) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.textContent = category.label;
    tab.className = styleClasses.categorizationLayout.tab;
    tabContainer.appendChild(tab);

    const content = document.createElement('div');
    content.className = styleClasses.categorizationLayout.tabPane;
    if (index === 0) {
      content.classList.add(styleClasses.categorizationLayout.active);
      tab.classList.add(styleClasses.categorizationLayout.active);
    }
    contentContainer.appendChild(content);

    tab.onclick = () => {
      tabContainer
        .querySelectorAll(`.${styleClasses.categorizationLayout.tab}`)
        .forEach((t) => t.classList.remove(styleClasses.categorizationLayout.active));
      contentContainer
        .querySelectorAll(`.${styleClasses.categorizationLayout.tabPane}`)
        .forEach((p) => p.classList.remove(styleClasses.categorizationLayout.active));
      tab.classList.add(styleClasses.categorizationLayout.active);
      content.classList.add(styleClasses.categorizationLayout.active);
    };

    category.elements.forEach((childElement: any) => {
      let childRenderer;
      if (childElement.scope) {
        const childPath = childElement.scope.replace('#/properties/', '').replace(/\//g, '.');
        const pathSegments = childPath.split('.');
        let childSchema: DataSchema | undefined = schema;
        for (const segment of pathSegments) {
          if (childSchema && childSchema.properties) {
            childSchema = childSchema.properties[segment];
          } else {
            childSchema = undefined;
            break;
          }
        }

        if (childSchema) {
          childRenderer = renderChild(childElement, childSchema, childPath, errors);
        }
      } else {
        childRenderer = renderChild(childElement, schema, '', errors);
      }

      if (childRenderer) {
        content.appendChild(childRenderer);
      }
    });
  });

  return container;
};
