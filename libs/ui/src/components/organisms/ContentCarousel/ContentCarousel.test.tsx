import { expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '@testUtils';

import { ContentCarousel } from './ContentCarousel';
import { COMPONENT_NAME } from './constants';

const scrollPrevMock = vi.fn();
const scrollNextMock = vi.fn();
const scrollToMock = vi.fn();

vi.mock('@hooks/useCarousel', () => {
  return {
    useCarousel: () => ({
      carouselRef: vi.fn(),
      carouselApi: {
        scrollSnapList: vi.fn().mockReturnValue([0, 1, 2]),
        on: vi.fn(),
        off: vi.fn(),
      },
      scrollTo: scrollToMock,
      scrollPrev: scrollPrevMock,
      scrollNext: scrollNextMock,
      canScrollPrev: false,
      canScrollNext: true,
      activeIndex: 0,
      slidesCount: 3,
    }),
  };
});

describe(COMPONENT_NAME, () => {
  it('SHOULD advance on the first next-arrow click', () => {
    render(
      <ContentCarousel
        items={[
          { id: 1, label: 'Item 1' },
          { id: 2, label: 'Item 2' },
          { id: 3, label: 'Item 3' },
        ]}
        renderItem={(item) => <div>{item.label}</div>}
        showArrows
        showDots
      />
    );

    fireEvent.click(screen.getByTestId(`${COMPONENT_NAME}-control-next`));

    expect(scrollNextMock).toHaveBeenCalledTimes(1);
  });
});
