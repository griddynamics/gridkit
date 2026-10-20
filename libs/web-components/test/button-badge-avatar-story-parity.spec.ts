import { afterEach, describe, expect, it } from 'vitest';
import '../src';
import * as avatarStories from '../stories/Avatar.stories';
import * as badgeStories from '../stories/Badge.stories';
import * as buttonStories from '../stories/Button.stories';
import type { GdAvatar, GdBadge, GdButton, GdTypography } from '../src';

type Rendered = {
  render?: (args: Record<string, unknown>, context?: unknown) => HTMLElement;
  args?: Record<string, unknown>;
  parameters?: { layout?: string; docs?: { disable?: boolean; description?: { story?: string } } };
  tags?: string[];
};
type StoryModule = { default: unknown } & Record<string, unknown>;

// Same names (in source order) as the source stories in
// libs/ui/src/components/atoms/{Avatar,Badge,Button}/*.stories.tsx.
const avatarStoryNames = [
  'Default',
  'WithBadge',
  'WithCustomBadgeColor',
  'WithInitials',
  'WithCustomBackgroundColor',
  'WithIcon',
  'WithImageAndFallback',
  'WithDifferentSize',
  'WithAccessibility',
  'DefaultTokens',
];
const badgeStoryNames = [
  'Default',
  'Sizes',
  'Variants',
  'WithIcons',
  'WithBoxStyles',
  'Disabled',
  'WithAccessibility',
  'DefaultTokens',
];
const buttonStoryNames = [
  'AllVariants',
  'Default',
  'WithIcons',
  'IconOnly',
  'FullWidthButton',
  'RoundedButton',
  'DisabledButton',
  'ButtonStatesUsingClass',
  'CustomStyledButton',
  'RealWorldExamples',
  'IsLoading',
  'WithAccessibility',
  'DefaultTokens',
];

// Module namespace keys are alphabetical, so inventories are compared sorted.
const storyNames = (module: StoryModule) =>
  Object.keys(module)
    .filter((key) => key !== 'default')
    .sort();
const mount = async (module: StoryModule, name: string) => {
  const meta = module.default as { render: (args: Record<string, unknown>) => HTMLElement; args?: object };
  const story = module[name] as Rendered;
  const node = (story.render ?? meta.render)({ ...(meta.args ?? {}), ...(story.args ?? {}) });
  document.body.replaceChildren(node);
  await Promise.all(
    [...document.body.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('*')].map(
      (el) => el.updateComplete
    )
  );
  return node;
};
const texts = (node: HTMLElement, selector: string) =>
  [...node.querySelectorAll<GdTypography>(selector)].map((el) => el.textContent);

afterEach(() => document.body.replaceChildren());

