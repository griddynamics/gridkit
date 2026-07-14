import { convertToFormattedPercents } from './math';

describe('convertToFormattedPercents', () => {
  it('SHOULD return correct percentage as a number when formatChar is not provided', () => {
    const result = convertToFormattedPercents({ max: 50, target: 200 });
    expect(result).toBe(400);
  });

  it('SHOULD return correct percentage as a string when formatChar is provided', () => {
    const result = convertToFormattedPercents({ max: 50, target: 200, formatChar: '%' });
    expect(result).toBe('400%');
  });

  it('SHOULD handle zero target gracefully by returning Infinity', () => {
    const result = convertToFormattedPercents({ max: 50, target: 0 });
    expect(result).toBe(0);
  });

  it('SHOULD handle max as 0 by returning 0 regardless of target', () => {
    const result = convertToFormattedPercents({ max: 0, target: 200 });
    expect(result).toBe(Infinity);
  });
});
