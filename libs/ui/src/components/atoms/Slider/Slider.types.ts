import { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export interface SliderProps extends Omit<CommonCssComponentProps<HTMLInputElement>, 'onChange'> {
  min?: number; // Minimum value of the slider
  max?: number; // Maximum value of the slider
  value?: number; // Current value of the slider
  onChange?: (value: number) => void; // Callback function when the value changes
  step?: number; // Step value for the slider
  disabled?: boolean; // Disable the slider if true
}

export interface SliderStyledProps extends CommonCssComponentStyledProps<HTMLInputElement> {
  type: string;
  fillRatio: number;
  min?: number; // Minimum value of the slider
  max?: number; // Maximum value of the slider
  value?: number; // Current value of the slider
  disabled?: boolean; // Disable the slider if true
}
