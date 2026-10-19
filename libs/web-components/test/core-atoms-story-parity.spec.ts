import { describe, expect, it } from 'vitest';
import { iconCatalog } from 'gd-design-library/icons';
import '../src';
import * as boxStories from '../stories/Box.stories';
import * as iconStories from '../stories/Icon.stories';
import * as imageStories from '../stories/Image.stories';
import * as separatorStories from '../stories/Separator.stories';
import type { GdBox, GdIcon, GdImage, GdSeparator, GdTypography } from '../src';

type Rendered = {
  name?: string;
  render?: (args: Record<string, unknown>, context?: unknown) => HTMLElement;
  args?: Record<string, unknown>;
  parameters?: { layout?: string; docs?: { description?: { story?: string }; source?: { code?: string } } };
};
type Stories = Record<string, unknown> & { default: { render?: Rendered['render']; args?: object } };

const mount = async (stories: Stories, name: string, args: Record<string, unknown> = {}) => {
  const definition = stories[name] as Rendered;
  const render = definition.render ?? stories.default.render!;
  const node = render({ ...(stories.default.args ?? {}), ...definition.args, ...args });
  document.body.replaceChildren(node);
  await Promise.all(
    [...document.body.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('*')].map(
      (el) => el.updateComplete
    )
  );
  return node;
};
// Module namespace keys are alphabetical, so inventories are compared as sorted sets.
const names = (stories: object) =>
  Object.keys(stories)
    .filter((key) => key !== 'default')
    .sort();
const texts = (root: ParentNode) =>
  [...root.querySelectorAll<GdTypography>('gd-typography')].map((typography) => typography.textContent);

describe('Box Storybook parity with the source stories', () => {
  // Same names as libs/ui/src/components/atoms/Box/Box.stories.tsx.
  const sourceNames = [
    'Default',
    'Bordered',
    'Highlighted',
    'WithShadowHover',
    'VerticalLayout',
    'HorizontalLayout',
    'CenteredContent',
    'Examples',
    'WithAccessibility',
    'DefaultTokens',
  ];

  it('preserves the story inventory', () => {
    expect(names(boxStories)).toEqual([...sourceNames].sort());
  });

  it('renders the content and Box style arguments of the interactive stories', async () => {
    const box = (await mount(boxStories, 'Default')) as GdBox;
    expect(box.textContent).toBe('Box Content');
    expect([box.variant, box.padding]).toEqual(['vertical', '20px']);
    const hover = (await mount(boxStories, 'WithShadowHover')) as GdBox;
    expect(hover.withShadowHover).toBe(true);
    expect(hover.styles).toEqual({ backgroundColor: '#fff' });
    const highlighted = (await mount(boxStories, 'Highlighted')) as GdBox;
    expect([highlighted.isBordered, highlighted.isHighlighted]).toEqual([true, true]);
  });

  it('stacks three items vertically and spreads three items horizontally', async () => {
    const vertical = (await mount(boxStories, 'VerticalLayout')) as GdBox;
    expect([...vertical.children].map((child) => child.textContent)).toEqual(['Item 1', 'Item 2', 'Item 3']);
    expect([vertical.variant, vertical.gap, vertical.isBordered]).toEqual(['vertical', '10px', true]);
    const horizontal = (await mount(boxStories, 'HorizontalLayout')) as GdBox;
    expect(horizontal.variant).toBe('horizontal');
    expect([...horizontal.children].map((child) => (child as HTMLElement).style.flex)).toEqual([
      '1 1 0%',
      '1 1 0%',
      '1 1 0%',
    ]);
  });

  it('centers a heading and a description inside a fixed-size box', async () => {
    const box = (await mount(boxStories, 'CenteredContent')) as GdBox;
    expect([box.width, box.height, box.justifyContent, box.alignItems]).toEqual(['300px', '200px', 'center', 'center']);
    expect(texts(box)).toEqual(['Centered', 'Content is centered both horizontally and vertically']);
  });

  it('renders the same showcase for Examples and WithAccessibility', async () => {
    const examples = await mount(boxStories, 'Examples');
    const expected = [
      'Box Component Examples',
      'Various use cases demonstrating the flexibility of the Box component',
      'Vertical vs Horizontal Variants',
      'Vertical (Default)',
      'Stacks children vertically',
      'Horizontal',
      'Arranges children horizontally',
      'Border & Hover Effects',
      'Hover over each box to see different effects',
      'Default',
      'No hover effect',
      'Bordered',
      'Static border',
      'Highlighted',
      'Outline on hover',
      'Shadow Hover',
      'Shadow on hover',
      'Combined',
      'Border + shadow',
      'Horizontal Layout with Gap',
      'Vertical Stack',
      'Interactive Card-like Containers',
      'Outline Effect',
      'Uses `isBordered` and `isHighlighted` for outline hover effect.',
      'Elevation Effect',
      'Uses `withShadowHover` for shadow elevation on hover.',
      'Complex Nested Layout',
      'Dashboard Section',
      'Metric 1',
      '1,234',
      'Metric 2',
      '5,678',
    ];
    expect(texts(examples)).toEqual(expected);
    const plainBoxTexts = [...examples.querySelectorAll<GdBox>('gd-box')]
      .filter((box) => box.children.length === 0)
      .map((box) => box.textContent);
    expect(plainBoxTexts).toEqual(['Box 1', 'Box 2', 'Box 3', 'Item 1', 'Item 2', 'Item 3']);
    expect(texts(await mount(boxStories, 'WithAccessibility'))).toEqual(expected);
  });
});

