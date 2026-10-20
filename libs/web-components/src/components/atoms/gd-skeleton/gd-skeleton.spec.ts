import { describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-skeleton';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('gd-skeleton', () => {
  it('renders the rounded animated source default and slotted children', async () => {
    const el = document.createElement('gd-skeleton');
    el.theme = defaultTheme;
    el.textContent = 'Loading Content...';
    document.body.append(el);
    await el.updateComplete;
    const skeleton = el.shadowRoot!.querySelector<HTMLElement>('[part="skeleton"]')!;
    expect(skeleton).not.toBeNull();
    expect(getComputedStyle(el).display).toBe('contents');
    expect(getComputedStyle(skeleton).animationName).toBe('gd-skeleton-animation');
    expect(getComputedStyle(skeleton).animationDuration).toBe('2s');
    expect(getComputedStyle(skeleton).animationDelay).toBe('0.5s');
    // `skeleton.default.backgroundColor` = `colors.neutral["grey.30"]` (#E5E5E5) at 0.7 alpha.
    expect(getComputedStyle(skeleton).backgroundColor).toBe('rgba(229, 229, 229, 0.7)');
    expect(el.textContent).toBe('Loading Content...');
    el.remove();
  });

  it('preserves the React width: 100% behavior when no explicit dimensions are provided', async () => {
    const container = document.createElement('div');
    container.style.width = '320px';
    const el = document.createElement('gd-skeleton');
    el.theme = defaultTheme;
    container.append(el);
    document.body.append(container);
    await el.updateComplete;

    const skeleton = el.shadowRoot!.querySelector<HTMLElement>('[part="skeleton"]')!;
    expect(getComputedStyle(skeleton).width).toBe('320px');
    expect(skeleton.getBoundingClientRect().height).toBeGreaterThan(0);
    container.remove();
  });

  it('runs resolved keyframes and responds to active theme animation overrides', async () => {
    const el = document.createElement('gd-skeleton');
    el.animationProps = '160ms linear infinite';
    el.theme = {
      ...defaultTheme,
      animations: {
        ...defaultTheme.animations,
        blinkKeyframes: {
          '0%': { opacity: 0.2 },
          '100%': { opacity: 0.9 },
        },
      },
    };
    document.body.append(el);
    await el.updateComplete;
    const skeleton = el.shadowRoot!.querySelector<HTMLElement>('[part="skeleton"]')!;
    const firstOpacity = Number(getComputedStyle(skeleton).opacity);
    await wait(50);
    const secondOpacity = Number(getComputedStyle(skeleton).opacity);
    expect(getComputedStyle(skeleton).animationName).toBe('gd-skeleton-animation');
    expect(secondOpacity).not.toBeCloseTo(firstOpacity, 2);
    el.remove();
  });

  it('supports rectangular dimensions, theme colors, and disabled animation', async () => {
    const el = document.createElement('gd-skeleton');
    Object.assign(el, {
      theme: defaultTheme,
      variant: 'rectangular',
      width: '120px',
      height: '40px',
      backgroundColor: 'theme.palette.success.main',
      animationName: null,
    });
    document.body.append(el);
    await el.updateComplete;
    const skeleton = el.shadowRoot!.querySelector<HTMLElement>('[part="skeleton"]')!;
    const style = getComputedStyle(skeleton);
    expect(style.width).toBe('120px');
    expect(style.height).toBe('40px');
    expect(style.borderRadius).toBe('0px');
    expect(style.animationName).toBe('none');
    expect(style.backgroundColor).not.toBe('');
    el.remove();
  });
});
