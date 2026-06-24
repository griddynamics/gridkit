import { values } from '@tokens/values';

import { calculateMaxWidth } from './utils';

describe('calculateMaxWidth', () => {
  it('SHOULD return responsive small value when maxWidth is "sm" and isResponsive is true', () => {
    expect(calculateMaxWidth('sm', true)).toBe(values.responsiveSmall);
  });

  it('SHOULD return screen small value when maxWidth is "sm" and isResponsive is false', () => {
    expect(calculateMaxWidth('sm', false)).toBe(values.screenSmall);
  });

  it('SHOULD return responsive medium value when maxWidth is "md" and isResponsive is true', () => {
    expect(calculateMaxWidth('md', true)).toBe(values.responsiveMedium);
  });

  it('SHOULD return screen medium value when maxWidth is "md" and isResponsive is false', () => {
    expect(calculateMaxWidth('md', false)).toBe(values.screenMedium);
  });

  it('SHOULD return responsive large value when maxWidth is "lg" and isResponsive is true', () => {
    expect(calculateMaxWidth('lg', true)).toBe(values.responsiveLarge);
  });

  it('SHOULD return screen large value when maxWidth is "lg" and isResponsive is false', () => {
    expect(calculateMaxWidth('lg', false)).toBe(values.screenLarge);
  });

  it('SHOULD return responsive extra large value when maxWidth is "xl" and isResponsive is true', () => {
    expect(calculateMaxWidth('xl', true)).toBe(values.responsiveXLarge);
  });

  it('SHOULD return screen extra large value when maxWidth is "xl" and isResponsive is false', () => {
    expect(calculateMaxWidth('xl', false)).toBe(values.screenXLarge);
  });

  it('SHOULD return "100%" when maxWidth is undefined', () => {
    expect(calculateMaxWidth(undefined)).toBe('100%');
  });

  it('SHOULD return "100%" when maxWidth is an unknown value', () => {
    expect(calculateMaxWidth('unknown')).toBe('100%');
  });
});