describe('Image Storybook parity with the source stories', () => {
  // Same names as libs/ui/src/components/atoms/Image/Image.stories.tsx.
  const sourceNames = [
    'Default',
    'WithCaption',
    'WithPlaceholder',
    'Clickable',
    'FallbackImage',
    'WithAsProp',
    'WithCaptionAsProp',
    'WithAccessibility',
    'DefaultTokens',
  ];

  it('preserves the story inventory and the source story display names', () => {
    expect(names(imageStories)).toEqual([...sourceNames].sort());
    expect((imageStories.Default as Rendered).name).toBe('Default Image');
    expect((imageStories.WithAsProp as Rendered).name).toBe('Image With As Prop');
    expect((imageStories.WithCaptionAsProp as Rendered).name).toBe('Image With captionAs Prop');
    expect((imageStories.FallbackImage as Rendered).name).toBe('Fallback Image');
  });

  it('passes the shared 150px arguments and per-story arguments to the element', async () => {
    const image = (await mount(imageStories, 'WithCaption')) as GdImage;
    expect([image.id, image.className, image.width, image.height, image.alt]).toEqual([
      'test-image',
      'custom-class',
      150,
      150,
      'Test image',
    ]);
    expect(image.src).toBe('https://picsum.photos/150/150');
    expect(image.caption).toBe('This is a sample caption below the image.');
    expect(((await mount(imageStories, 'WithPlaceholder')) as GdImage).placeholder).toBe('Loading image...');
  });

  it('renders the polymorphic wrapper and caption elements', async () => {
    const figure = (await mount(imageStories, 'WithAsProp')) as GdImage;
    expect(figure.shadowRoot!.querySelector('[part="root"]')!.localName).toBe('figure');
    const paragraph = (await mount(imageStories, 'WithCaptionAsProp')) as GdImage;
    expect(paragraph.shadowRoot!.querySelector('[part="caption"]')!.localName).toBe('p');
    expect(paragraph.shadowRoot!.querySelector('[part="root"]')!.localName).toBe('div');
  });

  it('shows slotted fallback content when there is no source', async () => {
    const image = (await mount(imageStories, 'FallbackImage')) as GdImage;
    expect(image.src).toBeUndefined();
    const fallback = image.querySelector('[slot="fallback"]')!;
    expect(fallback.getAttribute('role')).toBe('alert');
    expect(fallback.textContent).toBe('Fallback component');
    expect(fallback.querySelector('gd-icon')!.getAttribute('name')).toBe('error');
  });

  it('keeps the accessibility attributes on the element', async () => {
    const image = await mount(imageStories, 'WithAccessibility');
    expect(image.getAttribute('aria-label')).toBe('Accessible Image');
    expect(image.getAttribute('role')).toBe('img');
  });

  it('reports a click on the image but not on the caption', async () => {
    const clicks: Event[] = [];
    const image = (await mount(imageStories, 'Clickable', {
      onClick: (event: Event) => clicks.push(event),
    })) as GdImage;
    expect(image.caption).toBe('Click me!');
    image.shadowRoot!.querySelector<HTMLElement>('figcaption')!.click();
    expect(clicks).toHaveLength(0);
    image.shadowRoot!.querySelector<HTMLElement>('img')!.click();
    expect(clicks).toHaveLength(1);
  });
});

