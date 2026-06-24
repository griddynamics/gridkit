import type { ReactNode, MouseEvent, PropsWithChildren } from 'react';

import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components/index.types';
import { Theme } from '@hooks/useTheme';
import type { EnumOrPrimitive, StepStatus, StepValidationStatus } from '@types';

export interface StepProps {
  validationStatus?: EnumOrPrimitive<StepValidationStatus>;
  customView?: ReactNode;
  label?: ReactNode;
}
export type ContentViewProps = {
  status: StepStatus;
  theme: Theme;
  validationStatus: EnumOrPrimitive<StepValidationStatus>;
  customView: ReactNode;
  isIconsView: boolean;
};

export interface StepperProps extends CommonCssComponentProps {
  steps: StepProps[];
  isIconsView?: boolean;
  activeStep?: number;
  onStepClick?: (idx: number, status: StepStatus, event: MouseEvent) => void;
}

export interface StepperStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {}

export interface StepCommonStyledProps extends StepperStyledProps {
  $status: StepStatus;
}

export interface StepEntityStyledProps extends StepCommonStyledProps {
  $validationStatus: EnumOrPrimitive<StepValidationStatus>;
}

export type StepStyledProps = StepCommonStyledProps;
