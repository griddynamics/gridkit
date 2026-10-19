import { describe, expect, it } from 'vitest';
import '../src';
import * as stories from '../stories/Loader.stories';
import type { GdLoader, GdTypography } from '../src';

// Same names as libs/ui/src/components/atoms/Loader/Loader.stories.tsx.
const reactStoryNames = [
  'Default',
  'LoaderNames',
  'LoaderSizes',
  'LoaderRounded',
  'LoaderVariantsWithWrapperViewAsHeaderTag',
  'WithAccessibility',
  'DefaultTokens',
] as const;

type Rendered = { render?: (args: Record<string, unknown>, context?: unknown) => HTMLElement; args?: object };
const story = (name: keyof typeof stories) => stories[name] as unknown as Rendered;
const meta = stories.default as unknown as { render: (args: Record<string, unknown>) => HTMLElement };
const mount = async (name: keyof typeof stories) => {
  const definition = story(name);
  const node = (definition.render ?? meta.render)({ ...(stories.default.args ?? {}), ...definition.args });
  document.body.replaceChildren(node);
  await Promise.all(
    [...document.body.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('*')].map(
      (el) => el.updateComplete
    )
  );
  return node;
};

describe('Loader Storybook parity with React', () => {
  it('preserves the React story inventory', () => {
    expect(Object.keys(stories).filter((key) => key !== 'default')).toEqual([...reactStoryNames].sort());
  });

  it('renders circle and dots side by side with the same headings', async () => {
    const node = await mount('LoaderNames');
    expect([...node.querySelectorAll<GdTypography>('gd-typography')].map((t) => t.textContent)).toEqual([
      'Circle Animation',
      'Dots Animation',
    ]);
    expect([...node.querySelectorAll<GdLoader>('gd-loader')].map((l) => [l.name, l.size])).toEqual([
      ['circle', 'md'],
      ['dots', 'md'],
    ]);
  });

  it('renders every size and every rounded option with its label', async () => {
    const sizes = await mount('LoaderSizes');
    expect([...sizes.querySelectorAll<GdLoader>('gd-loader')].map((l) => l.size)).toEqual([
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ]);
    const rounded = await mount('LoaderRounded');
    expect([...rounded.querySelectorAll<GdLoader>('gd-loader')].map((l) => l.rounded)).toEqual([
      'none',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      'round',
    ]);
    expect(
      [...rounded.querySelectorAll<GdTypography>('gd-typography')]
        .filter((t) => t.variant === 'span')
        .slice(1) // the first span is the description paragraph
        .map((t) => t.textContent)
    ).toEqual(['None', 'XS', 'SM', 'MD', 'LG', 'XL', 'Round']);
  });

  it('uses the header tag as the wrapper element', async () => {
    const header = (await mount('LoaderVariantsWithWrapperViewAsHeaderTag')) as GdLoader;
    expect(header.shadowRoot!.querySelector('[part="wrapper"]')!.tagName).toBe('HEADER');
  });

  it('keeps the accessibility story as a labelled status region around both loaders', async () => {
    const node = await mount('WithAccessibility');
    expect(node.getAttribute('role')).toBe('status');
    expect(node.getAttribute('aria-label')).toBe('Loading content');
    expect([...node.querySelectorAll<GdLoader>('gd-loader')].map((l) => l.name)).toEqual(['circle', 'dots']);
  });
});
