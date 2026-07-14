import { MouseEvent, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Button, FlexContainer, Icon, Row, Column, Stepper, StepperProps, Typography } from '@components';
import { ButtonVariant, StepStatus, TypographyVariant } from '@types';
import { defaultTheme } from '@tokens';
import {
  stepperSimpleScenarioActions,
  withActiveErrorStepActions,
  withCustomIconsViewStepActions,
  withIconsViewActiveErrorStepActions,
  withIconsViewCompletedErrorStepActions,
} from './Stepper.stories.play';

const STEPS_LIST = [
  {},
  {
    label: 'Step 2',
  },
  {
    label: 'Step 3',
  },
  {
    label: 'Step 4',
  },
];
const STEPS_LIST_CUSTOM_ICONS = [
  {
    customView: <Icon name="success" />,
  },
  {
    customView: <Icon name="info" />,
    label: 'Step 2',
  },
  {
    customView: <Icon name="home" />,
    label: 'Step 3',
  },
  {
    customView: <Icon name="star" fill="#000" />,
    label: 'Step 4',
  },
];

const meta = {
  title: 'Molecules/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    steps: {
      description: 'Array of step objects containing step information',
      control: 'object',
      table: {
        type: {
          summary: 'StepProps[]',
          detail: '{ validationStatus?: error | success; customView: ReactNode; label: ReactNode; }[]',
        },
        defaultValue: { summary: '[]' },
      },
    },
    activeStep: {
      description: 'Index of the currently active step (zero-based)',
      control: { type: 'number', min: 0 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    isIconsView: {
      description: 'Display steps with icons instead of numbers',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onStepClick: {
      description: 'Callback function triggered when a step is clicked',
      control: false,
      table: {
        type: { summary: '(index: number, status: error | success, event: MouseEvent) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    styles: {
      description: 'Custom styles for the stepper component',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
  The \`Stepper\` component is a navigational element that guides users through a multi-step process or workflow.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Step Visualization</b>
  <ul>
  <li>Linear progress tracking</li>
  <li>Step status indicators</li>
  <li>Custom step labels</li>
  </ul>
  </li>
  <li>
  <b>Status Handling</b>
  <ul>
  <li>Complete state</li>
  <li>Error state</li>
  <li>Active state</li>
  <li>Inactive state</li>
  </ul>
  </li>
  <li><b>Customization</b> – Custom icons and step content</li>
  <li><b>Interactive Navigation</b> – Click handling for step navigation</li>
  <li><b>Validation</b> – Step validation status display</li>
  <li><b>Accessibility</b> – ARIA attributes support</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width</code>: Component width</li>
  <li><code>minWidth</code>: Minimum width constraint</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin</code>: Outer spacing</li>
  <li><code>padding</code>: Inner spacing</li>
  </ul>
  </li>
  <li><code>direction</code>: Horizontal/vertical layout</li>
  <li><code>alignment</code>: Step alignment options</li>
  </ul>
        `,
      },
    },
  },
} as Meta<typeof Stepper>;

export default meta;

export const StepperSimpleScenario: StoryFn<StepperProps> = (args) => {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, updateSteps] = useState(STEPS_LIST);
  const [isComplete, setIsComplete] = useState(false);
  const [isError, setIsError] = useState(false);
  const isLastStep = activeStep >= steps.length - 1;
  const onStepClick = (idx: number, status: StepStatus, e: MouseEvent) => {
    if (status === StepStatus.Inactive) return;
    action(`Step ${idx} clicked`)(e);
    setActiveStep(idx);
    setIsComplete(false);
  };
  const onErrorFixClick = () => {
    setIsError(false);
    updateSteps(
      steps.map((step, stepIdx) => ({
        ...step,
        ...(stepIdx === 1 ? { validationStatus: 'complete' } : {}),
      }))
    );
  };
  const onNextStep = () => {
    if (isLastStep) {
      setActiveStep(steps.length);
      setIsComplete(true);
    } else {
      const nextStep = activeStep + 1;

      setIsComplete(false);
      setActiveStep(nextStep);

      if (nextStep === 2 && !isError) {
        setIsError(true);
        updateSteps(
          steps.map((step, stepIdx) => ({
            ...step,
            ...(stepIdx === 1 ? { validationStatus: 'error' } : {}),
          }))
        );
      }
    }
  };
  return (
    <FlexContainer width="100%">
      <FlexContainer overflow="auto">
        <Stepper
          {...args}
          steps={steps}
          onStepClick={onStepClick}
          activeStep={activeStep}
          styles={{ minWidth: '480px' }}
        />
      </FlexContainer>
      <Column gutter={15}>
        <Row>
          <Typography variant={TypographyVariant.H4} data-testid="Stepper-current-step-label">
            {isComplete ? 'Congrats, completed!' : `Current step - ${activeStep + 1}`}
          </Typography>
        </Row>
        {isError && (
          <Row gutter={15}>
            <Typography variant={TypographyVariant.H5} data-testid="Stepper-error-label">
              Is error on step - 2!
            </Typography>
            <Button onClick={onErrorFixClick} variant={ButtonVariant.Secondary} data-testid="Stepper-fix-button">
              Click to fix it!
            </Button>
          </Row>
        )}
        <Row justify="end" styles={{ padding: '15px' }}>
          {!isComplete && (
            <Button onClick={onNextStep} data-testid="Stepper-next-button">
              {isLastStep ? 'Complete' : `Next to step - ${activeStep + 2}`}
            </Button>
          )}
        </Row>
      </Column>
    </FlexContainer>
  );
};
StepperSimpleScenario.play = stepperSimpleScenarioActions;

const Template: StoryFn<StepperProps> = (args) => <Stepper {...args} />;

export const WithActiveErrorStep = Template.bind({});
WithActiveErrorStep.args = {
  activeStep: 2,
  steps: STEPS_LIST.map((step, idx) => ({
    ...step,
    ...(idx === 2 ? { validationStatus: 'error' } : {}),
  })),
};
WithActiveErrorStep.play = withActiveErrorStepActions;

export const WithIconsViewActiveErrorStep = Template.bind({});
WithIconsViewActiveErrorStep.args = {
  activeStep: 1,
  isIconsView: true,
  steps: STEPS_LIST.map((step, idx) => ({
    ...step,
    ...(idx === 1 ? { validationStatus: 'error' } : {}),
  })),
};
WithIconsViewActiveErrorStep.play = withIconsViewActiveErrorStepActions;

export const WithIconsViewCompletedErrorStep = Template.bind({});
WithIconsViewCompletedErrorStep.args = {
  activeStep: 2,
  isIconsView: true,
  steps: STEPS_LIST.map((step, idx) => ({
    ...step,
    ...(idx === 1 ? { validationStatus: 'error' } : {}),
  })),
};
WithIconsViewCompletedErrorStep.play = withIconsViewCompletedErrorStepActions;

export const WithCustomIconsViewStep = Template.bind({});
WithCustomIconsViewStep.args = {
  activeStep: 2,
  isIconsView: true,
  steps: STEPS_LIST_CUSTOM_ICONS.map((step, idx) => ({
    ...step,
    ...(idx === 1 ? { validationStatus: 'error' } : {}),
  })),
};
WithCustomIconsViewStep.play = withCustomIconsViewStepActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ stepper: defaultTheme.stepper }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
