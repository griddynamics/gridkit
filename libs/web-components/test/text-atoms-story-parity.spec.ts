import { describe, expect, it } from 'vitest';
import '../src';
import * as typographyStories from '../stories/Typography.stories';
import * as linkStories from '../stories/Link.stories';
import * as labelStories from '../stories/Label.stories';
import * as truncateStories from '../stories/Truncate.stories';
import * as wrapperStories from '../stories/Wrapper.stories';
import type { GdLink, GdTruncate, GdTypography, GdWrapper } from '../src';

type Definition = {
  render?: (args: Record<string, unknown>, context?: unknown) => Node;
  args?: Record<string, unknown>;
  parameters?: { layout?: string; docs?: { disable?: boolean; description?: { story?: string } } };
};
type StoryModule = { default: unknown } & Record<string, unknown>;

const definitionOf = (module: StoryModule, name: string) => module[name] as Definition;
const metaOf = (module: StoryModule) =>
  module.default as {
    args?: Record<string, unknown>;
    render: (args: Record<string, unknown>) => Node;
    parameters: { layout?: string };
    argTypes: Record<string, { table?: { category?: string }; description?: string }>;
  };

const settle = () =>
  Promise.all(
    [...document.body.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('*')].map(
      (el) => el.updateComplete
    )
  );

/** Renders a story the way Storybook does: story render (or the meta render) with merged args. */
const mount = async (module: StoryModule, name: string) => {
  const meta = metaOf(module);
  const definition = definitionOf(module, name);
  const node = (definition.render ?? meta.render)({ ...(meta.args ?? {}), ...definition.args });
  document.body.replaceChildren(node);
  await settle();
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await settle();
  return node;
};

const exportsOf = (module: StoryModule) => Object.keys(module).filter((key) => key !== 'default');

// Same names as the source story files in libs/ui/src/components/atoms/<Name>/<Name>.stories.tsx.
const inventories: Array<[string, StoryModule, string[]]> = [
  [
    'Typography',
    typographyStories,
    [
      'Default',
      'AsCustomComponent',
      'AsCustomHtmlTag',
      'CombinedStyleVariant',
      'Disclaimers',
      'Display',
      'Heading',
      'Body',
      'WithAccessibility',
      'DefaultTokens',
    ],
  ],
  [
    'Link',
    linkStories,
    [
      'Variants',
      'Disabled',
      'TargetBlankVisited',
      'InheritWithButtonAsChild',
      'Inverted',
      'InheritWithTypographyAsChild',
      'InheritWithTailwind',
      'CustomStyles',
      'WithUnderline',
      'WithSizes',
      'WithAccessibility',
      'DefaultTokens',
    ],
  ],
  [
    'Label',
    labelStories,
    ['LabelDefault', 'LabelWithChildIcon', 'CustomStyles', 'DefaultWithTailwind', 'WithAccessibility', 'DefaultTokens'],
  ],
  [
    'Truncate',
    truncateStories,
    ['Default', 'LineTruncation', 'WithCustomStyling', 'RefAPIWithTooltipOnOverflow', 'WithAccessibility'],
  ],
  [
    'Wrapper',
    wrapperStories,
    [
      'InteractiveExample',
      'SectionWrapper',
      'InlineWrapper',
      'FullPageWrapper',
      'CustomTagWrapper',
      'WithAccessibility',
      'DefaultTokens',
    ],
  ],
];

describe.each(inventories)('%s Storybook parity: inventory', (_name, module, names) => {
  it('preserves the source story inventory', () => {
    expect([...exportsOf(module)].sort()).toEqual([...names].sort());
  });
  it('centers stories like the source meta and documents every control', () => {
    const meta = metaOf(module);
    expect(meta.parameters.layout).toBe('centered');
    for (const [key, argType] of Object.entries(meta.argTypes)) {
      expect(argType.description, `${key} description`).toBeTruthy();
    }
  });
});

