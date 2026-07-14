import { generateUniqueId } from './uniqueKeys';

describe('generateUniqueId', () => {
  it('SHOULD return id with prefix when both id and prefix are provided', () => {
    expect(generateUniqueId('123', 'prefix')).toBe('prefix-123');
  });

  it('SHOULD return id with undefined prefix when only id is provided', () => {
    expect(generateUniqueId('123')).toBe('prefix-123');
  });

  it('SHOULD return default id with undefined prefix when no arguments are provided', () => {
    expect(generateUniqueId()).toBe('prefix-uid');
  });

  it('SHOULD return id with prefix when id is a number', () => {
    expect(generateUniqueId(456, 'prefix')).toBe('prefix-456');
  });

  it('SHOULD return id with undefined prefix when id is a number and prefix is not provided', () => {
    expect(generateUniqueId(456)).toBe('prefix-456');
  });

  it('SHOULD return id with empty string prefix when prefix is an empty string', () => {
    expect(generateUniqueId('123', '')).toBe('-123');
  });
});
