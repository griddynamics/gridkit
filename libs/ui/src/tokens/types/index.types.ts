import { spacing } from '@tokens';

export type LayoutSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type SpacingKey = keyof typeof spacing;

export enum Unit {
  Px = 'px',
  Rem = 'rem',
  Percents = '%',
  Em = 'em',
}

export type FocusStyles = {
  inset: `${number}${Unit}`;
  borderRadius?: `${number}${Unit}`;
  border?: string;
};