describe('Typography Storybook parity', () => {
  it('renders the default story as a body paragraph with the same copy', async () => {
    const node = (await mount(typographyStories, 'Default')) as GdTypography;
    expect(node.variant).toBe('p');
    expect(node.shadowRoot!.querySelector('p')).toBeTruthy();
    expect(node.textContent).toBe('This is a default body1 text');
  });

  it('keeps the inherited span variant when a story sets no variant', async () => {
    const node = (await mount(typographyStories, 'CombinedStyleVariant')) as GdTypography;
    expect(node.variant).toBe('span');
    expect(node.styleVariant).toEqual(['italic', 'semibold', 'strike']);
    expect(node.shadowRoot!.querySelector('span')).toBeTruthy();
  });

  it('separates the visual variant from the semantic tag', async () => {
    const node = (await mount(typographyStories, 'AsCustomHtmlTag')) as GdTypography;
    expect([node.variant, node.as]).toEqual(['h3', 'p']);
    expect(node.shadowRoot!.querySelector('p')).toBeTruthy();
  });

  it('renders the h4 styles on a flex row container for the custom component story', async () => {
    const node = (await mount(typographyStories, 'AsCustomComponent')) as GdTypography;
    const inner = node.shadowRoot!.querySelector('div')!;
    expect(node.variant).toBe('h4');
    expect(getComputedStyle(inner).display).toBe('flex');
    expect(getComputedStyle(inner).flexWrap).toBe('wrap');
  });

  it('renders the display rows (plain and strong) for every size', async () => {
    await mount(typographyStories, 'Display');
    const rows = [...document.body.querySelectorAll('gd-row')];
    expect(rows).toHaveLength(11);
    const display = [...document.body.querySelectorAll<GdTypography>('gd-typography')].filter(
      (t) => t.variant === 'div'
    );
    expect(display.map((t) => t.size)).toEqual(['xl', 'xl', 'lg', 'lg', 'md', 'md', 'sm', 'sm', 'xs', 'xs']);
    expect(display.filter((t) => t.querySelector('gd-typography'))).toHaveLength(5);
  });

  it('renders all heading levels and the body variants with the same copy', async () => {
    await mount(typographyStories, 'Heading');
    expect(
      [...document.body.querySelectorAll<GdTypography>('gd-typography')].map((t) => [t.variant, t.textContent])
    ).toEqual(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((variant, index) => [variant, `Heading ${index + 1}`]));
    await mount(typographyStories, 'Body');
    const all = [...document.body.querySelectorAll<GdTypography>('gd-typography')];
    expect(all.map((t) => t.variant)).toEqual(['p', 'p', 'sup', 'p', 'sub', 'small', 'caption', 'i', 'strong']);
    expect(all.find((t) => t.variant === 'caption')!.as).toBe('div');
  });

  it('uses the same nine style variant rows for Disclaimers and WithAccessibility', async () => {
    for (const name of ['Disclaimers', 'WithAccessibility'] as const) {
      const node = await mount(typographyStories, name);
      const texts = [...node.querySelectorAll<GdTypography>('gd-typography')].map((t) => t.textContent);
      expect(texts).toEqual([
        'Italic SemiBold Strike Text',
        'Semibold Text',
        'Normal Text',
        'Light Text',
        'Underline Text',
        'Strike Text',
        'Uppercase Text',
        'Lowercase Text',
        'Small Text',
      ]);
    }
    expect(definitionOf(typographyStories, 'WithAccessibility').parameters?.docs?.disable).toBe(true);
  });

  it('uses the padded layout for the token viewer', () => {
    expect(definitionOf(typographyStories, 'DefaultTokens').parameters?.layout).toBe('padded');
  });
});

