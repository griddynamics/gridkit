import { describe, it, vi, expect } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { Rating } from './Rating';
import { COMPONENT_NAME } from './constants';

describe(COMPONENT_NAME, () => {
  const DEFAULT_PROPS = {
    max: 5,
    value: 3,
    onChange: vi.fn(),
    groupName: 'rating-group',
    readOnly: false,
    size: 'md',
  };

  it('SHOULD match snapshot', () => {
    const { container } = render(<Rating {...DEFAULT_PROPS} />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render the correct number of rating items based on max prop', () => {
    render(<Rating {...DEFAULT_PROPS} max={7} />);
    const ratingItems = screen.getAllByTestId(`${COMPONENT_NAME}-label`);
    expect(ratingItems).toHaveLength(7);
  });

  it('SHOULD check input based on value prop', () => {
    const SELECTED_VAL = 3;
    render(<Rating value={SELECTED_VAL} />);
    const radioList: HTMLInputElement[] = screen.getAllByTestId(`${COMPONENT_NAME}-input`);
    expect(radioList[SELECTED_VAL - 1].checked).toBe(true);
  });

  it('SHOULD call onChange when a star is clicked', () => {
    const onChange = vi.fn();
    render(<Rating onChange={onChange} />);
    const thirdStar = screen.getAllByTestId(`${COMPONENT_NAME}-label`)[2];
    fireEvent.click(thirdStar);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('SHOULD not call onChange when readOnly is true', () => {
    render(<Rating {...DEFAULT_PROPS} readOnly />);
    const thirdStar = screen.getAllByTestId(`${COMPONENT_NAME}-label`)[2];
    fireEvent.click(thirdStar);
    expect(DEFAULT_PROPS.onChange).not.toHaveBeenCalled();
  });

  it('SHOULD select a star on Enter key press when not readOnly', () => {
    render(<Rating {...DEFAULT_PROPS} />);
    const thirdStar = screen.getAllByTestId(`${COMPONENT_NAME}-label`)[2];
    fireEvent.keyDown(thirdStar, { key: 'Enter' });
    expect(DEFAULT_PROPS.onChange).toHaveBeenCalledWith(3);
  });

  it('SHOULD NOT select a star on Enter key press when readOnly is true', () => {
    const onChange = vi.fn();
    render(<Rating onChange={onChange} value={3} readOnly />);
    const thirdStar = screen.getAllByTestId(`${COMPONENT_NAME}-label`)[2];
    fireEvent.keyDown(thirdStar, { key: 'Enter' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('SHOULD render the progress bar when readOnly is true', () => {
    render(<Rating {...DEFAULT_PROPS} readOnly />);
    const progressBar = screen.getByTestId(`${COMPONENT_NAME}-progress`);
    expect(document.body.contains(progressBar)).toBe(true);
  });
});
