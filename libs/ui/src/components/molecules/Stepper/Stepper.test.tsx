import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Stepper } from '.';

describe(COMPONENT_NAME, () => {
  const STEPS_LIST = [
    { label: 'Step 1', customView: 'Step 1 customView' },
    { label: 'Step 2', customView: 'Step 2 customView' },
    { label: 'Step 3', customView: 'Step 3 customView' },
  ];

  it('SHOULD match snapshot', () => {
    const { container } = render(<Stepper steps={STEPS_LIST} />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render all steps and their labels', () => {
    render(<Stepper steps={STEPS_LIST} />);
    const steps = screen.getAllByTestId(`${COMPONENT_NAME}-step`);
    const stepLabels = screen.getAllByTestId(`${COMPONENT_NAME}-step-label`);
    expect(steps).toHaveLength(STEPS_LIST.length);
    expect(stepLabels).toHaveLength(STEPS_LIST.length);
  });

  it('SHOULD switch to the correct step customView when a step is clicked', () => {
    render(<Stepper steps={STEPS_LIST} />);
    const step2 = screen.getByText('Step 2');
    fireEvent.click(step2);
    const stepPanel2 = screen.getByText('Step 2 customView');
    expect(document.body.contains(stepPanel2)).toBe(true);
  });

  it('SHOULD trigger custom stepper handler if it defined', () => {
    const onStepClick = vi.fn();
    render(<Stepper steps={STEPS_LIST} onStepClick={onStepClick} />);
    const step2 = screen.getAllByTestId(`${COMPONENT_NAME}-step`)[1];
    fireEvent.click(step2);
    expect(onStepClick).toHaveBeenCalledWith(1, 'inactive', expect.anything());
  });

  it('SHOULD render icons correctly when isIconsView is true', () => {
    render(<Stepper steps={STEPS_LIST} isIconsView={true} />);
    const stepIcons = screen.getAllByTestId(`${COMPONENT_NAME}-step-icon`);
    expect(stepIcons).toHaveLength(STEPS_LIST.length);
  });
});
