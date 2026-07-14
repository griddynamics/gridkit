export const setInRange = (props: { max: number; min: number; value: number }): number => {
  const { min, max, value } = props;

  return Math.min(max, Math.max(min, value));
};
