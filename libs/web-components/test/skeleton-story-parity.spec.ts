import { describe, expect, it } from 'vitest';
import '../src';
import * as stories from '../stories/Skeleton.stories';
import type { GdSkeleton, GdTypography } from '../src';

const storyNames = [
  'Default',
  'Circular',
  'Rectangular',
  'WithThemeColor',
  'WithCustomAnimation',
  'WithChildren',
  'ComposedLayout',
  'WithAccessibility',
  'DefaultTokens',
] as const;

describe('Skeleton Storybook parity', () => {
  it('preserves the complete React story inventory', () => {
    expect(Object.keys(stories).filter((key) => key !== 'default')).toEqual(expect.arrayContaining(storyNames));
    expect(Object.keys(stories).filter((key) => key !== 'default')).toHaveLength(storyNames.length);
  });

  it('renders the same article-placeholder structure and typography variants', async () => {
    const story = stories.ComposedLayout as { render: () => HTMLElement };
    const rendered = story.render();
    document.body.replaceChildren(rendered);

    const skeletons = [...rendered.querySelectorAll<GdSkeleton>('gd-skeleton')];
    const typography = [...rendered.querySelectorAll<GdTypography>('gd-typography')];
    await Promise.all(skeletons.map((skeleton) => skeleton.updateComplete));
    await Promise.all(typography.map((text) => text.updateComplete));

    expect(skeletons).toHaveLength(7);
    expect(skeletons[0].variant).toBe('circular');
    expect(typography.map((text) => text.variant)).toEqual(['h3', 'p', 'small', 'p', 'p', 'p']);
    expect(typography.map((text) => text.shadowRoot!.firstElementChild!.tagName.toLowerCase())).toEqual([
      'h3',
      'p',
      'small',
      'p',
      'p',
      'p',
    ]);
    expect(typography[0].styles.marginBottom).toBe('16px');
    expect(typography.slice(1, 3).map((text) => text.styles.marginBottom)).toEqual(['10px', '10px']);
  });

  it('keeps child content and the custom animation wired to the public CSS part', async () => {
    const childStory = stories.WithChildren as { render: (args: Record<string, never>) => HTMLElement };
    const childSkeleton = childStory.render({}) as GdSkeleton;
    document.body.replaceChildren(childSkeleton);
    await childSkeleton.updateComplete;

    const childTypography = childSkeleton.querySelector<GdTypography>('gd-typography')!;
    expect(childTypography.variant).toBe('small');
    expect(childTypography.textContent).toBe('Loading Content...');

    const animationStory = stories.WithCustomAnimation as {
      render: (args: { width: string; height: string; animationName: null }) => HTMLElement;
    };
    const animation = animationStory.render({ width: '250px', height: '15px', animationName: null });
    const animatedSkeleton = animation.querySelector<GdSkeleton>('gd-skeleton')!;

    expect(animation.querySelector('style')!.textContent).toContain('gd-skeleton.animate-pulse::part(skeleton)');
    expect(animatedSkeleton.classList.contains('animate-pulse')).toBe(true);
    expect(animatedSkeleton.animationName).toBeNull();
  });
});
