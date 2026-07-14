import { describe, it, vi, expect, beforeAll, afterAll } from 'vitest';

import { formatDate } from './date';

describe('formatDate', () => {
  const now = new Date('2024-03-20T12:00:00Z').getTime();
  const yesterday = new Date('2024-03-19T12:00:00Z').getTime();
  const lastWeek = new Date('2024-03-13T12:00:00Z').getTime();
  const lastMonth = new Date('2024-02-20T12:00:00Z').getTime();

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-20T12:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('SHOULD format current date AS "Mar 20"', () => {
    expect(formatDate({ date: now })).toBe('Mar 20');
  });

  it('SHOULD format yesterday date AS "Mar 19"', () => {
    expect(formatDate({ date: yesterday })).toBe('Mar 19');
  });

  it('SHOULD format dates older THAN yesterday with date format', () => {
    expect(formatDate({ date: lastWeek })).toBe('Mar 13');
    expect(formatDate({ date: lastMonth })).toBe('Feb 20');
  });
});