describe('Link Storybook parity', () => {
  const anchorOf = (node: Node) => (node as GdLink).shadowRoot!.querySelector('a')!;

  it('renders the variants story as a role=link anchor that reports clicks', async () => {
    const node = (await mount(linkStories, 'Variants')) as GdLink;
    const anchor = anchorOf(node);
    expect(node.textContent).toBe('Variants Link');
    expect(anchor.getAttribute('role')).toBe('link');
    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.hasAttribute('href')).toBe(false);
    const onClick = definitionOf(linkStories, 'Variants').args!['onClick'] as { mock: { calls: unknown[] } };
    anchor.click();
    expect(onClick.mock.calls).toHaveLength(1);
  });

  it('renders the disabled link without href and out of the tab order', async () => {
    const anchor = anchorOf(await mount(linkStories, 'Disabled'));
    expect(anchor.classList.contains('Link--disabled')).toBe(true);
    expect(anchor.hasAttribute('href')).toBe(false);
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(anchor.getAttribute('tabindex')).toBe('-1');
  });

  it('renders the outbound link with the same attributes', async () => {
    const anchor = anchorOf(await mount(linkStories, 'TargetBlankVisited'));
    expect(anchor.getAttribute('href')).toBe('https://storybook.cto-rnd-system-design.griddynamics.net/');
    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('wraps a button and a struck-through typography as children', async () => {
    const withButton = await mount(linkStories, 'InheritWithButtonAsChild');
    expect(withButton.textContent).toBe('Button Link');
    expect((withButton as HTMLElement).querySelector('gd-button')).toBeTruthy();
    const withTypography = (await mount(linkStories, 'InheritWithTypographyAsChild')) as HTMLElement;
    const typography = withTypography.querySelector<GdTypography>('gd-typography')!;
    expect(typography.styleVariant).toBe('strike');
    expect(typography.textContent).toBe('Typography Link');
  });

  it('applies the class names and the custom styles of the inherit stories', async () => {
    const tailwind = (await mount(linkStories, 'InheritWithTailwind')) as GdLink;
    expect(tailwind.classList.contains('rounded-xl')).toBe(true);
    expect(tailwind.textContent).toBe('With tailwind or any other installed UI lib Link');
    const custom = (await mount(linkStories, 'CustomStyles')) as GdLink;
    expect(custom.variant).toBe('inherit');
    expect(custom.styles).toMatchObject({ backgroundColor: 'lightblue', color: 'white', padding: '1rem' });
  });

  it('renders the underline and size showcases with the same copy', async () => {
    const underline = await mount(linkStories, 'WithUnderline');
    const links = [...underline.querySelectorAll<GdLink>('gd-link')];
    expect(links.map((l) => [l.underline, l.textContent])).toEqual([
      ['default', 'Default underline'],
      ['highlight', 'Highlight underline (on hover)'],
      ['none', 'No underline'],
    ]);
    const sizes = [...(await mount(linkStories, 'WithSizes')).querySelectorAll<GdLink>('gd-link')];
    expect(sizes.map((l) => [l.size, l.textContent])).toEqual([
      ['sm', 'Small'],
      ['md', 'Medium'],
      ['lg', 'Large'],
    ]);
  });

  it('labels the accessible link for assistive technology', async () => {
    const node = (await mount(linkStories, 'WithAccessibility')) as GdLink;
    expect(anchorOf(node).getAttribute('aria-label')).toBe('Navigate to Griddynamics Storybook');
  });
});

describe('Label Storybook parity', () => {
  it('renders the plain, icon, styled and accessible labels', async () => {
    const plain = (await mount(labelStories, 'LabelDefault')) as HTMLElement;
    expect(plain.textContent).toBe('Label');
    const withIcon = (await mount(labelStories, 'LabelWithChildIcon')) as HTMLElement;
    expect(withIcon.querySelector('gd-row gd-icon')).toBeTruthy();
    expect(withIcon.textContent?.trim()).toBe('Label');
    const styled = (await mount(labelStories, 'CustomStyles')) as HTMLElement & { styles: object };
    expect(styled.styles).toMatchObject({ backgroundColor: 'lightblue', color: 'white', padding: '1rem' });
    const tailwind = (await mount(labelStories, 'DefaultWithTailwind')) as HTMLElement;
    expect(tailwind.className).toBe('border-2 px-3 py-2 rounded-xl text-xl font-bold underline');
    const accessible = (await mount(labelStories, 'WithAccessibility')) as HTMLElement;
    expect(accessible.shadowRoot!.querySelector('label')!.getAttribute('aria-label')).toBe(
      'Navigate to Griddynamics Storybook'
    );
    expect(accessible.textContent).toBe('Accessible Label');
  });
});

describe('Truncate Storybook parity', () => {
  it('wraps the truncated text in a half-width centered box except for the accessibility story', async () => {
    for (const [name, lines] of [
      ['Default', 1],
      ['LineTruncation', 2],
      ['WithCustomStyling', 1],
    ] as const) {
      const box = (await mount(truncateStories, name)) as HTMLElement;
      expect(box.localName).toBe('gd-box');
      expect([box.getAttribute('width'), box.getAttribute('margin')]).toEqual(['50%', '0 auto']);
      expect(box.querySelector<GdTruncate>('gd-truncate')!.lines).toBe(lines);
    }
    const accessible = (await mount(truncateStories, 'WithAccessibility')) as GdTruncate;
    expect(accessible.localName).toBe('gd-truncate');
    expect(accessible.textContent).toContain('Lorem ipsum');
  });

  it('shows the truncation state next to the truncated text', async () => {
    const root = (await mount(truncateStories, 'RefAPIWithTooltipOnOverflow')) as HTMLElement;
    expect(root.querySelector('gd-truncate')).toBeTruthy();
    expect(root.textContent?.replace(/\s+/g, ' ')).toContain('Ref API State:isTruncated: false');
  });
});

describe('Wrapper Storybook parity', () => {
  it('renders the variant stories with the same copy', async () => {
    const section = (await mount(wrapperStories, 'SectionWrapper')) as GdWrapper;
    expect(section.variant).toBe('section');
    expect(getComputedStyle(section.shadowRoot!.querySelector('.wrapper')!).position).toBe('absolute');
    expect(section.querySelector('gd-typography')!.textContent).toBe(
      'This content is semantically grouped within a `section` element, which is ideal for thematically related content.'
    );
    const inline = (await mount(wrapperStories, 'InlineWrapper')) as GdTypography;
    expect(inline.textContent).toBe(
      'This is a line of text, and this part is wrapped in a span is used for inline content.'
    );
    expect(inline.querySelector<GdWrapper>('gd-wrapper')!.variant).toBe('inline');
    const fullPage = (await mount(wrapperStories, 'FullPageWrapper')) as GdWrapper;
    expect(getComputedStyle(fullPage.shadowRoot!.querySelector('.wrapper')!).position).toBe('fixed');
    expect(definitionOf(wrapperStories, 'FullPageWrapper').parameters?.layout).toBe('fullscreen');
  });

  it('renders the custom tag wrapper as a section element', async () => {
    const node = (await mount(wrapperStories, 'CustomTagWrapper')) as GdWrapper;
    expect(node.shadowRoot!.querySelector('section')).toBeTruthy();
    expect(node.textContent).toBe('Custom tag Wrapper');
    expect(definitionOf(wrapperStories, 'CustomTagWrapper').parameters?.layout).toBe('fullscreen');
  });

  it('reuses the interactive example for the accessibility story', async () => {
    const node = (await mount(wrapperStories, 'WithAccessibility')) as GdWrapper;
    expect(node.textContent).toBe(
      'This is a basic div wrapper. Change the variant in the controls to see different wrapper types.'
    );
    expect(definitionOf(wrapperStories, 'WithAccessibility').parameters?.docs?.disable).toBe(true);
  });
});
