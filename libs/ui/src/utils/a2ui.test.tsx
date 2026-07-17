import '@testing-library/jest-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, render } from '@testUtils';
import { colors } from '@tokens';
import { A2UI_RENDERER_COMPONENT_TYPES, renderA2UISpec, type A2UICustomComponentDefinition } from './a2ui';
import { aiComponentsSchema, type A2UIActionDefinition } from '../ai';

describe('renderA2UISpec', () => {
  beforeAll(() => {
    if (typeof globalThis.ResizeObserver === 'undefined') {
      globalThis.ResizeObserver = class ResizeObserver {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        observe() {}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        unobserve() {}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        disconnect() {}
      } as typeof ResizeObserver;
    }

    if (typeof globalThis.matchMedia === 'undefined') {
      globalThis.matchMedia = ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        addListener() {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        removeListener() {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        addEventListener() {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        removeEventListener() {},

        dispatchEvent() {
          return false;
        },
      })) as typeof globalThis.matchMedia;
    }

    if (typeof globalThis.IntersectionObserver === 'undefined') {
      globalThis.IntersectionObserver = class IntersectionObserver {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        observe() {}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        unobserve() {}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        disconnect() {}
        takeRecords() {
          return [];
        }
        readonly root = null;
        readonly rootMargin = '0px';
        readonly thresholds = [];
      } as typeof IntersectionObserver;
    }

    if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
      Element.prototype.scrollIntoView = vi.fn();
    }
  });

  it('SHOULD render nested A2UI components inside the configured layout', () => {
    const spec = {
      ui: {
        layout: {
          type: 'grid',
          gridColumns: 3,
          spacing: '16px',
        },
        components: [
          {
            id: 'car_card_camry',
            type: 'card',
            variant: 'vertical',
            isBordered: true,
            children: [
              {
                id: 'camry_title',
                type: 'typography',
                variant: 'h4',
                value: 'Toyota Camry',
              },
              {
                id: 'camry_button',
                type: 'button',
                label: 'View Details',
                variant: 'primary',
              },
            ],
          },
          {
            id: 'car_card_crv',
            type: 'card',
            variant: 'vertical',
            isBordered: true,
            children: [
              {
                id: 'crv_title',
                type: 'typography',
                variant: 'h4',
                value: 'Honda CR-V',
              },
            ],
          },
        ],
      },
    } as const;
    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByTestId('a2ui-layout-root')).toBeTruthy();
    expect(screen.getByTestId('a2ui-layout-root')).toHaveStyle({ width: '100%' });
    expect(screen.getByText('Toyota Camry')).toBeTruthy();
    expect(screen.getByText('Honda CR-V')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'View Details' })).toBeTruthy();
  });

  it('SHOULD expand accordion items rendered from nested A2UI children', () => {
    const spec = {
      version: '1.0.0',
      metadata: {
        agentId: 'a2ui-agent',
        agentName: 'Grid Dynamics Assistant',
        timestamp: '2024-07-30T12:34:56Z',
        theme: 'light',
      },
      ui: {
        layout: {
          type: 'vertical',
          spacing: '16px',
        },
        components: [
          {
            id: 'main_accordion',
            type: 'accordion',
            children: [
              {
                id: 'accordion_item_1',
                type: 'accordion-item',
                children: [
                  {
                    id: 'accordion_header_1',
                    type: 'accordion-header',
                    label: 'Section 1 Title',
                  },
                  {
                    id: 'accordion_content_1',
                    type: 'accordion-content',
                    children: [
                      {
                        id: 'section_1_text',
                        type: 'typography',
                        variant: 'p',
                        label:
                          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'accordion_item_2',
                type: 'accordion-item',
                children: [
                  {
                    id: 'accordion_header_2',
                    type: 'accordion-header',
                    label: 'Section 2 Title',
                  },
                  {
                    id: 'accordion_content_2',
                    type: 'accordion-content',
                    children: [
                      {
                        id: 'section_2_text',
                        type: 'typography',
                        variant: 'p',
                        label:
                          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'accordion_item_3',
                type: 'accordion-item',
                children: [
                  {
                    id: 'accordion_header_3',
                    type: 'accordion-header',
                    label: 'Section 3 Title',
                  },
                  {
                    id: 'accordion_content_3',
                    type: 'accordion-content',
                    children: [
                      {
                        id: 'section_3_text',
                        type: 'typography',
                        variant: 'p',
                        label:
                          'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        actions: [],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    const firstHeader = screen.getByRole('button', { name: 'Section 1 Title' });
    const firstItem = screen.getByTestId('AccordionItem-accordion_item_1');

    expect(firstHeader).toHaveAttribute('aria-expanded', 'false');
    expect(firstItem).toHaveAttribute('data-open', 'false');

    fireEvent.click(firstHeader);

    expect(firstHeader).toHaveAttribute('aria-expanded', 'true');
    expect(firstItem).toHaveAttribute('data-open', 'true');
    expect(screen.getByText(/Lorem ipsum dolor sit amet/)).toBeTruthy();
  });

  it('SHOULD show a fallback message when an image src is missing or stripped', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'car_image',
            type: 'image',
            label: 'Toyota Corolla',
            attributes: {
              alt: 'Toyota Corolla',
              width: 320,
              height: 180,
            },
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByText('Image unavailable: Toyota Corolla')).toBeTruthy();
  });

  it('SHOULD render carousel images from carousel-slide wrappers and top-level image props', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '24px',
        },
        components: [
          {
            id: 'vertical_image_carousel',
            type: 'carousel',
            layout: 'vertical',
            showArrows: true,
            showDots: true,
            styling: {
              height: '320px',
              width: '280px',
            },
            children: [
              {
                id: 'vertical_slide_1',
                type: 'carousel-slide',
                children: [
                  {
                    id: 'vertical_image_1',
                    type: 'image',
                    src: 'https://example.com/vertical-1.jpg',
                    alt: 'Vertical carousel image 1',
                    styling: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    },
                  },
                ],
              },
              {
                id: 'vertical_slide_2',
                type: 'carousel-slide',
                children: [
                  {
                    id: 'vertical_image_2',
                    type: 'image',
                    src: 'https://example.com/vertical-2.jpg',
                    alt: 'Vertical carousel image 2',
                    styling: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'horizontal_image_carousel',
            type: 'carousel',
            layout: 'horizontal',
            showArrows: true,
            showDots: true,
            children: [
              {
                id: 'horizontal_slide_1',
                type: 'carousel-slide',
                children: [
                  {
                    id: 'horizontal_image_1',
                    type: 'image',
                    src: 'https://example.com/horizontal-1.jpg',
                    alt: 'Horizontal carousel image 1',
                  },
                ],
              },
              {
                id: 'horizontal_slide_2',
                type: 'carousel-slide',
                children: [
                  {
                    id: 'horizontal_image_2',
                    type: 'image',
                    src: 'https://example.com/horizontal-2.jpg',
                    alt: 'Horizontal carousel image 2',
                  },
                ],
              },
            ],
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getAllByTestId('Carousel')).toHaveLength(2);
    expect(screen.getAllByTestId('Carousel-dots')).toHaveLength(2);
    expect(screen.queryByText(/Image unavailable/)).not.toBeInTheDocument();
    expect(screen.getAllByAltText('Vertical carousel image 1').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('Vertical carousel image 2').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('Horizontal carousel image 1').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('Horizontal carousel image 2').length).toBeGreaterThan(0);
  });

  it('SHOULD render carousel with mixed custom-content and image slides via content-carousel', () => {
    const spec = {
      ui: {
        layout: { type: 'vertical', spacing: '16px' },
        components: [
          {
            id: 'main_carousel',
            type: 'carousel',
            showArrows: false,
            showDots: false,
            children: [
              {
                id: 'custom_slide',
                type: 'carousel-slide',
                children: [
                  {
                    id: 'custom_slide_content',
                    type: 'column',
                    children: [
                      { id: 'hello_worlds_text', type: 'typography', label: 'Hello Worlds', variant: 'h3' },
                      { id: 'click_me_button', type: 'button', label: 'Click me, please', variant: 'primary' },
                    ],
                  },
                ],
              },
              {
                id: 'image_slide_1',
                type: 'carousel-slide',
                children: [{ id: 'image_1', type: 'image', src: 'https://example.com/1.jpg', alt: 'Forest road' }],
              },
              {
                id: 'image_slide_2',
                type: 'carousel-slide',
                children: [{ id: 'image_2', type: 'image', src: 'https://example.com/2.jpg', alt: 'Snowy mountains' }],
              },
            ],
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getAllByTestId('Carousel')).toHaveLength(1);
    expect(screen.queryByTestId('Carousel-dots')).not.toBeInTheDocument();
    expect(screen.queryByTestId('Carousel-controls')).not.toBeInTheDocument();
    expect(screen.getAllByText('Hello Worlds').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Click me, please').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('Forest road').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('Snowy mountains').length).toBeGreaterThan(0);
  });

  it('SHOULD render content-carousel images from nested carousel-slide children and forward carousel props', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '24px',
        },
        components: [
          {
            id: 'horizontal_content_carousel',
            type: 'content-carousel',
            showArrows: true,
            showDots: true,
            isFocusable: true,
            visibleItems: 3,
            scrollStep: 1,
            scrollAlignment: 'left',
            styling: {
              height: '280px',
              width: '100%',
            },
            children: [
              {
                id: 'content_slide_1',
                type: 'carousel-slide',
                children: [
                  {
                    id: 'content_image_1',
                    type: 'image',
                    src: 'https://example.com/content-1.jpg',
                    alt: 'Content carousel image 1',
                  },
                ],
              },
              {
                id: 'content_slide_2',
                type: 'carousel-slide',
                children: [
                  {
                    id: 'content_image_2',
                    type: 'image',
                    src: 'https://example.com/content-2.jpg',
                    alt: 'Content carousel image 2',
                  },
                ],
              },
            ],
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByTestId('ContentCarousel')).toBeInTheDocument();
    expect(screen.getByTestId('ContentCarousel-dots')).toBeInTheDocument();
    expect(screen.getByTestId('ContentCarousel-control-previous')).toBeInTheDocument();
    expect(screen.getByTestId('ContentCarousel-control-next')).toBeInTheDocument();
    expect(screen.queryByText(/Image unavailable/)).not.toBeInTheDocument();
    expect(screen.getAllByAltText('Content carousel image 1').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('Content carousel image 2').length).toBeGreaterThan(0);
  });

  it('SHOULD recover legacy content-carousel items payloads by rendering them as image children', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '24px',
        },
        components: [
          {
            id: 'legacy_content_carousel',
            type: 'content-carousel',
            showArrows: true,
            showDots: true,
            isFocusable: true,
            visibleItems: 1,
            scrollStep: 1,
            scrollAlignment: 'centered',
            items: [
              {
                id: 'img_1',
                src: 'https://example.com/legacy-1.jpg',
                alt: 'Legacy carousel image 1',
              },
              {
                id: 'img_2',
                src: 'https://example.com/legacy-2.jpg',
                alt: 'Legacy carousel image 2',
              },
            ],
            renderItem: {
              type: 'function',
              body: '(item) => item',
            },
          },
        ],
      },
    } as unknown as Parameters<typeof renderA2UISpec>[0];

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByTestId('ContentCarousel')).toBeInTheDocument();
    expect(screen.getByTestId('ContentCarousel-dots')).toBeInTheDocument();
    expect(screen.queryByText(/Image unavailable/)).not.toBeInTheDocument();
    expect(screen.getAllByAltText('Legacy carousel image 1').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('Legacy carousel image 2').length).toBeGreaterThan(0);
  });

  it('SHOULD render extended A2UI component types without falling back to generic boxes', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'status_badge',
            type: 'badge',
            label: 'Ready',
            variant: 'success',
          },
          {
            id: 'shopping_list',
            type: 'list',
            options: [
              { label: 'Apples', value: 'apples' },
              { label: 'Oranges', value: 'oranges' },
            ],
          },
          {
            id: 'price',
            type: 'price',
            attributes: {
              currentValue: '$24.00',
              oldValue: '$30.00',
            },
          },
          {
            id: 'summary',
            type: 'truncate',
            value: 'Compact summary text for truncation.',
            attributes: {
              maxLines: 2,
            },
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByText('Ready')).toBeTruthy();
    expect(screen.getByText('Apples')).toBeTruthy();
    expect(screen.getByText('$24.00')).toBeTruthy();
    expect(screen.getByText('Compact summary text for truncation.')).toBeTruthy();
  });

  it('SHOULD render badge iconStart and iconEnd from aligned A2UI icon props', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'status_badge',
            type: 'badge',
            label: 'Ready',
            iconStart: 'plus',
            iconEnd: 'arrowRight',
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByTestId('Icon-plus')).toBeInTheDocument();
    expect(screen.getByTestId('Icon-arrowRight')).toBeInTheDocument();
  });

  it('SHOULD apply top-level theme token colors for typography and separator components', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'themed_title',
            type: 'typography',
            variant: 'h4',
            value: 'Theme aware title',
            color: 'text.secondary',
          },
          {
            id: 'themed_separator',
            type: 'separator',
            label: 'OR',
            color: 'border.error',
            labelColor: 'text.warning',
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    const title = screen.getByText('Theme aware title');
    const separator = screen.getByTestId('Separator');
    const line = separator.querySelector('div');
    const label = screen.getByText('OR');

    expect(title).toHaveStyle({ color: colors.text.secondary });
    expect(line).toHaveStyle({ borderTopColor: colors.border.error });
    expect(label).toHaveStyle({ color: colors.text.warning });
  });

  it('SHOULD resolve brand palette aliases for separator colors and derive vertical separator length from styling', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'vertical_separator_container',
            type: 'row',
            gap: '16px',
            align: 'center',
            children: [
              {
                id: 'vertical_left',
                type: 'typography',
                variant: 'p',
                label: 'Option A',
              },
              {
                id: 'vertical_separator',
                type: 'separator',
                orientation: 'vertical',
                color: 'brand.500',
                styling: {
                  height: '40px',
                },
              },
              {
                id: 'vertical_right',
                type: 'typography',
                variant: 'p',
                label: 'Option B',
              },
            ],
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    const separator = screen.getByTestId('Separator');
    const line = separator.querySelector('div');

    expect(separator).toHaveStyle({ height: '40px' });
    expect(line).toHaveStyle({ borderLeftColor: colors.yellow['50'] });
  });

  it('SHOULD keep vertical separator label layouts visible within an explicit length', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'vertical_label_separator_container',
            type: 'row',
            gap: '16px',
            align: 'center',
            children: [
              {
                id: 'vertical_label_left',
                type: 'typography',
                variant: 'p',
                label: 'Option A',
              },
              {
                id: 'vertical_label_separator',
                type: 'separator',
                orientation: 'vertical',
                length: '50px',
                label: 'OR',
                labelPosition: 'center',
                color: 'text.secondary',
              },
              {
                id: 'vertical_label_right',
                type: 'typography',
                variant: 'p',
                label: 'Option B',
              },
            ],
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    const separator = screen.getByTestId('Separator');
    const lines = separator.querySelectorAll('div');

    expect(separator).toHaveStyle({ height: '50px', gap: '4px' });
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveStyle({ borderLeftColor: colors.text.secondary, flex: '1' });
    expect(lines[1]).toHaveStyle({ borderLeftColor: colors.text.secondary, flex: '1' });
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('SHOULD render avatar icon fallbacks from top-level avatar fields', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'verified_user_avatar',
            type: 'avatar',
            icon: 'star',
            size: 'xl',
            backgroundColor: '#cfaaa7',
            fill: '#646464',
            alt: 'Star avatar',
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByTestId('Avatar')).toBeInTheDocument();
    expect(screen.getByTestId('AvatarFallback')).toBeInTheDocument();
    expect(screen.getByTestId('Icon-star').tagName.toLowerCase()).toBe('svg');
  });

  it('SHOULD render avatar-user from aligned A2UI props and derive initials when src is omitted', () => {
    const handler = vi.fn();
    const actions: A2UIActionDefinition[] = [{ type: 'open-profile', description: '', handler }];
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'profile_user_card',
            type: 'avatar-user',
            name: 'Jane Smith',
            subtitle: 'Product Designer',
            variant: 'profile',
            sizeVariant: 'lg',
            withBadge: true,
            badgeColor: 'bg.fill.success.primary.default',
            actionChildren: [{ id: 'follow_profile_user', type: 'button', label: 'Follow', variant: 'secondary' }],
            actions: ['open_profile_action'],
          },
        ],
        actions: [
          {
            id: 'open_profile_action',
            type: 'open-profile',
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec, actions)}</>);

    expect(screen.getByTestId('AvatarUser')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Product Designer')).toBeInTheDocument();
    expect(screen.getByText('Follow')).toBeInTheDocument();
    expect(screen.getByText('JS')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('AvatarUser'));

    expect(handler).toHaveBeenCalledWith({
      id: 'open_profile_action',
      type: 'open-profile',
    });
  });

  it('SHOULD pass input color through to render a success border', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'green_border_input',
            type: 'input',
            label: 'Input with Green Border',
            placeholder: 'Type here...',
            color: 'success',
          },
        ],
      },
    } as const;

    const { container } = render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByTestId('Input')).toBeInTheDocument();
    expect(screen.getByText('Input with Green Border')).toBeInTheDocument();
    expect(container.querySelector('.Input__border')).toHaveStyle({
      border: `1px solid ${colors.border.success}`,
    });
  });

  it('SHOULD render dots loaders from top-level loader props', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'loader_dots_lg',
            type: 'loader',
            name: 'dots',
            size: 'lg',
          },
          {
            id: 'loader_dots_rounded',
            type: 'loader',
            name: 'dots',
            size: 'md',
            rounded: 'round',
          },
        ],
      },
    } as const;

    const { container } = render(<>{renderA2UISpec(spec)}</>);

    const loaders = screen.getAllByTestId('Loader');
    const dots = container.querySelectorAll('.dot');

    expect(loaders).toHaveLength(2);
    expect(dots).toHaveLength(6);
    expect(window.getComputedStyle(dots[3] as HTMLElement).borderRadius).toBe('9999px');
  });

  it('SHOULD render dashed and dotted separators from top-level separator variant props', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'dashed_separator_example',
            type: 'separator',
            variant: 'dashed',
            label: 'Dashed Separator',
          },
          {
            id: 'dotted_separator_example',
            type: 'separator',
            variant: 'dotted',
            label: 'Dotted Separator',
          },
        ],
      },
    } as const;

    const { container } = render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByText('Dashed Separator')).toBeInTheDocument();
    expect(screen.getByText('Dotted Separator')).toBeInTheDocument();

    const separators = container.querySelectorAll('[data-testid="Separator"]');
    const dashedLine = separators[0]?.querySelector('div');
    const dottedLine = separators[1]?.querySelector('div');

    expect(window.getComputedStyle(dashedLine as HTMLElement).borderTopStyle).toBe('dashed');
    expect(window.getComputedStyle(dottedLine as HTMLElement).borderTopStyle).toBe('dotted');
  });

  it('SHOULD pass separator as through to render span-based separators', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'span_separator',
            type: 'separator',
            as: 'span',
            label: 'OR',
            labelPosition: 'center',
            styling: {
              width: '100%',
            },
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    const separator = screen.getByTestId('Separator');
    const lines = Array.from(separator.children).filter((element) => element.textContent !== 'OR');

    expect(separator.tagName).toBe('SPAN');
    expect(lines).toHaveLength(2);
    expect(lines[0]?.tagName).toBe('SPAN');
    expect(lines[1]?.tagName).toBe('SPAN');
  });

  it('SHOULD render skeletons from top-level props and tolerate legacy styles aliases for custom colors', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'theme_skeleton',
            type: 'skeleton',
            variant: 'rectangular',
            width: '100%',
            height: '40px',
            backgroundColor: 'theme.palette.success.main',
            animationName: null,
            attributes: {
              'aria-label': 'Theme skeleton',
            },
          },
          {
            id: 'legacy_styles_skeleton',
            type: 'skeleton',
            variant: 'circular',
            width: '60px',
            height: '60px',
            styles: {
              backgroundColor: '#34A853',
            },
          },
        ],
      },
    } as const;

    const { container } = render(<>{renderA2UISpec(spec)}</>);
    const skeletons = container.querySelectorAll('[data-testid="Skeleton"]');
    const themeSkeleton = skeletons[0] as HTMLElement;
    const legacyStylesSkeleton = skeletons[1] as HTMLElement;

    expect(themeSkeleton).toHaveAttribute('aria-label', 'Theme skeleton');
    expect(themeSkeleton).toHaveStyle({
      width: '100%',
      height: '40px',
      backgroundColor: colors.bg.fill.success.primary.default,
    });
    expect(window.getComputedStyle(themeSkeleton).animationName).toBe('');
    expect(legacyStylesSkeleton).toHaveStyle({
      width: '60px',
      height: '60px',
      backgroundColor: '#34A853',
    });
    expect(window.getComputedStyle(legacyStylesSkeleton).borderRadius).toBe('9999px');
  });

  it('SHOULD render slider-dots from top-level props and dispatch dot click actions with the selected index', () => {
    const handler = vi.fn();
    const actions: A2UIActionDefinition[] = [{ type: 'custom', description: '', handler }];
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'default_slider_dots',
            type: 'slider-dots',
            count: 5,
            activeIndex: 0,
          },
          {
            id: 'interactive_slider_dots',
            type: 'slider-dots',
            count: 3,
            activeIndex: 0,
            actions: ['handle_dot_click'],
          },
        ],
        actions: [
          {
            id: 'handle_dot_click',
            type: 'custom',
          },
        ],
      },
    } as const;

    const { container } = render(<>{renderA2UISpec(spec, actions)}</>);
    const sliderDots = container.querySelectorAll('[data-testid="SliderDots"]');
    const interactiveDots = sliderDots[1]?.querySelectorAll('button');

    expect(sliderDots).toHaveLength(2);
    expect(sliderDots[0]?.querySelectorAll('button')).toHaveLength(5);
    expect(interactiveDots).toHaveLength(3);

    fireEvent.click(interactiveDots[2] as HTMLElement);

    expect(handler).toHaveBeenCalledWith({
      id: 'handle_dot_click',
      type: 'custom',
      payload: { index: 2, activeIndex: 2 },
    });
  });

  it('SHOULD render links from top-level link props and keep underline scoped to the text width', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'go_to_dashboard_link',
            type: 'link',
            label: 'Go to Dashboard',
            href: '/dashboard',
            variant: 'primary',
            underline: 'highlight',
            styling: {
              '&:hover': {
                color: '#D21C1C',
                '&::after': {
                  borderBottomColor: '#D21C1C',
                },
              },
            },
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    const link = screen.getByTestId('Link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link).toHaveTextContent('Go to Dashboard');
    expect(link).toHaveStyle({
      alignSelf: 'flex-start',
      display: 'inline-flex',
      width: 'fit-content',
    });
  });

  it('SHOULD apply styling.color to a link', () => {
    const spec = {
      ui: {
        layout: { type: 'vertical', spacing: '12px' },
        components: [
          {
            id: 'styled_link',
            type: 'link',
            label: 'Coming Soon',
            href: '#',
            styling: {
              color: '#D21C1C',
            },
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    const link = screen.getByTestId('Link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Coming Soon');
    expect(link).toHaveStyle({ color: '#D21C1C' });
  });

  it('SHOULD apply color prop to a link', () => {
    const spec = {
      ui: {
        layout: { type: 'vertical', spacing: '12px' },
        components: [
          {
            id: 'color_link',
            type: 'link',
            label: 'Colored Link',
            href: '#',
            color: '#FF0000',
          },
        ],
      },
    };

    render(<>{renderA2UISpec(spec as never)}</>);

    const link = screen.getByTestId('Link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Colored Link');
    expect(link).toHaveStyle({ color: '#FF0000' });
  });

  it('SHOULD cover every atom A2UI type with a dedicated renderer', () => {
    const atomComponentNames = new Set([
      'Avatar',
      'Badge',
      'Box',
      'Button',
      'Checkbox',
      'Icon',
      'Image',
      'Input',
      'InputFile',
      'Label',
      'Link',
      'Loader',
      'Select',
      'Separator',
      'Skeleton',
      'Slider',
      'SliderDots',
      'Switch',
      'Textarea',
      'Toggle',
      'Truncate',
      'Typography',
      'Wrapper',
    ]);

    const atomA2UITypes = aiComponentsSchema.components
      .filter((component) => component.a2uiName && atomComponentNames.has(component.name))
      .map((component) => component.a2uiName);

    expect(A2UI_RENDERER_COMPONENT_TYPES).toEqual(expect.arrayContaining(atomA2UITypes));
  });

  it('SHOULD cover every molecule A2UI type with a dedicated renderer', () => {
    const moleculeComponentNames = new Set([
      'Accordion',
      'AvatarUser',
      'Breadcrumbs',
      'Counter',
      'Dropdown',
      'DropdownItem',
      'Form',
      'InlineNotification',
      'List',
      'Menu',
      'Price',
      'ProgressBar',
      'RadioGroup',
      'Rating',
      'Snackbar',
      'Stepper',
      'Table',
      'Tabs',
      'Tooltip',
    ]);

    const moleculeA2UITypes = aiComponentsSchema.components
      .filter((component) => component.a2uiName && moleculeComponentNames.has(component.name))
      .flatMap((component) => {
        const types = [component.a2uiName];
        if (component.name === 'Accordion') {
          types.push('accordion-item', 'accordion-header', 'accordion-content');
        }

        return types;
      });

    expect(A2UI_RENDERER_COMPONENT_TYPES).toEqual(expect.arrayContaining(moleculeA2UITypes));
  });

  it('SHOULD cover every organism A2UI type with a dedicated renderer', () => {
    const organismComponentNames = new Set([
      'Card',
      'Carousel',
      'Chart',
      'ChatBubble',
      'ContentCarousel',
      'DragAndDropFiles',
      'Header',
      'ImagePreview',
      'InputArea',
      'Modal',
      'Search',
      'SearchModal',
      'Sidebar',
    ]);

    const organismA2UITypes = aiComponentsSchema.components
      .filter((component) => component.a2uiName && organismComponentNames.has(component.name))
      .map((component) => component.a2uiName);

    expect(A2UI_RENDERER_COMPONENT_TYPES).toEqual(expect.arrayContaining(organismA2UITypes));
  });

  it('SHOULD render structured organism props and dispatch organism actions', () => {
    const handler = vi.fn();
    const actions: A2UIActionDefinition[] = [{ type: 'track-organism', description: '', handler }];

    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '16px',
        },
        components: [
          {
            id: 'app_header',
            type: 'header',
            showTopBanner: true,
            bgColor: 'bg.surface',
            bannerChildren: [
              {
                id: 'header_banner_text',
                type: 'typography',
                value: 'Top banner',
              },
            ],
            logoChildren: [
              {
                id: 'header_logo',
                type: 'typography',
                value: 'Grid',
              },
            ],
            menuChildren: [
              {
                id: 'header_menu_link',
                type: 'link',
                label: 'Docs',
                href: '/docs',
              },
            ],
            actionChildren: [
              {
                id: 'header_action_button',
                type: 'button',
                label: 'Sign in',
              },
            ],
          },
          {
            id: 'message_input',
            type: 'input-area',
            value: 'Hello world',
            placeholder: 'Ask anything',
            showSendButton: true,
            showAttachmentButton: true,
            showCharacterCount: true,
            maxLength: 50,
            actions: ['organism_action'],
          },
          {
            id: 'upload_zone',
            type: 'drag-and-drop-files',
            children: [
              {
                id: 'upload_text',
                type: 'typography',
                value: 'Drop files here',
              },
            ],
            dragOverChildren: [
              {
                id: 'upload_hover_text',
                type: 'typography',
                value: 'Release files',
              },
            ],
          },
          {
            id: 'gallery',
            type: 'image-preview',
            images: [
              { src: 'https://example.com/1.jpg', alt: 'Image one' },
              { src: 'https://example.com/2.jpg', alt: 'Image two' },
            ],
            showCounter: true,
            showArrows: true,
            actions: ['organism_action'],
          },
          {
            id: 'nav_sidebar',
            type: 'sidebar',
            items: [
              { id: 'overview', label: 'Overview' },
              { id: 'settings', label: 'Settings' },
            ],
            activeItemId: 'overview',
            actions: ['organism_action'],
          },
          {
            id: 'search_overlay',
            type: 'search-modal',
            searchValue: 'grid',
            placeholder: 'Search docs',
            results: [
              {
                id: 'result_1',
                title: 'Grid docs',
                description: 'Read the docs',
              },
            ],
            actions: ['organism_action'],
          },
          {
            id: 'assistant_msg',
            type: 'chat-bubble',
            variant: 'answer',
            status: 'fulfilled',
            label: 'All set',
            actionChildren: [
              {
                id: 'bubble_action',
                type: 'button',
                label: 'Copy',
                actions: ['organism_action'],
              },
            ],
          },
        ],
        actions: [
          {
            id: 'organism_action',
            type: 'track-organism',
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec, actions)}</>);

    expect(screen.getByText('Top banner')).toBeInTheDocument();
    expect(screen.getByTestId('InputArea-textarea')).toHaveAttribute('placeholder', 'Ask anything');
    expect(screen.getByText('Drop files here')).toBeInTheDocument();
    expect(screen.getByTestId('ImagePreview-counter')).toHaveTextContent('1/2');
    expect(screen.getByTestId('Sidebar-collapse')).toBeInTheDocument();
    expect(screen.getByText('Grid docs')).toBeInTheDocument();
    expect(screen.getByTestId('ChatBubble-actions')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('InputArea-send'));
    expect(handler).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        id: 'organism_action',
        payload: expect.objectContaining({ trigger: 'send', value: 'Hello world' }),
      })
    );

    fireEvent.click(screen.getByTestId('ImagePreview-next'));
    expect(handler).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        id: 'organism_action',
        payload: expect.objectContaining({ trigger: 'image-change', index: 1 }),
      })
    );

    const searchResultText = screen.getByText('Grid docs');
    const searchResultButton = searchResultText.closest('button');
    expect(searchResultButton).not.toBeDisabled();
    fireEvent.click(searchResultButton as HTMLButtonElement);
    expect(handler).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        id: 'organism_action',
        payload: expect.objectContaining({ trigger: 'select', value: 'Grid docs' }),
      })
    );

    fireEvent.click(screen.getByTestId('Sidebar-collapse'));
    expect(handler).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        id: 'organism_action',
        payload: expect.objectContaining({ trigger: 'collapsed-change', collapsed: true }),
      })
    );

    fireEvent.click(screen.getByText('Copy'));
    expect(handler).toHaveBeenNthCalledWith(
      5,
      expect.objectContaining({
        id: 'organism_action',
      })
    );
  });

  it('SHOULD render wrapper, box, and checkbox atoms from aligned A2UI props', () => {
    const handler = vi.fn();
    const actions: A2UIActionDefinition[] = [{ type: 'track-checkbox', description: '', handler }];
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'legal_wrapper',
            type: 'wrapper',
            variant: 'block',
            className: 'legal-block',
            children: [
              {
                id: 'checkbox_box',
                type: 'box',
                variant: 'vertical',
                isBordered: true,
                styling: {
                  padding: '16px',
                },
                children: [
                  {
                    id: 'terms_checkbox',
                    type: 'checkbox',
                    label: 'Accept terms',
                    checked: true,
                    size: 'sm',
                    actions: ['checkbox_action'],
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            id: 'checkbox_action',
            type: 'track-checkbox',
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec, actions)}</>);

    expect(screen.getByTestId('wrapper')).toHaveClass('legal-block');
    expect(screen.getByTestId('Box')).toHaveStyle({ padding: '16px' });
    expect(screen.getByTestId('Checkbox')).toBeChecked();
    expect(screen.getByText('Accept terms')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('Checkbox'));

    expect(handler).toHaveBeenCalledWith({
      id: 'checkbox_action',
      type: 'track-checkbox',
      payload: { checked: false, value: false },
    });
  });

  it('SHOULD parse aligned atom props for button, input, select, textarea, and input-file', async () => {
    const uploadHandler = vi.fn();
    const actions: A2UIActionDefinition[] = [{ type: 'upload-file', description: '', handler: uploadHandler }];
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'save_button',
            type: 'button',
            label: 'Save',
            ariaLabel: 'Save form',
            buttonType: 'submit',
            icon: 'plus',
            iconEnd: 'arrowRight',
          },
          {
            id: 'search_input',
            type: 'input',
            label: 'Search',
            placeholder: 'Search cars',
            helpText: 'Type at least 3 characters',
            icon: 'search',
            iconEnd: 'cross',
            ariaDescribedBy: 'search-help',
          },
          {
            id: 'filter_select',
            type: 'select',
            options: [
              { label: 'SUV', value: 'suv' },
              { label: 'Sedan', value: 'sedan' },
            ],
            value: 'suv',
            searchable: true,
            searchPlaceholder: 'Search options',
            autoOpen: true,
            icon: 'search',
          },
          {
            id: 'notes_textarea',
            type: 'textarea',
            value: 'Hi',
            maxCharacters: 10,
            resize: 'vertical',
            dynamicHeightAdjustment: true,
          },
          {
            id: 'upload_input_file',
            type: 'input-file',
            label: 'Upload file',
            accept: '.pdf',
            icon: 'upload',
            actions: ['upload_action'],
          },
        ],
        actions: [
          {
            id: 'upload_action',
            type: 'upload-file',
          },
        ],
      },
    } as const;

    const { container } = render(<>{renderA2UISpec(spec, actions)}</>);

    expect(screen.getByRole('button', { name: 'Save form' })).toHaveAttribute('type', 'submit');
    expect(screen.getByTestId('Icon-plus')).toBeInTheDocument();
    expect(screen.getByTestId('Icon-arrowRight')).toBeInTheDocument();
    expect(screen.getByText('Type at least 3 characters')).toBeInTheDocument();
    expect(screen.getByTestId('Textarea-counter')).toHaveTextContent('2/10');
    fireEvent.click(screen.getByTestId('Select-initiator'));
    expect(await screen.findByPlaceholderText('Search options')).toBeInTheDocument();

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    const file = new File(['report'], 'report.pdf', { type: 'application/pdf' });

    expect(fileInput).not.toBeNull();
    fireEvent.change(fileInput as HTMLInputElement, { target: { files: [file] } });

    expect(uploadHandler).toHaveBeenCalledWith({
      id: 'upload_action',
      type: 'upload-file',
      payload: {
        files: [{ name: 'report.pdf', size: file.size, type: 'application/pdf' }],
      },
    });
  });

  it('SHOULD parse icon actions, top-level label htmlFor, link accessibility props, and skeleton children', () => {
    const handler = vi.fn();
    const actions: A2UIActionDefinition[] = [{ type: 'track-ui', description: '', handler }];
    const spec = {
      ui: {
        layout: {
          type: 'vertical',
          spacing: '12px',
        },
        components: [
          {
            id: 'search_hotspot',
            type: 'icon',
            icon: 'search',
            className: 'search-hotspot',
            tabIndex: 0,
            actions: ['icon_action'],
          },
          {
            id: 'email_label',
            type: 'label',
            label: 'Email',
            htmlFor: 'email-input',
          },
          {
            id: 'docs_link',
            type: 'link',
            label: 'Documentation',
            href: '/docs',
            ariaLabel: 'Open documentation',
            tabIndex: 2,
            actions: ['link_action'],
          },
          {
            id: 'loading_skeleton',
            type: 'skeleton',
            variant: 'rounded',
            width: '100%',
            height: '24px',
            animationProps: 'pulse 1s linear infinite',
            children: [
              {
                id: 'loading_copy',
                type: 'typography',
                variant: 'p',
                value: 'Loading profile',
                styleVariant: ['italic'],
              },
            ],
          },
        ],
        actions: [
          {
            id: 'icon_action',
            type: 'track-ui',
          },
          {
            id: 'link_action',
            type: 'track-ui',
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec, actions)}</>);

    const icon = screen.getByTestId('Icon-search');
    const label = screen.getByTestId('Label');
    const link = screen.getByRole('link', { name: 'Open documentation' });
    const skeletonText = screen.getByText('Loading profile');

    expect(icon).toHaveClass('search-hotspot');
    expect(icon).toHaveAttribute('tabindex', '0');
    expect(label).toHaveAttribute('for', 'email-input');
    expect(link).toHaveAttribute('tabindex', '2');
    expect(screen.getByTestId('Skeleton')).toBeInTheDocument();
    expect(skeletonText).toBeInTheDocument();
    expect(window.getComputedStyle(skeletonText).fontStyle).toBe('italic');

    fireEvent.click(icon);
    fireEvent.click(link);

    expect(handler).toHaveBeenNthCalledWith(1, {
      id: 'icon_action',
      type: 'track-ui',
    });
    expect(handler).toHaveBeenNthCalledWith(2, {
      id: 'link_action',
      type: 'track-ui',
    });
  });

  it('SHOULD render drag-and-drop top-level props and dispatch selected file metadata', () => {
    const uploadHandler = vi.fn();
    const actions: A2UIActionDefinition[] = [{ type: 'upload-files', description: '', handler: uploadHandler }];
    const spec = {
      ui: {
        layout: {
          type: 'vertical' as const,
          spacing: '12px',
        },
        components: [
          {
            id: 'asset_upload',
            type: 'drag-and-drop' as const,
            title: 'Upload assets',
            description: 'PDF up to 10MB',
            inputFileButtonLabel: 'Choose files',
            acceptedFileTypes: ['application/pdf'],
            maxFiles: 2,
            maxFileSize: 10000000,
            actions: ['asset_upload_action'],
          },
        ],
        actions: [{ id: 'asset_upload_action', type: 'upload-files' }],
      },
    } as const;

    const { container } = render(<>{renderA2UISpec(spec, actions)}</>);

    expect(screen.getByText('Upload assets')).toBeInTheDocument();
    expect(screen.getByText('PDF up to 10MB')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument();

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    const file = new File(['report'], 'report.pdf', { type: 'application/pdf' });

    expect(fileInput).not.toBeNull();
    fireEvent.change(fileInput as HTMLInputElement, { target: { files: [file] } });

    expect(uploadHandler).toHaveBeenCalledWith({
      id: 'asset_upload_action',
      type: 'upload-files',
      payload: {
        files: [{ name: 'report.pdf', size: file.size, type: 'application/pdf' }],
      },
    });
  });

  it('SHOULD surface drag-and-drop validation errors from local renderer state', () => {
    const uploadHandler = vi.fn();
    const actions: A2UIActionDefinition[] = [{ type: 'upload-files', description: '', handler: uploadHandler }];
    const spec = {
      ui: {
        layout: {
          type: 'vertical' as const,
          spacing: '12px',
        },
        components: [
          {
            id: 'receipt_upload',
            type: 'drag-and-drop' as const,
            title: 'Upload receipt',
            inputFileButtonLabel: 'Browse',
            acceptedFileTypes: ['application/pdf'],
            actions: ['receipt_upload_action'],
          },
        ],
        actions: [{ id: 'receipt_upload_action', type: 'upload-files' }],
      },
    } as const;

    const { container } = render(<>{renderA2UISpec(spec, actions)}</>);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    const badFile = new File(['png'], 'receipt.png', { type: 'image/png' });

    expect(fileInput).not.toBeNull();
    fireEvent.change(fileInput as HTMLInputElement, { target: { files: [badFile] } });

    expect(screen.getByText('File type not supported: receipt.png (image/png)')).toBeInTheDocument();
    expect(uploadHandler).toHaveBeenCalledWith({
      id: 'receipt_upload_action',
      type: 'upload-files',
      payload: {
        errors: ['File type not supported: receipt.png (image/png)'],
      },
    });
  });

  it('SHOULD render drag-and-drop custom children and loading overlays from nested A2UI content', () => {
    const idleSpec = {
      ui: {
        layout: {
          type: 'vertical' as const,
          spacing: '12px',
        },
        components: [
          {
            id: 'custom_upload',
            type: 'drag-and-drop' as const,
            children: [{ id: 'custom_upload_copy', type: 'typography' as const, value: 'Custom upload surface' }],
          },
        ],
      },
    } as const;

    const loadingSpec = {
      ui: {
        layout: {
          type: 'vertical' as const,
          spacing: '12px',
        },
        components: [
          {
            id: 'loading_upload',
            type: 'drag-and-drop' as const,
            isLoading: true,
            loadingOverlay: [{ id: 'uploading_copy', type: 'typography' as const, value: 'Uploading files...' }],
          },
        ],
      },
    } as const;

    const { rerender } = render(<>{renderA2UISpec(idleSpec)}</>);

    expect(screen.getByText('Custom upload surface')).toBeInTheDocument();

    rerender(<>{renderA2UISpec(loadingSpec)}</>);

    expect(screen.getByText('Uploading files...')).toBeInTheDocument();
  });

  it('SHOULD forward row, column, and flex-container layout props to the rendered UI', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical' as const,
          spacing: '0',
        },
        components: [
          {
            id: 'layout_row',
            type: 'row' as const,
            gutter: '12px',
            align: 'center' as const,
            justify: 'space-between' as const,
            isReversed: true,
            flex: '1 1 auto',
            children: [
              { id: 'layout_row_left', type: 'typography' as const, value: 'Row left' },
              { id: 'layout_row_right', type: 'typography' as const, value: 'Row right' },
            ],
          },
          {
            id: 'layout_column',
            type: 'column' as const,
            gutter: '10px',
            align: 'center' as const,
            justify: 'space-between' as const,
            isReversed: true,
            flex: '1 1 auto',
            children: [
              { id: 'layout_column_top', type: 'typography' as const, value: 'Column top' },
              { id: 'layout_column_bottom', type: 'typography' as const, value: 'Column bottom' },
            ],
          },
          {
            id: 'layout_flex',
            type: 'flex-container' as const,
            gap: '14px',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            children: [
              { id: 'layout_flex_first', type: 'typography' as const, value: 'Flex first' },
              { id: 'layout_flex_second', type: 'typography' as const, value: 'Flex second' },
            ],
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByTestId('Row')).toHaveStyle({ flexDirection: 'row-reverse', flex: '1 1 auto' });
    expect(screen.getByTestId('Column')).toHaveStyle({ flexDirection: 'column-reverse', flex: '1 1 auto' });
    expect(screen.getByTestId('FlexContainer')).toHaveStyle({
      gap: '14px',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    });
  });

  it('SHOULD forward scroll props and root layout alignment settings', () => {
    const spec = {
      ui: {
        layout: {
          type: 'horizontal' as const,
          spacing: '8px',
          alignment: 'center',
          justification: 'end',
        },
        components: [
          {
            id: 'scroll_shell',
            type: 'scroll' as const,
            horizontal: 'hidden',
            vertical: 'visible',
            autoHide: true,
            children: [{ id: 'scroll_copy', type: 'typography' as const, value: 'Scrollable content' }],
          },
        ],
      },
    } as const;

    const { container } = render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByTestId('a2ui-layout-root')).toHaveStyle({
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    });
    expect(container.querySelector('[data-testid="Scroll-content"]')).toHaveStyle({ maxWidth: '100%' });
    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  it('SHOULD render chat-container named slots from A2UI arrays', () => {
    const spec = {
      ui: {
        layout: {
          type: 'vertical' as const,
          spacing: '0',
        },
        components: [
          {
            id: 'chat_shell',
            type: 'chat-container' as const,
            isOpen: false,
            showSidebarAsideControl: false,
            showSidebarHeaderControl: true,
            headerContent: [{ id: 'chat_header_title', type: 'typography' as const, value: 'Support Inbox' }],
            sidebarHeaderContent: [{ id: 'chat_sidebar_title', type: 'typography' as const, value: 'Conversations' }],
            sidebarContent: [{ id: 'chat_sidebar_button', type: 'button' as const, label: 'Inbox', variant: 'text' }],
            sidebarMinifiedContent: [{ id: 'chat_minified_copy', type: 'typography' as const, value: 'Mini rail' }],
            children: [{ id: 'chat_body_copy', type: 'typography' as const, value: 'Hello from chat' }],
          },
        ],
      },
    } as const;

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByText('Support Inbox')).toBeInTheDocument();
    expect(screen.getByText('Conversations')).toBeInTheDocument();
    expect(screen.getByText('Inbox')).toBeInTheDocument();
    expect(screen.getByText('Mini rail')).toBeInTheDocument();
    expect(screen.getByText('Hello from chat')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle sidebar - open')).toBeInTheDocument();
    expect(screen.queryByLabelText('Toggle sidebar - close')).not.toBeInTheDocument();
  });

  it('SHOULD render chat-image-gallery from images[] inside a chat-bubble and dispatch tile click actions', () => {
    const handler = vi.fn();
    const actions: A2UIActionDefinition[] = [{ type: 'view-image', description: '', handler }];

    const spec = {
      ui: {
        layout: { type: 'vertical' as const, spacing: '0' },
        components: [
          {
            id: 'msg_with_gallery',
            type: 'chat-bubble' as const,
            variant: 'answer' as const,
            children: [
              {
                id: 'msg_gallery',
                type: 'chat-image-gallery' as const,
                images: [
                  { src: 'https://example.com/a.png', alt: 'Image A' },
                  { src: 'https://example.com/b.png', alt: 'Image B' },
                  { src: 'https://example.com/c.png', alt: 'Image C' },
                  { src: 'https://example.com/d.png', alt: 'Image D' },
                  { src: 'https://example.com/e.png', alt: 'Image E' },
                ],
                maxVisible: 4,
                actions: ['view-image'],
              },
            ],
          },
        ],
        actions: [{ id: 'view-image', type: 'view-image' as const }],
      },
    } as const;

    render(<>{renderA2UISpec(spec, actions)}</>);

    expect(screen.getByTestId('ChatImageGallery')).toBeInTheDocument();
    expect(screen.getByTestId('ChatImageGallery-image-0')).toBeInTheDocument();
    expect(screen.getByTestId('ChatImageGallery-image-3')).toBeInTheDocument();
    expect(screen.queryByTestId('ChatImageGallery-image-4')).not.toBeInTheDocument();
    expect(screen.getByTestId('ChatImageGallery-remaining')).toHaveTextContent('+1');

    fireEvent.click(screen.getByTestId('ChatImageGallery-image-1'));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'view-image',
        payload: expect.objectContaining({
          trigger: 'click',
          index: 1,
          image: { src: 'https://example.com/b.png', alt: 'Image B' },
        }),
      })
    );
  });

  it('SHOULD expand table rows and auto-render non-column row fields as built-in expanded content', () => {
    const spec = {
      ui: {
        layout: { type: 'vertical' as const, spacing: '0' },
        components: [
          {
            id: 'data_table',
            type: 'table' as const,
            columns: [
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
            ],
            rows: [
              { id: 'item_1', name: 'Project Alpha', details: 'Alpha is in progress' },
              { id: 'item_2', name: 'Project Beta', details: 'Beta is complete' },
            ],
            expandableRows: true,
          },
        ],
      },
    };

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.queryByText(/Alpha is in progress/)).toBeNull();
    expect(screen.queryByText(/Beta is complete/)).toBeNull();

    const alphaCell = screen.getByText('Project Alpha');
    const alphaRow = alphaCell.closest('tr');
    if (!alphaRow) throw new Error('Could not locate the row for "Project Alpha"');
    fireEvent.click(alphaRow);

    expect(screen.getByText(/Alpha is in progress/)).toBeInTheDocument();
    expect(screen.queryByText(/Beta is complete/)).toBeNull();
  });

  it('SHOULD auto-detect expansion from row.expandedContent and recursively render nested objects and arrays', () => {
    const spec = {
      ui: {
        layout: { type: 'vertical' as const, spacing: '0' },
        components: [
          {
            id: 'orders_table',
            type: 'table' as const,
            columns: [
              { key: 'orderId', label: 'Order ID' },
              { key: 'customer', label: 'Customer' },
            ],
            rows: [
              {
                id: 'order_1',
                orderId: '#ORD-1',
                customer: 'Alice',
                expandedContent: {
                  items: [{ product: 'Laptop', qty: 1, price: '$1500' }],
                  notes: 'Delivered on time',
                },
              },
              {
                id: 'order_2',
                orderId: '#ORD-2',
                customer: 'Bob',
                expandedContent: {
                  items: [{ product: 'Mouse', qty: 2, price: '$50' }],
                  notes: 'Awaiting payment',
                },
              },
            ],
          },
        ],
      },
    };

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.queryByText(/Delivered on time/)).toBeNull();

    const aliceRow = screen.getByText('Alice').closest('tr');
    if (!aliceRow) throw new Error('Could not locate the row for "Alice"');
    fireEvent.click(aliceRow);

    expect(screen.getByText(/Delivered on time/)).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.queryByText(/Awaiting payment/)).toBeNull();
  });

  it('SHOULD render a table inside another table without crashing', () => {
    const spec = {
      ui: {
        layout: { type: 'vertical' as const, spacing: '0' },
        components: [
          {
            id: 'outer_table',
            type: 'table' as const,
            columns: [
              { key: 'name', label: 'Name' },
              { key: 'surname', label: 'Surname' },
              { key: 'table', label: 'Table' },
            ],
            rows: [
              {
                id: 'outer_row_1',
                name: 'Joe',
                surname: 'Smith',
                table: {
                  id: 'inner_table_1',
                  type: 'table' as const,
                  columns: [
                    { key: 'phoneId', label: 'Id' },
                    { key: 'phone', label: 'Phone Number' },
                  ],
                  rows: [{ id: 'inner_row_1', phoneId: '1', phone: '555-1234' }],
                },
              },
            ],
          },
        ],
      },
    };

    expect(() => render(<>{renderA2UISpec(spec)}</>)).not.toThrow();
    expect(screen.getByText('Joe')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
  });

  it('SHOULD render portal content into a selected container and restore scroll lock on unmount', () => {
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.appendChild(target);

    const spec = {
      ui: {
        layout: {
          type: 'vertical' as const,
          spacing: '0',
        },
        components: [
          {
            id: 'layout_portal',
            type: 'portal' as const,
            container: '#portal-target',
            withWrapper: false,
            blocksScroll: true,
            children: [{ id: 'portal_copy', type: 'typography' as const, value: 'Portal content' }],
          },
        ],
      },
    } as const;

    const { unmount } = render(<>{renderA2UISpec(spec)}</>);

    expect(target).toHaveTextContent('Portal content');
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
    target.remove();
  });

  describe('action dispatch', () => {
    it('SHOULD call the matching handler when a button is clicked', () => {
      const handler = vi.fn();
      const actions: A2UIActionDefinition[] = [{ type: 'do-something', description: '', handler }];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [{ id: 'btn', type: 'button' as const, label: 'Click me', actions: ['action-1'] }],
          actions: [{ id: 'action-1', type: 'do-something' }],
        },
      };

      render(<>{renderA2UISpec(spec, actions)}</>);
      fireEvent.click(screen.getByRole('button', { name: 'Click me' }));

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith({ id: 'action-1', type: 'do-something' });
    });

    it('SHOULD dispatch modal close actions when the close button is clicked', () => {
      const handler = vi.fn();
      const actions: A2UIActionDefinition[] = [{ type: 'close-modal', description: '', handler }];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [
            {
              id: 'cart-modal',
              type: 'modal' as const,
              title: 'Cart',
              showCloseButton: true,
              actions: ['close-action'],
              children: [{ id: 'modal-copy', type: 'typography' as const, value: 'Cart contents' }],
            },
          ],
          actions: [{ id: 'close-action', type: 'close-modal' }],
        },
      };

      render(<>{renderA2UISpec(spec, actions)}</>);
      fireEvent.click(screen.getByLabelText('Close modal'));

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith({ id: 'close-action', type: 'close-modal' });
    });

    it('SHOULD dispatch modal close actions when Escape is pressed', () => {
      const handler = vi.fn();
      const actions: A2UIActionDefinition[] = [{ type: 'close-modal', description: '', handler }];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [
            {
              id: 'cart-modal',
              type: 'modal' as const,
              title: 'Cart',
              closeOnEscape: true,
              showCloseButton: true,
              actions: ['close-action'],
              children: [{ id: 'modal-copy', type: 'typography' as const, value: 'Cart contents' }],
            },
          ],
          actions: [{ id: 'close-action', type: 'close-modal' }],
        },
      };

      render(<>{renderA2UISpec(spec, actions)}</>);
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith({ id: 'close-action', type: 'close-modal' });
    });

    it('SHOULD auto-close a modal when no actions are defined and the close button is clicked', () => {
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [
            {
              id: 'confirm-modal',
              type: 'modal' as const,
              title: 'Confirm',
              showCloseButton: true,
              children: [{ id: 'modal-copy', type: 'typography' as const, value: 'Are you sure?' }],
            },
          ],
        },
      };

      render(<>{renderA2UISpec(spec)}</>);

      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText('Close modal'));
      expect(screen.queryByText('Are you sure?')).toBeNull();
    });

    it('SHOULD auto-close a modal when a footer button without actions is clicked', () => {
      const confirmHandler = vi.fn();
      const actions: A2UIActionDefinition[] = [{ type: 'confirm', description: '', handler: confirmHandler }];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [
            {
              id: 'confirm-modal',
              type: 'modal' as const,
              title: 'Confirm',
              showCloseButton: true,
              children: [{ id: 'modal-copy', type: 'typography' as const, value: 'Are you sure?' }],
              footer: [
                { id: 'cancel-btn', type: 'button' as const, label: 'Cancel' },
                { id: 'confirm-btn', type: 'button' as const, label: 'Confirm', actions: ['confirm-action'] },
              ],
            },
          ],
          actions: [{ id: 'confirm-action', type: 'confirm' }],
        },
      };

      render(<>{renderA2UISpec(spec, actions)}</>);

      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(screen.queryByText('Are you sure?')).toBeNull();
      expect(confirmHandler).not.toHaveBeenCalled();
    });

    it('SHOULD auto-close a modal when a footer button has actions but no handler is registered', () => {
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [
            {
              id: 'confirm-modal',
              type: 'modal' as const,
              title: 'Confirm',
              showCloseButton: false,
              children: [{ id: 'modal-copy', type: 'typography' as const, value: 'Are you sure?' }],
              footer: [{ id: 'cancel-btn', type: 'button' as const, label: 'Cancel', actions: ['cancel_back'] }],
            },
          ],
          actions: [{ id: 'cancel_back', type: 'cancel_back', payload: {} }],
        },
      };

      render(<>{renderA2UISpec(spec, [])}</>);

      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(screen.queryByText('Are you sure?')).toBeNull();
    });

    it('SHOULD auto-close a modal when an unresolved-action footer button is nested in a flex-container', () => {
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [
            {
              id: 'confirm_modal',
              type: 'modal' as const,
              title: 'Are you sure?',
              showCloseButton: false,
              closeOnEscape: false,
              closeOnClickOutside: false,
              children: [{ id: 'msg', type: 'typography' as const, value: 'Confirm body' }],
              footer: [
                {
                  id: 'confirm_actions',
                  type: 'flex-container' as const,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: '16px',
                  children: [
                    { id: 'cancel_button', type: 'button' as const, label: 'Cancel', actions: ['cancel_back'] },
                    { id: 'confirm_button', type: 'button' as const, label: 'Confirm', actions: ['confirm_back'] },
                  ],
                },
              ],
            },
          ],
          actions: [
            { id: 'cancel_back', type: 'cancel_back', payload: {} },
            { id: 'confirm_back', type: 'confirm_back', payload: {} },
          ],
        },
      };

      render(<>{renderA2UISpec(spec, [])}</>);

      expect(screen.getByText('Confirm body')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(screen.queryByText('Confirm body')).toBeNull();
    });

    it('SHOULD NOT auto-close a modal when a footer button with actions is clicked', () => {
      const confirmHandler = vi.fn();
      const actions: A2UIActionDefinition[] = [{ type: 'confirm', description: '', handler: confirmHandler }];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [
            {
              id: 'confirm-modal',
              type: 'modal' as const,
              title: 'Confirm',
              showCloseButton: true,
              children: [{ id: 'modal-copy', type: 'typography' as const, value: 'Are you sure?' }],
              footer: [{ id: 'confirm-btn', type: 'button' as const, label: 'Confirm', actions: ['confirm-action'] }],
            },
          ],
          actions: [{ id: 'confirm-action', type: 'confirm' }],
        },
      };

      render(<>{renderA2UISpec(spec, actions)}</>);

      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
      expect(confirmHandler).toHaveBeenCalledOnce();
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    it('SHOULD forward the spec action payload to the handler', () => {
      const handler = vi.fn();
      const actions: A2UIActionDefinition[] = [{ type: 'add-item', description: '', handler }];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [{ id: 'btn', type: 'button' as const, label: 'Add', actions: ['action-add'] }],
          actions: [{ id: 'action-add', type: 'add-item', payload: { id: 'abc', name: 'Widget' } }],
        },
      };

      render(<>{renderA2UISpec(spec, actions)}</>);
      fireEvent.click(screen.getByRole('button', { name: 'Add' }));

      expect(handler).toHaveBeenCalledWith({
        id: 'action-add',
        type: 'add-item',
        payload: { id: 'abc', name: 'Widget' },
      });
    });

    it('SHOULD call the handler when a card-button inside a card is clicked', () => {
      const handler = vi.fn();
      const actions: A2UIActionDefinition[] = [{ type: 'buy-now', description: '', handler }];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [
            {
              id: 'prod-card',
              type: 'card' as const,
              padding: '16px',
              gutter: '8px',
              children: [
                {
                  id: 'card-btn',
                  type: 'card-button' as const,
                  label: 'Buy Now',
                  variant: 'primary' as const,
                  actions: ['buy-action'],
                },
              ],
            },
          ],
          actions: [{ id: 'buy-action', type: 'buy-now', payload: { sku: 'SKU-001' } }],
        },
      };

      render(<>{renderA2UISpec(spec, actions)}</>);
      fireEvent.click(screen.getByRole('button', { name: 'Buy Now' }));

      expect(handler).toHaveBeenCalledWith({ id: 'buy-action', type: 'buy-now', payload: { sku: 'SKU-001' } });
    });

    it('SHOULD merge { qty } into the payload when a card-counter changes', () => {
      const handler = vi.fn();
      const actions: A2UIActionDefinition[] = [{ type: 'update-qty', description: '', handler }];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [
            {
              id: 'counter-comp',
              type: 'card-counter' as const,
              attributes: { initial: 1 },
              actions: ['qty-action'],
            },
          ],
          actions: [{ id: 'qty-action', type: 'update-qty', payload: { productId: 'prod-1' } }],
        },
      };

      render(<>{renderA2UISpec(spec, actions)}</>);
      fireEvent.click(screen.getByRole('button', { name: 'Increment counter' }));

      expect(handler).toHaveBeenLastCalledWith({
        id: 'qty-action',
        type: 'update-qty',
        payload: { productId: 'prod-1', qty: 2 },
      });
    });

    it('SHOULD dispatch to every action ID listed on a button', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const actions: A2UIActionDefinition[] = [
        { type: 'track', description: '', handler: handler1 },
        { type: 'navigate', description: '', handler: handler2 },
      ];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [{ id: 'btn', type: 'button' as const, label: 'Go', actions: ['action-track', 'action-nav'] }],
          actions: [
            { id: 'action-track', type: 'track' },
            { id: 'action-nav', type: 'navigate', payload: { path: '/home' } },
          ],
        },
      };

      render(<>{renderA2UISpec(spec, actions)}</>);
      fireEvent.click(screen.getByRole('button', { name: 'Go' }));

      expect(handler1).toHaveBeenCalledOnce();
      expect(handler2).toHaveBeenCalledOnce();
    });

    it('SHOULD NOT wire any onClick when no actions are passed to renderA2UISpec', () => {
      const handler = vi.fn();
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [{ id: 'btn', type: 'button' as const, label: 'Click', actions: ['action-1'] }],
          actions: [{ id: 'action-1', type: 'do-something' }],
        },
      };

      render(<>{renderA2UISpec(spec)}</>);
      fireEvent.click(screen.getByRole('button', { name: 'Click' }));

      expect(handler).not.toHaveBeenCalled();
    });

    it('SHOULD NOT throw when an action ID has no matching definition', () => {
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [{ id: 'btn', type: 'button' as const, label: 'Orphan', actions: ['unknown-action'] }],
          actions: [{ id: 'unknown-action', type: 'type-with-no-handler' }],
        },
      };

      render(<>{renderA2UISpec(spec, [])}</>);

      expect(() => fireEvent.click(screen.getByRole('button', { name: 'Orphan' }))).not.toThrow();
    });
  });

  describe('custom components', () => {
    it('SHOULD render a custom component when its type is not built in', () => {
      const customComponents: A2UICustomComponentDefinition[] = [
        {
          type: 'product-badge',
          description: 'Displays a colored status badge.',
          renderer: (component) => <div data-testid="product-badge">{component.label}</div>,
        },
      ];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [{ id: 'badge', type: 'product-badge', label: 'Featured' }],
        },
      } as Parameters<typeof renderA2UISpec>[0];

      render(<>{renderA2UISpec(spec, undefined, customComponents)}</>);

      expect(screen.getByTestId('product-badge')).toHaveTextContent('Featured');
    });

    it('SHOULD prefer the built-in renderer when a custom component collides by type', () => {
      const customComponents: A2UICustomComponentDefinition[] = [
        {
          type: 'button',
          description: 'Attempts to override the built-in button renderer.',
          renderer: () => <div data-testid="custom-button-override">Override</div>,
        },
      ];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [{ id: 'btn', type: 'button' as const, label: 'Built-in Button' }],
        },
      };

      render(<>{renderA2UISpec(spec, undefined, customComponents)}</>);

      expect(screen.getByRole('button', { name: 'Built-in Button' })).toBeTruthy();
      expect(screen.queryByTestId('custom-button-override')).toBeNull();
    });
  });

  describe('memoization', () => {
    it('SHOULD NOT re-invoke a custom renderer when spec, actions, and customComponents keep the same references', () => {
      let renderCount = 0;
      const customComponents: A2UICustomComponentDefinition[] = [
        {
          type: 'stable-badge',
          description: 'Renders a status badge.',
          renderer: (component) => {
            renderCount += 1;
            return <div data-testid="stable-badge">{component.label}</div>;
          },
        },
      ];
      const actions: A2UIActionDefinition[] = [{ type: 'noop', description: '', handler: vi.fn() }];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [{ id: 'badge', type: 'stable-badge', label: 'Featured' }],
        },
      } as Parameters<typeof renderA2UISpec>[0];

      const { rerender } = render(<>{renderA2UISpec(spec, actions, customComponents)}</>);

      expect(renderCount).toBe(1);

      rerender(<>{renderA2UISpec(spec, actions, customComponents)}</>);

      expect(renderCount).toBe(1);
    });

    it('SHOULD re-invoke a custom renderer when the actions reference changes', () => {
      let renderCount = 0;
      const customComponents: A2UICustomComponentDefinition[] = [
        {
          type: 'stable-badge',
          description: 'Renders a status badge.',
          renderer: (component) => {
            renderCount += 1;
            return <div data-testid="stable-badge">{component.label}</div>;
          },
        },
      ];
      const spec = {
        ui: {
          layout: { type: 'vertical' as const, spacing: '0' },
          components: [{ id: 'badge', type: 'stable-badge', label: 'Featured' }],
        },
      } as Parameters<typeof renderA2UISpec>[0];
      const firstActions: A2UIActionDefinition[] = [{ type: 'noop', description: '', handler: vi.fn() }];
      const secondActions: A2UIActionDefinition[] = [{ type: 'noop', description: '', handler: vi.fn() }];

      const { rerender } = render(<>{renderA2UISpec(spec, firstActions, customComponents)}</>);

      expect(renderCount).toBe(1);

      rerender(<>{renderA2UISpec(spec, secondActions, customComponents)}</>);

      expect(renderCount).toBe(2);
    });
  });
});
