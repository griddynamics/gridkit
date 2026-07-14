import React from 'react';
import { render, screen } from '@testing-library/react';
import { DataSchema, UISchema } from 'gd-form-configurator';
import { vi } from 'vitest';
import { FormBuilder } from '../lib/FormBuilder';

vi.mock('../layouts/VerticalLayout', () => ({
  VerticalLayout: () => <div data-testid="vertical-layout" />,
}));

describe('FormBuilder', () => {
  it('should render a vertical layout', () => {
    const schema: DataSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    };
    const uischema: UISchema = {
      type: 'VerticalLayout',
      elements: [{ type: 'Control', scope: '#/properties/name' }],
    };
    render(<FormBuilder schema={schema} uischema={uischema} initialData={{}} />);
    expect(screen.getByTestId('vertical-layout')).toBeInTheDocument();
  });
});
