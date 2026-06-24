import { GroupLayout, CategorizationLayout } from '../store';
import { categorizationLayoutRenderer, groupLayoutRenderer } from './layouts';
import { RendererProps } from './renderer.types';

describe('Layout Renderers', () => {
  it('should render a group layout', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/name',
        },
      ],
    };
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    };
    const renderChild = jest.fn();
    const props: RendererProps = {
      uischema,
      schema,
      data: {},
      path: '',
      errors: [],
      isEnabled: true,
      isVisible: true,
      renderChild,
      engine: {
        registerControl: jest.fn(),
        updateField: jest.fn(),
      } as any,
      registerControl: jest.fn(),
      updateField: jest.fn(),
    };
    const result = groupLayoutRenderer(props);
    expect(result).toBeInstanceOf(HTMLElement);
  });

  it('should render a categorization layout', () => {
    const uischema: CategorizationLayout = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
          label: 'Category 1',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/name',
            },
          ],
        },
      ],
    };
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    };
    const renderChild = jest.fn();
    const props: RendererProps = {
      uischema,
      schema,
      data: {},
      path: '',
      errors: [],
      isEnabled: true,
      isVisible: true,
      renderChild,
      engine: {
        registerControl: jest.fn(),
        updateField: jest.fn(),
      } as any,
      registerControl: jest.fn(),
      updateField: jest.fn(),
    };
    const result = categorizationLayoutRenderer(props);
    expect(result).toBeInstanceOf(HTMLElement);
  });
});
