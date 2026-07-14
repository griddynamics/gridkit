import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { NumberControl } from '../controls/NumberControl';

describe('NumberControl', () => {
  it('should render with initial value and call onChange on change', () => {
    const onChange = vi.fn();

    render(
      <NumberControl
        scope="#/properties/age"
        label="Age"
        value={123}
        onChange={onChange}
        errors={[]}
        isEnabled={true}
        isVisible={true}
        required={false}
      />
    );

    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('123');

    fireEvent.change(input, { target: { value: '456' } });
    expect(onChange).toHaveBeenCalledWith(456);
  });

  it('should display an error message', () => {
    const onChange = vi.fn();

    render(
      <NumberControl
        scope="#/properties/age"
        label="Age"
        value=""
        onChange={onChange}
        errors={[{ instancePath: '/age', message: 'is required' } as any]}
        isEnabled={true}
        isVisible={true}
        required={false}
      />
    );

    expect(screen.getByText('is required')).toBeInTheDocument();
  });
});
