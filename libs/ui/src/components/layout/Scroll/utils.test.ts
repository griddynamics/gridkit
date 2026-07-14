import { getThumbPosition } from './utils';

describe('getThumbPosition', () => {
  function createContainer({
    clientHeight = 100,
    scrollHeight = 200,
    scrollTop = 0,
    clientWidth = 100,
    scrollWidth = 200,
    scrollLeft = 0,
  } = {}) {
    return {
      clientHeight,
      scrollHeight,
      scrollTop,
      clientWidth,
      scrollWidth,
      scrollLeft,
    } as unknown as HTMLElement;
  }

  it('SHOULD return correct vertical thumb position and size', () => {
    const container = createContainer({ clientHeight: 100, scrollHeight: 200, scrollTop: 50 });
    const { position, size } = getThumbPosition(container, 'vertical');

    expect(typeof position).toBe('number');
    expect(typeof size).toBe('number');
    expect(size).toBeGreaterThan(0);
    expect(position).toBeGreaterThanOrEqual(0);
  });

  it('SHOULD return correct horizontal thumb position and size', () => {
    const container = createContainer({ clientWidth: 100, scrollWidth: 200, scrollLeft: 50 });
    const { position, size } = getThumbPosition(container, 'horizontal');

    expect(typeof position).toBe('number');
    expect(typeof size).toBe('number');
    expect(size).toBeGreaterThan(0);
    expect(position).toBeGreaterThanOrEqual(0);
  });

  it('SHOULD handle zero scroll (top/left)', () => {
    const container = createContainer({ scrollTop: 0, scrollLeft: 0 });
    const vertical = getThumbPosition(container, 'vertical');
    const horizontal = getThumbPosition(container, 'horizontal');

    expect(vertical.position).toBeGreaterThanOrEqual(0);
    expect(horizontal.position).toBeGreaterThanOrEqual(0);
  });

  it('SHOULD handle fully scrolled (bottom/right)', () => {
    const container = createContainer({
      clientHeight: 100,
      scrollHeight: 200,
      scrollTop: 100,
      clientWidth: 100,
      scrollWidth: 200,
      scrollLeft: 100,
    });
    const vertical = getThumbPosition(container, 'vertical');
    const horizontal = getThumbPosition(container, 'horizontal');
    expect(vertical.position).toBeLessThanOrEqual(100);

    expect(horizontal.position).toBeLessThanOrEqual(100);
  });

  it('SHOULD handle no scroll (clientHeight === scrollHeight)', () => {
    const container = createContainer({ clientHeight: 100, scrollHeight: 100, clientWidth: 100, scrollWidth: 100 });
    const vertical = getThumbPosition(container, 'vertical');
    const horizontal = getThumbPosition(container, 'horizontal');

    expect(vertical.size).toBeCloseTo(1 * 100);
    expect(horizontal.size).toBeCloseTo(1 * 100);
  });
});
