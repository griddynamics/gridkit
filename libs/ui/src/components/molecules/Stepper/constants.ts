import { colors } from '@tokens';

export const COMPONENT_NAME = 'Stepper';

export const STEP_INDICES = {
  FIRST: 0,
  SECOND: 1,
  THIRD: 2,
  FOURTH: 3,
} as const;

export const EXPECTED_TEXT = {
  currentStep: (num: number) => `Current step - ${num}`,
  nextStep: (num: number) => `Next to step - ${num}`,
  complete: 'Complete',
  congrats: 'Congrats, completed!',
  errorLabel: 'Is error on step - 2!',
  fixButton: 'Click to fix it!',
  stepLabel: (num: number) => `Step ${num}`,
} as const;

export const STEP_STYLES = {
  active: {
    'background-color': colors.bg.default,
    'border-color': colors.border.primary,
  },
  completed: {
    'background-color': colors.bg.fill.primary,
  },
  future: {
    'background-color': colors.bg.default,
  },
  error: {
    'background-color': colors.bg.fill.error.secondary.default,
    'border-color': colors.bg.fill.error.secondary.default,
  },
  failed: {
    'background-color': colors.bg.fill.error.primary.default,
    'border-color': colors.bg.fill.error.primary.default,
  },
};
