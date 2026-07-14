import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { TextControl } from '../controls/TextControl';

describe('TextControl', () => {
  it('should render with initial value and call onChange on change', () => {
    const onChange = vi.fn();

    render(
      <TextControl
        scope="#/properties/name"
        label="Name"
        value="Initial Text"
        onChange={onChange}
        errors={[]}
        isEnabled={true}
        isVisible={true}
        required={false}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Initial Text');

    fireEvent.change(input, { target: { value: 'New Text' } });
    expect(onChange).toHaveBeenCalledWith('New Text');
  });

  it('should display an error message', () => {
    const onChange = vi.fn();

    render(
      <TextControl
        scope="#/properties/name"
        label="Name"
        value=""
        onChange={onChange}
        errors={[{ instancePath: '/name', message: 'is required' } as any]}
        isEnabled={true}
        isVisible={true}
        required={false}
      />
    );

    expect(screen.getByText('is required')).toBeInTheDocument();
  });
});
