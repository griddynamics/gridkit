import { expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '@testUtils';
import { LayoutType } from '@types';

import { COMPONENT_NAME } from './constants';
import { Carousel } from './Carousel';

const scrollToMock = vi.fn();

vi.mock('@hooks/useCarousel', () => {
  return {
    useCarousel: () => ({
      carouselRef: vi.fn(),
      carouselApi: {
        selectedScrollSnap: vi.fn().mockReturnValue(0),
        canScrollPrev: vi.fn().mockReturnValue(false),
        canScrollNext: vi.fn().mockReturnValue(true),
        scrollTo: vi.fn(),
        scrollPrev: vi.fn(),
        scrollNext: vi.fn(),
        slideNodes: vi.fn().mockReturnValue([]),
        on: vi.fn(),
        off: vi.fn(),
      },
      scrollTo: scrollToMock,
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      canScrollPrev: false,
      canScrollNext: true,
      activeIndex: 0,
    }),
  };
});

describe(COMPONENT_NAME, () => {
  beforeEach(() => {
    scrollToMock.mockClear();
  });

  it('SHOULD match snapshot', () => {
    const props = {};
    const { container } = render(
      <Carousel {...props}>
        <Carousel.Slide>
          <Carousel.Image src="https://picsum.photos/1200/800?random=1" />
        </Carousel.Slide>
        <Carousel.Slide>
          <Carousel.Image src="https://picsum.photos/1200/800?random=1" />
        </Carousel.Slide>
      </Carousel>
    );
    expect(container).toMatchSnapshot();
  });

  it('SHOULD not render an empty content overlay for image-only slides', () => {
    render(
      <Carousel showArrows showDots>
        <Carousel.Slide>
          <Carousel.Image src="https://picsum.photos/1200/800?random=1" />
        </Carousel.Slide>
        <Carousel.Slide>
          <Carousel.Image src="https://picsum.photos/1200/800?random=2" />
        </Carousel.Slide>
      </Carousel>
    );

    expect(screen.queryByTestId(`${COMPONENT_NAME}-content-container`)).toBeNull();
    expect(screen.getByTestId(`${COMPONENT_NAME}-control-next`)).toBeTruthy();
    expect(screen.getByTestId(`${COMPONENT_NAME}-dots`)).toBeTruthy();
  });

  it('SHOULD reserve viewport space inside fixed-height horizontal carousels', () => {
    render(
      <Carousel showArrows showDots styles={{ height: '500px' }}>
        <Carousel.Slide>
          <Carousel.Image src="https://picsum.photos/1200/800?random=3" />
        </Carousel.Slide>
        <Carousel.Slide>
          <Carousel.Image src="https://picsum.photos/1200/800?random=4" />
        </Carousel.Slide>
      </Carousel>
    );

    const carousel = screen.getByTestId(COMPONENT_NAME);
    const controlsWrapper = screen.getByTestId(`${COMPONENT_NAME}-controls-wrapper`);
    const viewport = screen.getByTestId(`${COMPONENT_NAME}-viewport`);

    expect(window.getComputedStyle(carousel).height).toBe('500px');
    expect(window.getComputedStyle(controlsWrapper).display).toBe('flex');
    expect(window.getComputedStyle(controlsWrapper).flexGrow).toBe('1');
    expect(window.getComputedStyle(viewport).flexGrow).toBe('1');
    expect(window.getComputedStyle(viewport).minHeight).toMatch(/^0(px)?$/);
  });

  it('SHOULD render same rectangular thumbnail proportions and center short thumbnail lists', () => {
    render(
      <>
        <Carousel>
          <Carousel.Slide>
            <Carousel.Image src="https://picsum.photos/1200/800?random=5" />
          </Carousel.Slide>
          <Carousel.Slide>
            <Carousel.Image src="https://picsum.photos/1200/800?random=6" />
          </Carousel.Slide>
        </Carousel>
        <Carousel layout={LayoutType.Vertical} styles={{ height: '280px' }}>
          <Carousel.Slide>
            <Carousel.Image src="https://picsum.photos/1200/800?random=7" />
          </Carousel.Slide>
          <Carousel.Slide>
            <Carousel.Image src="https://picsum.photos/1200/800?random=8" />
          </Carousel.Slide>
        </Carousel>
      </>
    );

    const [horizontalThumb, verticalThumb] = screen.getAllByTestId(`${COMPONENT_NAME}-thumbnail-0`);
    const [horizontalThumbsWrapper, verticalThumbsWrapper] = screen.getAllByTestId(`${COMPONENT_NAME}-thumbs-wrapper`);
    const [, verticalThumbsRail] = screen.getAllByTestId(`${COMPONENT_NAME}-thumbnails`);
    const horizontalThumbStyles = window.getComputedStyle(horizontalThumb);
    const verticalThumbStyles = window.getComputedStyle(verticalThumb);
    const horizontalThumbsWrapperStyles = window.getComputedStyle(horizontalThumbsWrapper);
    const verticalThumbsWrapperStyles = window.getComputedStyle(verticalThumbsWrapper);
    const verticalThumbsRailStyles = window.getComputedStyle(verticalThumbsRail);

    expect(horizontalThumbStyles.width).toBe('80px');
    expect(horizontalThumbStyles.height).toBe('48px');
    expect(verticalThumbStyles.width).toBe(horizontalThumbStyles.width);
    expect(verticalThumbStyles.height).toBe(horizontalThumbStyles.height);
    expect(horizontalThumbsWrapperStyles.justifyContent).toBe('center');
    expect(horizontalThumbsWrapperStyles.minWidth).toBe('100%');
    expect(verticalThumbsWrapperStyles.justifyContent).toBe('center');
    expect(verticalThumbsWrapperStyles.minHeight).toMatch(/^100(%|px)$/);
    expect(verticalThumbsRailStyles.flexBasis).toBe('80px');
  });

  it('SHOULD constrain long thumbnail lists to a three-item viewport in both layouts', () => {
    render(
      <>
        <Carousel showDots>
          {Array.from({ length: 7 }, (_, index) => (
            <Carousel.Slide key={`horizontal-slide-${index}`}>
              <Carousel.Image src={`https://picsum.photos/1200/800?random=${index + 10}`} />
            </Carousel.Slide>
          ))}
        </Carousel>
        <Carousel layout={LayoutType.Vertical} styles={{ height: '280px' }}>
          {Array.from({ length: 7 }, (_, index) => (
            <Carousel.Slide key={`vertical-slide-${index}`}>
              <Carousel.Image src={`https://picsum.photos/1200/800?random=${index + 20}`} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </>
    );

    const [horizontalThumbsRail, verticalThumbsRail] = screen.getAllByTestId(`${COMPONENT_NAME}-thumbnails`);
    const [horizontalThumbsViewport, verticalThumbsViewport] = screen.getAllByTestId(
      `${COMPONENT_NAME}-thumbs-viewport`
    );
    const [horizontalThumbsWrapper, verticalThumbsWrapper] = screen.getAllByTestId(`${COMPONENT_NAME}-thumbs-wrapper`);
    const horizontalThumbsRailStyles = window.getComputedStyle(horizontalThumbsRail);
    const verticalThumbsRailStyles = window.getComputedStyle(verticalThumbsRail);
    const horizontalThumbsViewportStyles = window.getComputedStyle(horizontalThumbsViewport);
    const verticalThumbsViewportStyles = window.getComputedStyle(verticalThumbsViewport);
    const horizontalThumbsWrapperStyles = window.getComputedStyle(horizontalThumbsWrapper);
    const verticalThumbsWrapperStyles = window.getComputedStyle(verticalThumbsWrapper);

    expect(horizontalThumbsRailStyles.width).toBe('fit-content');
    expect(horizontalThumbsViewportStyles.width).toBe('256px');
    expect(horizontalThumbsViewportStyles.maxWidth).toBe('100%');
    expect(horizontalThumbsWrapperStyles.justifyContent).not.toBe('center');
    expect(verticalThumbsRailStyles.flexBasis).toBe('80px');
    expect(verticalThumbsViewportStyles.height).toBe('160px');
    expect(verticalThumbsViewportStyles.maxHeight).toBe('160px');
    expect(verticalThumbsWrapperStyles.justifyContent).not.toBe('center');
  });

  it('SHOULD switch slides when a vertical thumbnail is clicked', () => {
    render(
      <Carousel layout={LayoutType.Vertical} styles={{ height: '280px' }}>
        {Array.from({ length: 7 }, (_, index) => (
          <Carousel.Slide key={`slide-${index}`}>
            <Carousel.Image src={`https://picsum.photos/1200/800?random=${index + 30}`} />
          </Carousel.Slide>
        ))}
      </Carousel>
    );

    fireEvent.click(screen.getByTestId(`${COMPONENT_NAME}-thumbnail-4`));

    expect(scrollToMock).toHaveBeenCalledWith(4);
  });
});
