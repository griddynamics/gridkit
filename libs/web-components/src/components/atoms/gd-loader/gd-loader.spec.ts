import { describe, expect, it } from 'vitest';
import './gd-loader';

describe('gd-loader', () => {
  it('renders one circle or exactly three dots with status semantics', async () => {
    const el = document.createElement('gd-loader');
    document.body.append(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('gd-wrapper')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('gd-wrapper')!.getAttribute('part')).toBe('wrapper');
    expect(el.shadowRoot!.querySelectorAll('.dot')).toHaveLength(0);
    el.name = 'dots';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('.dot')).toHaveLength(3);
    expect(el.shadowRoot!.querySelector('[role="status"]')).not.toBeNull();
    el.variant = 'fullPage';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('gd-wrapper')).toBeNull();
    expect(el.shadowRoot!.querySelector('[part="wrapper"]')!.getAttribute('popover')).toBe('manual');
    el.remove();
  });

  it('builds valid animations from the loader animation tokens', async () => {
    const el = document.createElement('gd-loader');
    document.body.append(el);
    await el.updateComplete;

    let cssText = el
      .shadowRoot!.adoptedStyleSheets.flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText))
      .join('\n');
    expect(cssText).toContain('gd-loader-circle');
    expect(cssText).toContain('@keyframes gd-loader-circle');
    expect(cssText).toContain('rotate(360deg)');

    el.name = 'dots';
    await el.updateComplete;
    cssText = el
      .shadowRoot!.adoptedStyleSheets.flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText))
      .join('\n');
    expect(cssText).toContain('gd-loader-dots');
    expect(cssText).toContain('@keyframes gd-loader-dots');
    expect(cssText).toContain('translateY(-15px)');
    el.remove();
  });

  it('uses loader and keyframe overrides from the active theme', async () => {
    const el = document.createElement('gd-loader');
    el.theme = {
      loader: {
        default: { display: 'block' },
        inline: {},
        circle: { default: {}, md: {} },
        animation: { circle: { name: 'customLoaderFrames' } },
      },
      animations: {
        customLoaderFrames: {
          from: { opacity: 0.2 },
          to: { opacity: 0.8 },
        },
      },
    };
    document.body.append(el);
    await el.updateComplete;

    const cssText = el
      .shadowRoot!.adoptedStyleSheets.flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText))
      .join('\n');
    expect(cssText).toContain('@keyframes gd-loader-circle');
    expect(cssText).toContain('opacity: 0.2');
    expect(cssText).toContain('opacity: 0.8');
    expect(cssText).not.toContain('rotate(360deg)');
    el.remove();
  });
});
