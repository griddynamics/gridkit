import { renderUi } from './dispatch.service';
import {
  stringControlRenderer,
  stringControlTester,
  verticalLayoutRenderer,
  verticalLayoutTester,
} from './vanilla.renderers';
import { RendererRegistryEntry } from './renderer.types';
import { FormEngine } from '../orchestrator/form-configurator';

describe('renderUi', () => {
  const registry: RendererRegistryEntry[] = [
    { tester: stringControlTester, renderer: stringControlRenderer },
    { tester: verticalLayoutTester, renderer: verticalLayoutRenderer },
  ];

  const mockEngine = {
    registerControl: jest.fn(),
    updateField: jest.fn(),
    getVisibility: jest.fn().mockReturnValue(true),
  } as unknown as FormEngine;

  it('should render a simple control', () => {
    const uischema = { type: 'Control', scope: '#/properties/name', elements: [] };
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name' },
      },
    };
    const data = { name: 'John Doe' };

    const result = renderUi(uischema, schema.properties.name, data.name, [], registry, mockEngine, {}, {});
    const input = result.querySelector('input');
    const label = result.querySelector('label');

    expect(result.className).toContain('form-group');
    expect(input?.value).toBe('John Doe');
    expect(label?.textContent).toBe('Name');
  });

  it('should render a layout with children', () => {
    const uischema = {
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/firstName', elements: [] },
        { type: 'Control', scope: '#/properties/lastName', elements: [] },
      ],
    };
    const schema = {
      type: 'object',
      properties: {
        firstName: { type: 'string', title: 'First Name' },
        lastName: { type: 'string', title: 'Last Name' },
      },
    };
    const data = { firstName: 'John', lastName: 'Doe' };

    const renderChild = (ui: any, s: any, p: any, e: any) => {
      return stringControlRenderer({
        uischema: ui,
        schema: s,
        path: p,
        errors: e,
        data: (data as any)[p],
        engine: mockEngine,
        isEnabled: true,
        isVisible: true,
        registerControl: mockEngine.registerControl,
        updateField: mockEngine.updateField,
        renderChild: jest.fn(),
      });
    };

    const result = verticalLayoutRenderer({
      uischema,
      schema,
      data,
      errors: [],
      engine: mockEngine,
      isEnabled: true,
      isVisible: true,
      path: '',
      renderChild,
      registerControl: mockEngine.registerControl,
      updateField: mockEngine.updateField,
    });

    const inputs = result.querySelectorAll('input');
    const labels = result.querySelectorAll('label');

    expect(result.className).toContain('vertical-layout');
    expect(inputs.length).toBe(2);
    expect(labels.length).toBe(2);
    expect(inputs[0].value).toBe('John');
    expect(labels[0].textContent).toBe('First Name');
    expect(inputs[1].value).toBe('Doe');
    expect(labels[1].textContent).toBe('Last Name');
  });

  it('should select the renderer with the highest rank', () => {
    const highRankTester = (uischema: any, schema: any) =>
      uischema.type === 'Control' && schema.type === 'string' ? 10 : -1;
    const highRankRenderer = () => {
      const div = document.createElement('div');
      div.className = 'special-input';
      return div;
    };

    const customRegistry: RendererRegistryEntry[] = [
      ...registry,
      { tester: highRankTester, renderer: highRankRenderer },
    ];

    const uischema = { type: 'Control', scope: '#/properties/name', elements: [] };
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name' },
      },
    };
    const data = { name: 'John Doe' };

    const result = renderUi(uischema, schema.properties.name, data.name, [], customRegistry, mockEngine, {}, {});

    expect(result.className).toBe('special-input');
  });
});