describe('Button, Badge and Avatar Storybook parity', () => {
  it('preserves the source story inventory and order', () => {
    expect(storyNames(avatarStories as unknown as StoryModule)).toEqual([...avatarStoryNames].sort());
    expect(storyNames(badgeStories as unknown as StoryModule)).toEqual([...badgeStoryNames].sort());
    expect(storyNames(buttonStories as unknown as StoryModule)).toEqual([...buttonStoryNames].sort());
  });

  it('mirrors the source layouts and accessibility parameters', () => {
    const button = buttonStories as unknown as Record<string, Rendered>;
    expect((buttonStories.default as { parameters: Rendered['parameters'] }).parameters?.layout).toBe('centered');
    expect(button.RealWorldExamples.parameters?.layout).toBe('padded');
    expect(button.DefaultTokens.parameters?.layout).toBe('padded');
    // In the source, `WithAccessibility` reuses `AllVariants`, so both carry the accessibility parameters.
    expect(button.AllVariants.parameters?.docs?.disable).toBe(true);
    expect(button.WithAccessibility.tags).toEqual(['a11y']);
    expect((badgeStories.default as { parameters: Rendered['parameters'] }).parameters?.layout).toBe('padded');
    expect((badgeStories as unknown as Record<string, Rendered>).WithAccessibility.tags).toEqual(['a11y']);
    expect((avatarStories.default as { parameters: Rendered['parameters'] }).parameters?.layout).toBe('centered');
    expect((avatarStories as unknown as Record<string, Rendered>).WithAccessibility.tags).toEqual(['a11y']);
  });

  it('renders every Button variant in the four showcase groups with the source labels', async () => {
    const node = await mount(buttonStories as unknown as StoryModule, 'AllVariants');
    expect(texts(node, 'gd-typography')).toEqual([
      'All Button Variants',
      'The Button component supports six visual variants: Primary, Secondary, Tertiary, Outlined, Text, and Inherit',
      'Basic Variants',
      'With Icons',
      'Icon Only',
      'Disabled State',
    ]);
    const buttons = [...node.querySelectorAll<GdButton>('gd-button')];
    expect(buttons).toHaveLength(24);
    expect(buttons.slice(0, 6).map((b) => b.variant)).toEqual([
      'primary',
      'secondary',
      'tertiary',
      'outlined',
      'text',
      'inherit',
    ]);
    expect(buttons.slice(6, 12).every((b) => b.querySelector('gd-icon[slot="icon-start"]'))).toBe(true);
    expect(buttons.slice(12, 18).every((b) => b.isIcon && b.ariaLabel?.endsWith('icon button'))).toBe(true);
    expect(buttons.slice(18).every((b) => b.disabled)).toBe(true);
  });

  it('renders the Button story arguments, icons, loading and class states', async () => {
    const withIcons = await mount(buttonStories as unknown as StoryModule, 'WithIcons');
    expect(withIcons.textContent).toBe('Save Changes');
    expect(withIcons.querySelector('[slot="icon-start"]')?.getAttribute('name')).toBe('check');
    expect(withIcons.querySelector('[slot="icon-end"]')?.getAttribute('name')).toBe('arrowRight');

    const iconOnly = (await mount(buttonStories as unknown as StoryModule, 'IconOnly')) as GdButton;
    expect(iconOnly.isIcon).toBe(true);
    expect(iconOnly.ariaLabel).toBe('Close');
    expect(iconOnly.textContent).toBe('');

    const classed = (await mount(buttonStories as unknown as StoryModule, 'ButtonStatesUsingClass')) as GdButton;
    expect(classed.classList.contains('active')).toBe(true);
    expect(classed.justifyContent).toBe('start');

    const custom = (await mount(buttonStories as unknown as StoryModule, 'CustomStyledButton')) as GdButton;
    expect(custom.styles).toEqual({ padding: '8px', width: '300px' });

    const loading = await mount(buttonStories as unknown as StoryModule, 'IsLoading');
    expect([...loading.querySelectorAll<GdButton>('gd-button')].map((b) => [b.variant, b.isLoading])).toEqual([
      ['primary', true],
      ['outlined', true],
      ['text', true],
    ]);
  });

  it('renders the Real-World Examples sections with the source copy', async () => {
    const node = await mount(buttonStories as unknown as StoryModule, 'RealWorldExamples');
    expect(texts(node, 'gd-typography')).toEqual([
      'Real-World Examples',
      "Common button patterns and use cases you'll encounter in production applications",
      'Form Actions',
      'Navigation',
      'File Operations',
      'CRUD Actions',
      'Social & Feedback',
      'Toolbar',
      'Call-to-Action',
    ]);
    expect([...node.querySelectorAll('gd-button')].map((b) => b.textContent)).toEqual([
      'Submit',
      'Cancel',
      'Reset',
      'Back',
      'Continue',
      'Skip',
      'Upload File',
      'Attach',
      'Browse',
      'Save',
      'Edit',
      'Delete',
      'Cancel',
      'Like',
      'Favorite',
      'Share',
      '',
      '',
      '',
      '',
      'Get Started',
      'Learn More',
    ]);
  });

  it('renders all Badge sizes, variants, appearances, icons and disabled states', async () => {
    const sizes = await mount(badgeStories as unknown as StoryModule, 'Sizes');
    expect([...sizes.querySelectorAll<GdBadge>('gd-badge')].map((b) => [b.size, b.textContent])).toEqual([
      ['xs', 'Extra Small'],
      ['sm', 'Small'],
      ['md', 'Medium'],
      ['lg', 'Large'],
    ]);

    const variants = await mount(badgeStories as unknown as StoryModule, 'Variants');
    expect(texts(variants, 'gd-typography')).toEqual([
      'Primary:',
      'Secondary:',
      'Tertiary:',
      'Quaternary:',
      'Quinary:',
    ]);
    expect(variants.querySelectorAll('gd-badge')).toHaveLength(20);
    expect(
      [...variants.querySelectorAll<GdBadge>('gd-badge')].slice(0, 4).map((b) => [b.variant, b.appearance])
    ).toEqual([
      ['primary', 'filled'],
      ['primary', 'filledLight'],
      ['primary', 'outline'],
      ['primary', 'outlineFilledLight'],
    ]);

    const icons = await mount(badgeStories as unknown as StoryModule, 'WithIcons');
    expect([...icons.querySelectorAll('gd-icon')].map((i) => [i.slot, i.getAttribute('name')])).toEqual([
      ['icon-start', 'success'],
      ['icon-end', 'warning'],
      ['icon-start', 'info'],
      ['icon-end', 'arrowRight'],
      ['icon-start', 'error'],
      ['icon-start', 'accountCircle'],
    ]);

    const disabled = await mount(badgeStories as unknown as StoryModule, 'Disabled');
    expect([...disabled.querySelectorAll<GdBadge>('gd-badge')].every((b) => b.disabled)).toBe(true);
    expect(disabled.querySelectorAll('gd-badge')).toHaveLength(14);

    const boxStyles = await mount(badgeStories as unknown as StoryModule, 'WithBoxStyles');
    expect([...boxStyles.querySelectorAll<GdBadge>('gd-badge')].map((b) => b.styles)).toEqual([
      { margin: '8px' },
      { padding: '12px 24px' },
      { width: '200px', justifyContent: 'center' },
    ]);
  });

  it('renders Avatar sizes, fallbacks, badge colours and the slotted icon', async () => {
    const sizes = await mount(avatarStories as unknown as StoryModule, 'WithDifferentSize');
    expect([...sizes.querySelectorAll<GdAvatar>('gd-avatar')].map((a) => [a.sizeVariant, a.fallback, a.alt])).toEqual(
      ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map((size) => [size, size.toUpperCase(), 'User avatar'])
    );

    const custom = (await mount(avatarStories as unknown as StoryModule, 'WithCustomBadgeColor')) as GdAvatar;
    expect([custom.withBadge, custom.badgeColor, custom.sizeVariant]).toEqual([true, '#901313', 'xl']);

    const broken = (await mount(avatarStories as unknown as StoryModule, 'WithImageAndFallback')) as GdAvatar;
    expect([broken.src, broken.fallback]).toEqual(['invalid_url', 'NI']);

    const icon = await mount(avatarStories as unknown as StoryModule, 'WithIcon');
    expect(icon.querySelector('gd-icon')?.slot).toBe('fallback');
    expect((icon as GdAvatar).backgroundColor).toBe('#E0E0E0');

    const accessible = (await mount(avatarStories as unknown as StoryModule, 'WithAccessibility')) as GdAvatar;
    expect(accessible.alt).toBe('User Profile: Name');
  });
});