describe('Icon Storybook parity with the source stories', () => {
  // Same names as libs/ui/src/components/atoms/Icon/Icon.stories.tsx, in the same order.
  const sourceNames = [
    'AllIcons',
    'Default',
    'WithDefinedSize',
    'RegisteringCustomIcons',
    'WithAccessibility',
    'DefaultTokens',
  ];

  it('preserves the story inventory and display names', () => {
    expect(names(iconStories)).toEqual([...sourceNames].sort());
    expect((iconStories.AllIcons as Rendered).name).toBe('Icons Library');
    expect((iconStories.RegisteringCustomIcons as Rendered).name).toBe('Registering a Custom Icon');
  });

  it('lists every library icon with its name in a centered, wrapping row', async () => {
    const root = await mount(iconStories, 'AllIcons');
    const icons = [...root.querySelectorAll<GdIcon>('gd-icon')];
    expect(icons.map((icon) => icon.name)).toEqual(Object.keys(iconCatalog));
    expect(icons.every((icon) => icon.size === 'md')).toBe(true);
    expect(texts(root)).toEqual(Object.keys(iconCatalog));
    const accessible = await mount(iconStories, 'WithAccessibility');
    expect(accessible.querySelectorAll('gd-icon')).toHaveLength(icons.length);
  });

  it('mirrors the argument defaults of the interactive stories', async () => {
    expect(((await mount(iconStories, 'Default')) as GdIcon).name).toBe('check');
    const sized = (await mount(iconStories, 'WithDefinedSize')) as GdIcon;
    expect([sized.name, sized.size, sized.padding]).toEqual(['check', 'lg', '3px']);
  });

  it('renders the registered custom person icon', async () => {
    const icon = (await mount(iconStories, 'RegisteringCustomIcons')) as GdIcon;
    expect([icon.name, icon.size]).toEqual(['person', 'lg']);
    expect(icon.shadowRoot!.querySelectorAll('svg path')).toHaveLength(1);
  });
});

describe('Separator Storybook parity with the source stories', () => {
  // Same names as libs/ui/src/components/atoms/Separator/Separator.stories.tsx.
  const sourceNames = [
    'Default',
    'WithCustomColor',
    'WithDifferentVariants',
    'WithLabel',
    'Vertical',
    'VerticalWithLabel',
    'WithAccessibility',
    'DefaultTokens',
  ];

  it('preserves the story inventory', () => {
    expect(names(separatorStories)).toEqual([...sourceNames].sort());
  });

  it('wraps the template separator in a 300px container', async () => {
    const wrapper = (await mount(separatorStories, 'WithCustomColor')) as HTMLElement;
    expect(wrapper.style.width).toBe('300px');
    expect(wrapper.querySelector<GdSeparator>('gd-separator')!.color).toBe('brand.500');
  });

  it('shows solid, dashed and dotted separators in a centered column', async () => {
    const wrapper = (await mount(separatorStories, 'WithDifferentVariants')) as HTMLElement;
    expect(wrapper.style.width).toBe('400px');
    expect(wrapper.querySelector('gd-column')!.align).toBe('center');
    expect([...wrapper.querySelectorAll<GdSeparator>('gd-separator')].map((s) => [s.size, s.variant])).toEqual([
      ['md', 'solid'],
      ['md', 'dashed'],
      ['md', 'dotted'],
    ]);
  });

  it('shows start, center and end labels', async () => {
    const wrapper = (await mount(separatorStories, 'WithLabel')) as HTMLElement;
    expect(
      [...wrapper.querySelectorAll<GdSeparator>('gd-separator')].map((s) => [s.label, s.labelPosition, s.labelColor])
    ).toEqual([
      ['Label', 'start', undefined],
      ['Label', 'center', 'brand.500'],
      ['Label', 'end', undefined],
    ]);
  });

  it('puts a 200px vertical separator between two cards', async () => {
    for (const [name, label] of [
      ['Vertical', undefined],
      ['VerticalWithLabel', 'Or'],
    ] as const) {
      const row = await mount(separatorStories, name);
      expect(texts(row)).toEqual(['Title 1', 'Description 1', 'Title 2', 'Description 2']);
      const separator = row.querySelector<GdSeparator>('gd-separator')!;
      expect([separator.orientation, separator.length, separator.label]).toEqual(['vertical', '200px', label]);
      expect([...row.children].map((child) => child.localName)).toEqual(['gd-box', 'gd-separator', 'gd-box']);
    }
  });
});
