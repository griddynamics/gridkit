import '@testing-library/jest-dom';
import '@testing-library/dom';
import React from 'react';
import { expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testUtils';
import { colors } from '@tokens';
import { COMPONENT_NAME as TooltipComponentName } from '../Tooltip/constants';
import { COMPONENT_NAME, ITEM_COMPONENT_NAME } from './constants';
import { RadioGroup } from './RadioGroup';

const options = [
  { label: 'Option 1', value: 'opt1', tooltip: 'Tooltip' },
  { label: 'Option 2', value: 'opt2', disabled: true },
  { label: 'Option 3', value: 'opt3' },
  { label: 'Option 4', value: 'opt4' },
];

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<RadioGroup name="radio-group-snapshot" options={options} />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render RadioGroup component', () => {
    render(<RadioGroup options={options} />);
    const radioGroup = screen.getByTestId(COMPONENT_NAME);
    expect(radioGroup).toBeInTheDocument();
  });

  it('SHOULD render items', () => {
    render(<RadioGroup options={options} name="radio-group-name" />);
    options.forEach((option) => {
      const elementId = `${ITEM_COMPONENT_NAME}-${option.value}`;
      const item = screen.getByTestId(elementId);
      expect(item).toBeInTheDocument();
    });
  });
  it('SHOULD render items', () => {
    render(<RadioGroup options={options} name="radio-group-name" />);
    options.forEach((option) => {
      const elementId = `${ITEM_COMPONENT_NAME}-${option.value}`;
      const item = screen.getByTestId(elementId);
      expect(item).toBeInTheDocument();
    });
  });

  it('SHOULD render labels for each item', () => {
    render(<RadioGroup options={options} name="radio-group-name" />);
    options.forEach((option) => {
      const elementId = `${ITEM_COMPONENT_NAME}-${option.value}`;
      const item = screen.getByTestId(elementId);
      expect(item).toHaveTextContent(option.label);
    });
  });

  it('SHOULD render tooltip on hover', async () => {
    render(<RadioGroup options={options} name="radio-group-name" />);
    const optionWithTooltip = options[0];
    const item = screen.getByTestId(`${ITEM_COMPONENT_NAME}-${optionWithTooltip.value}`);

    await userEvent.hover(item);
    const tooltipElement = await screen.findByTestId(TooltipComponentName);
    expect(tooltipElement).toHaveTextContent(optionWithTooltip.tooltip!);

    await userEvent.unhover(item);
    expect(tooltipElement).not.toBeInTheDocument();
  });

  it('SHOULD render hidden radio input for each option', () => {
    render(<RadioGroup options={options} name="radio-group-name" />);
    options.forEach((option) => {
      const elementId = `${ITEM_COMPONENT_NAME}-input-${option.value}`;
      const item = document.querySelector(`[data-testid="${elementId}"]`);
      expect(item).toHaveAttribute('type', 'radio');
    });
  });

  it('SHOULD correctly set name attribute for hidden radio inputs', () => {
    const groupName = 'radio-group-name';
    render(<RadioGroup options={options} name={groupName} />);
    options.forEach((option) => {
      const elementId = `${ITEM_COMPONENT_NAME}-input-${option.value}`;
      const item = document.querySelector(`[data-testid="${elementId}"]`);
      expect(item).toHaveAttribute('name', groupName);
    });
  });

  it('SHOULD set disabled state for hidden input', () => {
    render(<RadioGroup options={options} name="radio-group-name" />);
    options.forEach((option) => {
      const elementId = `${ITEM_COMPONENT_NAME}-input-${option.value}`;
      const item = document.querySelector(`[data-testid="${elementId}"]`);
      if (option.disabled) {
        expect(item).toBeDisabled();
      } else {
        expect(item).toBeEnabled();
      }
    });
  });

  it('SHOULD handle value selection (uncontrolled)', async () => {
    const defaultSelectedValue = 'opt1';
    const user = userEvent.setup();

    render(<RadioGroup options={options} name="radio-group-name" defaultValue={defaultSelectedValue} />);

    const selectedValue = options[2];
    const itemId = `${ITEM_COMPONENT_NAME}-${selectedValue.value}`;
    await user.click(screen.getByTestId(itemId));
    options.forEach((option) => {
      const elementId = `${ITEM_COMPONENT_NAME}-input-${option.value}`;
      const item = document.querySelector(`[data-testid="${elementId}"]`);
      if (option.value === selectedValue.value) {
        expect(item).toBeChecked();
      } else {
        expect(item).not.toBeChecked();
      }
    });
  });

  it('SHOULD handle onChange (controlled)', async () => {
    const defaultSelectedValue = 'opt1';
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup
        options={options}
        name="radio-group-name"
        value={defaultSelectedValue}
        defaultValue={defaultSelectedValue}
        onChange={handleChange}
      />
    );

    const selectedValue = options[2];
    const itemId = `${ITEM_COMPONENT_NAME}-${selectedValue.value}`;
    await user.click(screen.getByTestId(itemId));
    expect(handleChange).toHaveBeenCalledWith(selectedValue.value);
  });
  it('SHOULD have default value selected', () => {
    const defaultSelectedValue = 'opt1';
    render(<RadioGroup options={options} name="radio-group-name" defaultValue={defaultSelectedValue} />);
    options.forEach((option) => {
      const elementId = `${ITEM_COMPONENT_NAME}-input-${option.value}`;
      const item = document.querySelector(`[data-testid="${elementId}"]`);
      if (option.value === defaultSelectedValue) {
        expect(item).toBeChecked();
      } else {
        expect(item).not.toBeChecked();
      }
    });
  });
  it('SHOULD set aria-checked correctly', () => {
    const defaultSelectedValue = 'opt1';
    render(<RadioGroup options={options} name="radio-group-name" defaultValue={defaultSelectedValue} />);
    options.forEach((option) => {
      const elementId = `${ITEM_COMPONENT_NAME}-input-${option.value}`;
      const item = document.querySelector(`[data-testid="${elementId}"]`);
      const expected = option.value === defaultSelectedValue ? 'true' : 'false';
      expect(item).toHaveAttribute('aria-checked', expected);
    });
  });

  it('SHOULD set aria-disabled correctly', () => {
    const defaultSelectedValue = 'opt1';
    render(<RadioGroup options={options} name="radio-group-name" defaultValue={defaultSelectedValue} />);
    options.forEach((option) => {
      const elementId = `${ITEM_COMPONENT_NAME}-input-${option.value}`;
      const item = document.querySelector(`[data-testid="${elementId}"]`);
      if (option.disabled) {
        expect(item).toHaveAttribute('aria-disabled', 'true');
      } else {
        expect(item).not.toHaveAttribute('aria-disabled', 'true');
      }
    });
  });

  it('SHOULD render custom items', () => {
    const defaultSelectedValue = 'opt1';
    render(
      <RadioGroup
        options={options}
        name="radio-group-name"
        defaultValue={defaultSelectedValue}
        renderOption={({ option, isSelected, isDisabled }) => {
          return (
            <div data-testid={`custom-item-${option.value}`}>
              <span>{option.label}</span>
              <span>Selected: {isSelected}</span>
              <span>Disabled: {isDisabled}</span>
            </div>
          );
        }}
      />
    );
    options.forEach((option) => {
      const elementId = `custom-item-${option.value}`;
      const item = screen.getByTestId(elementId);
      expect(item).toBeInTheDocument();
    });
  });

  it('SHOULD apply custom styles', () => {
    render(<RadioGroup styles={{ color: 'rgb(255, 0, 0)' }} options={options} />);
    const radioGroup = screen.getByTestId(COMPONENT_NAME);
    const computedStyle = window.getComputedStyle(radioGroup);
    expect(computedStyle.color).toBe('rgb(255, 0, 0)');
  });
  it('SHOULD apply custom classname', () => {
    const customClassname = 'custom-classname';
    render(<RadioGroup className={customClassname} options={options} />);
    const radioGroup = screen.getByTestId(COMPONENT_NAME);
    expect(radioGroup.classList.contains(customClassname)).toBe(true);
  });

  it('SHOULD prefer theme tokens for option hex values', () => {
    render(
      <RadioGroup
        options={[{ label: 'Success', value: 'success', hex: 'bg.fill.success.primary.default' }]}
        name="radio-group-colors"
      />
    );

    expect(screen.getByTestId(`${ITEM_COMPONENT_NAME}-success`)).toHaveStyle({
      backgroundColor: colors.bg.fill.success.primary.default,
    });
  });
});
