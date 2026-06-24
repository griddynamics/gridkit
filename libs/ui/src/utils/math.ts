import { ReactNode } from 'react';

export const convertToFormattedPercents = (props: {
  max: number;
  target: number;
  formatChar?: ReactNode;
}): ReactNode => {
  const { max, target, formatChar } = props;
  const result = (target / max) * 100;
  return formatChar ? `${result}${formatChar}` : result;
};
