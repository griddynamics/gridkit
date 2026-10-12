import { describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-skeleton';

describe('gd-skeleton', () => {
  it('renders the rounded animated source default and slotted children', async () => {
    const el = document.createElement('gd-skeleton');
    el.theme = defaultTheme;
    el.textContent = 'Loading Content...';
    document.body.append(el);
    await el.updateComplete;
    const skeleton = el.shadowRoot!.querySelector<HTMLElement>('[part="skeleton"]')!;
    expect(skeleton).not.toBeNull();
    expect(getComputedStyle(skeleton).animationName).toBe('gd-skeleton-animation');
    const cssText = el
      .shadowRoot!.adoptedStyleSheets.flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText))
      .join('\n');
    expect(cssText).toContain('@keyframes gd-skeleton-animation');
    expect(cssText).toContain('opacity: 0.4');
    expect(el.textContent).toBe('Loading Content...');
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

  it('uses skeleton and animation overrides from the active theme', async () => {
    const el = document.createElement('gd-skeleton');
    el.animationName = 'customSkeletonFrames';
    el.theme = {
      skeleton: {
        default: { display: 'block', backgroundColor: 'rgb(1, 2, 3)' },
        rounded: { borderRadius: '11px' },
      },
      animations: {
        customSkeletonFrames: {
          from: { opacity: 0.1 },
          to: { opacity: 0.9 },
        },
      },
    };
    document.body.append(el);
    await el.updateComplete;

    const skeleton = el.shadowRoot!.querySelector<HTMLElement>('[part="skeleton"]')!;
    const style = getComputedStyle(skeleton);
    expect(style.borderRadius).toBe('11px');
    expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
    const cssText = el
      .shadowRoot!.adoptedStyleSheets.flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText))
      .join('\n');
    expect(cssText).toContain('@keyframes gd-skeleton-animation');
    expect(cssText).toContain('opacity: 0.1');
    expect(cssText).toContain('opacity: 0.9');
    expect(cssText).not.toContain('opacity: 0.4');
    el.remove();
  });
});
