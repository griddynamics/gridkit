import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testUtils';

import { useCarousel } from './useCarousel';

let emblaCallIndex = 0;
let selectedIndex = 0;
let thumbsSelectedIndex = 0;
let onSelect: (() => void) | undefined;
let onReInit: (() => void) | undefined;
const emblaOptionsCalls: unknown[] = [];

const thumbsScrollToMock = vi.fn();

const mainApi = {
  selectedScrollSnap: vi.fn(() => selectedIndex),
  canScrollPrev: vi.fn(() => selectedIndex > 0),
  canScrollNext: vi.fn(() => selectedIndex < 6),
  scrollTo: vi.fn((index: number) => {
    selectedIndex = index;
    onSelect?.();
  }),
  scrollPrev: vi.fn(() => {
    selectedIndex = Math.max(0, selectedIndex - 1);
    onSelect?.();
  }),
  scrollNext: vi.fn(() => {
    selectedIndex = Math.min(2, selectedIndex + 1);
    onSelect?.();
  }),
  slideNodes: vi.fn(() => [{}, {}, {}, {}, {}, {}, {}]),
  on: vi.fn((event: string, handler: () => void) => {
    if (event === 'select') {
      onSelect = handler;
    }

    if (event === 'reInit') {
      onReInit = handler;
    }
  }),
  off: vi.fn(),
};

const thumbsApi = {
  selectedScrollSnap: vi.fn(() => thumbsSelectedIndex),
  scrollTo: vi.fn((index: number) => {
    thumbsSelectedIndex = index;
    thumbsScrollToMock(index);
  }),
};

vi.mock('embla-carousel-react', () => ({
  default: vi.fn((options) => {
    emblaCallIndex += 1;
    emblaOptionsCalls.push(options);

    if (emblaCallIndex % 2 === 1) {
      return [vi.fn(), mainApi];
    }

    return [vi.fn(), thumbsApi];
  }),
}));

describe('useCarousel', () => {
  beforeEach(() => {
    emblaCallIndex = 0;
    selectedIndex = 0;
    thumbsSelectedIndex = 0;
    onSelect = undefined;
    onReInit = undefined;
    emblaOptionsCalls.length = 0;
    thumbsScrollToMock.mockClear();
    mainApi.selectedScrollSnap.mockClear();
    mainApi.canScrollPrev.mockClear();
    mainApi.canScrollNext.mockClear();
    mainApi.scrollTo.mockClear();
    mainApi.scrollPrev.mockClear();
    mainApi.scrollNext.mockClear();
    mainApi.slideNodes.mockClear();
    mainApi.on.mockClear();
    mainApi.off.mockClear();
    thumbsApi.selectedScrollSnap.mockClear();
    thumbsApi.scrollTo.mockClear();
  });

  it('SHOULD advance on the first next call and emit the updated slide index', async () => {
    const onSlideChange = vi.fn();
    const targetRef = createRef<HTMLElement>();
    targetRef.current = document.createElement('div');

    const { result } = renderHook(() =>
      useCarousel({
        targetRef,
        onSlideChange,
        thumbsVisibleItems: 3,
      })
    );

    await waitFor(() => {
      expect(result.current.activeIndex).toBe(0);
    });

    act(() => {
      result.current.scrollNext();
    });

    await waitFor(() => {
      expect(result.current.activeIndex).toBe(1);
    });

    expect(mainApi.scrollNext).toHaveBeenCalledTimes(1);
    expect(onSlideChange).toHaveBeenLastCalledWith(1);
    expect(thumbsScrollToMock).toHaveBeenLastCalledWith(0);
  });

  it('SHOULD initialize the thumbs carousel with start-aligned single-step snapping', async () => {
    const targetRef = createRef<HTMLElement>();
    targetRef.current = document.createElement('div');

    renderHook(() =>
      useCarousel({
        targetRef,
        options: {
          axis: 'x',
          align: 'center',
          direction: 'ltr',
          startIndex: 2,
        },
      })
    );

    await waitFor(() => {
      const matchingThumbsOptions = emblaOptionsCalls.find(
        (options) =>
          typeof options === 'object' &&
          options !== null &&
          'containScroll' in options &&
          'dragFree' in options &&
          (options as Record<string, unknown>).containScroll === 'keepSnaps' &&
          (options as Record<string, unknown>).dragFree === false
      );

      expect(matchingThumbsOptions).toMatchObject({
        axis: 'x',
        align: 'start',
        containScroll: 'keepSnaps',
        direction: 'ltr',
        dragFree: false,
        watchDrag: false,
        slidesToScroll: 1,
        startIndex: 2,
      });
    });
  });

  it('SHOULD advance the thumbs rail only after the selected slide moves past the visible window', async () => {
    const targetRef = createRef<HTMLElement>();
    targetRef.current = document.createElement('div');

    const { result } = renderHook(() =>
      useCarousel({
        targetRef,
        thumbsVisibleItems: 3,
      })
    );

    await waitFor(() => {
      expect(result.current.activeIndex).toBe(0);
    });

    act(() => {
      result.current.scrollTo(2);
    });

    await waitFor(() => {
      expect(result.current.activeIndex).toBe(2);
    });

    expect(thumbsScrollToMock).toHaveBeenLastCalledWith(0);

    act(() => {
      result.current.scrollTo(3);
    });

    await waitFor(() => {
      expect(result.current.activeIndex).toBe(3);
    });

    expect(thumbsScrollToMock).toHaveBeenLastCalledWith(1);

    act(() => {
      result.current.scrollTo(2);
    });

    await waitFor(() => {
      expect(result.current.activeIndex).toBe(2);
    });

    expect(thumbsScrollToMock).toHaveBeenLastCalledWith(0);
  });
});
