import { calculateAlign, calculateJustify, calculateGutter, calculateGridColumns, calculateGridRows } from './layout';

describe('calculateAlign', () => {
  it('SHOULD return "center" when align is "center"', () => {
    expect(calculateAlign('center')).toBe('center');
  });

  it('SHOULD return "flex-end" when align is "end"', () => {
    expect(calculateAlign('end')).toBe('flex-end');
  });

  it('SHOULD return "stretch" when align is "stretch"', () => {
    expect(calculateAlign('stretch')).toBe('stretch');
  });

  it('SHOULD return "flex-start" for unknown align values', () => {
    expect(calculateAlign('unknown')).toBe('flex-start');
  });
});

describe('calculateJustify', () => {
  it('SHOULD return "center" when justify is "center"', () => {
    expect(calculateJustify('center')).toBe('center');
  });

  it('SHOULD return "flex-end" when justify is "end"', () => {
    expect(calculateJustify('end')).toBe('flex-end');
  });

  it('SHOULD return "space-between" when justify is "between"', () => {
    expect(calculateJustify('between')).toBe('space-between');
  });

  it('SHOULD return "space-around" when justify is "around"', () => {
    expect(calculateJustify('around')).toBe('space-around');
  });

  it('SHOULD return "flex-start" for unknown justify values', () => {
    expect(calculateJustify('unknown')).toBe('flex-start');
  });
});

describe('calculateGutter', () => {
  it('SHOULD return gutter in pixels when gutter is a number', () => {
    expect(calculateGutter(10)).toBe('10px');
  });

  it('SHOULD return gutter as is when gutter is a string', () => {
    expect(calculateGutter('20px')).toBe('20px');
  });

  it('SHOULD return "0px" when gutter is an empty string', () => {
    expect(calculateGutter('')).toBe('0px');
  });

  it('SHOULD return "0px" when gutter is undefined', () => {
    expect(calculateGutter(undefined)).toBe('0px');
  });
});

describe('calculateGridColumns', () => {
  it('SHOULD return correct column property with repeat()', () => {
    expect(calculateGridColumns(10)).toBe('repeat(10, 1fr)');
  });

  it('SHOULD return given string', () => {
    expect(calculateGridColumns('repeat(2, 1fr)')).toBe('repeat(2, 1fr)');
  });

  it('SHOULD return "none" if columns arg is empty string', () => {
    expect(calculateGridColumns('')).toBe('none');
  });

  it('SHOULD return "none" when columns arg is undefined', () => {
    expect(calculateGridColumns(undefined)).toBe('none');
  });
});
describe('calculateGridRows', () => {
  it('SHOULD return correct column property with repeat()', () => {
    expect(calculateGridRows(10)).toBe('repeat(10, auto)');
  });

  it('SHOULD return given string', () => {
    expect(calculateGridRows('repeat(3, auto)')).toBe('repeat(3, auto)');
  });

  it('SHOULD return "none" if columns arg is empty string', () => {
    expect(calculateGridRows('')).toBe('none');
  });

  it('SHOULD return "none" when columns arg is undefined', () => {
    expect(calculateGridRows(undefined)).toBe('none');
  });
});
