import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SelectControl } from '../controls/SelectControl';

describe('SelectControl', () => {
  it('should render with initial value and call onChange on change', () => {
    const onChange = vi.fn();

    const options = [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
    ];

    render(
      <SelectControl
        scope="#/properties/gender"
        label="Gender"
        value="female"
        onChange={onChange}
        errors={[]}
        isEnabled={true}
        isVisible={true}
        required={false}
        options={options}
      />
    );

    const selectButton = screen.getByRole('button') as HTMLButtonElement;
    expect(selectButton.textContent).toBe('Female');

    fireEvent.click(selectButton);
    const maleOption = screen.getByText('Male');
    fireEvent.click(maleOption);
    expect(onChange).toHaveBeenCalledWith('male');
  });

  it('should display an error message', () => {
    const onChange = vi.fn();

    render(
      <SelectControl
        scope="#/properties/gender"
        label="Gender"
        value=""
        onChange={onChange}
        errors={[{ instancePath: '/gender', message: 'is required' } as any]}
        isEnabled={true}
        isVisible={true}
        required={false}
        options={[]}
      />
    );

    expect(screen.getByText('is required')).toBeInTheDocument();
  });
});
