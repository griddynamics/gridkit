import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testUtils';

import '@testing-library/jest-dom';

import { Slider } from './Slider';

describe('Slider', () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<Slider />);

    expect(container).toMatchSnapshot();
  });

  it('SHOULD render with initial value', () => {
    render(<Slider value={42} />);

    const slider = screen.getByRole('slider');

    expect(slider).toBeInTheDocument();
    expect(slider).toHaveValue('42');
  });

  it('SHOULD call onChange when value changes', () => {
    const handleChange = vi.fn();

    render(<Slider onChange={handleChange} />);

    const slider = screen.getByRole('slider');

    fireEvent.change(slider, { target: { value: 55 } });

    expect(handleChange).toHaveBeenCalledWith(55);
    expect(slider).toHaveValue('55');
  });

  it('SHOULD be disabled when disabled prop is true', () => {
    render(<Slider disabled />);

    const slider = screen.getByRole('slider');

    expect(slider).toBeDisabled();
  });

  it('SHOULD respect min prop', () => {
    render(<Slider min={10} max={20} value={15} />);

    const slider = screen.getByRole('slider');

    expect(slider).toHaveAttribute('min', '10');
  });

  it('SHOULD respect max prop', () => {
    render(<Slider min={10} max={20} value={15} />);

    const slider = screen.getByRole('slider');

    expect(slider).toHaveAttribute('max', '20');
  });
});
