import { describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-loader';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('gd-loader', () => {
  it('renders one circle or exactly three dots with status semantics', async () => {
    const el = document.createElement('gd-loader');
    document.body.append(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[part="wrapper"]')!.hasAttribute('popover')).toBe(false);
    expect(el.shadowRoot!.querySelectorAll('.dot')).toHaveLength(0);
    el.name = 'dots';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('.dot')).toHaveLength(3);
    expect(el.shadowRoot!.querySelector('[role="status"]')).not.toBeNull();
    el.variant = 'fullPage';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[part="wrapper"]')!.getAttribute('popover')).toBe('manual');
    el.remove();
  });

  it('runs circle and dots animations from the shared theme keyframes', async () => {
    const el = document.createElement('gd-loader');
    el.theme = {
      ...defaultTheme,
      animations: {
        ...defaultTheme.animations,
        spinKeyframes: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
      },
    };
    el.animationProps = '160ms linear infinite';
    el.withWrapper = false;
    document.body.append(el);
    await el.updateComplete;

    const loader = el.shadowRoot!.querySelector<HTMLElement>('[part="loader"]')!;
    const firstTransform = getComputedStyle(loader).transform;
    await wait(50);
    const secondTransform = getComputedStyle(loader).transform;
    expect(getComputedStyle(loader).animationName).toBe('gd-loader-spin');
    expect(getComputedStyle(loader).animationDuration).toBe('0.16s');
    expect(secondTransform).not.toBe(firstTransform);

    el.name = 'dots';
    await el.updateComplete;
    const dot = el.shadowRoot!.querySelector<HTMLElement>('[part="dot"]')!;
    const firstDotTransform = getComputedStyle(dot).transform;
    await wait(50);
    const secondDotTransform = getComputedStyle(dot).transform;
    expect(getComputedStyle(dot).animationName).toBe('gd-loader-bounce');
    expect(secondDotTransform).not.toBe(firstDotTransform);
    el.remove();
  });

  describe('wrapper (same wrapper tokens as React <Wrapper>)', () => {
    const mount = async (setup: (el: HTMLElementTagNameMap['gd-loader']) => void) => {
      const host = document.createElement('div');
      host.style.cssText = 'position: relative; width: 300px; height: 200px;';
      const el = document.createElement('gd-loader');
      el.theme = defaultTheme;
      setup(el);
      host.append(el);
      document.body.append(host);
      await el.updateComplete;
      return { host, el, wrapper: el.shadowRoot!.querySelector<HTMLElement>('[part="wrapper"]')! };
    };

    it('inline: inline-flex centered wrapper with the backdrop tint and blur', async () => {
      const { host, wrapper } = await mount(() => undefined);
      const style = getComputedStyle(wrapper);
      expect(style.display).toBe('inline-flex');
      expect(style.justifyContent).toBe('center');
      expect(style.alignItems).toBe('center');
      expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0.1)');
      expect(style.backdropFilter).toBe('blur(2px)');
      host.remove();
    });

    it('section: fills the positioned parent and centers the loader', async () => {
      const { host, wrapper, el } = await mount((loader) => (loader.variant = 'section'));
      const style = getComputedStyle(wrapper);
      expect(style.position).toBe('absolute');
      expect(style.display).toBe('flex');
      const box = wrapper.getBoundingClientRect();
      const parent = host.getBoundingClientRect();
      expect([box.width, box.height]).toEqual([parent.width, parent.height]);
      const loader = el.shadowRoot!.querySelector('[part="loader"]')!.getBoundingClientRect();
      expect(Math.abs(loader.left + loader.width / 2 - (box.left + box.width / 2))).toBeLessThan(1);
      expect(Math.abs(loader.top + loader.height / 2 - (box.top + box.height / 2))).toBeLessThan(1);
      host.remove();
    });

    it('fullPage: fixed viewport overlay in the top layer with the loader centered', async () => {
      const { host, wrapper, el } = await mount((loader) => (loader.variant = 'fullPage'));
      expect(wrapper.matches(':popover-open')).toBe(true);
      const style = getComputedStyle(wrapper);
      expect(style.position).toBe('fixed');
      const box = wrapper.getBoundingClientRect();
      expect([box.left, box.top]).toEqual([0, 0]);
      expect(box.width).toBe(document.documentElement.clientWidth);
      expect(box.height).toBe(window.innerHeight);
      expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0.1)');
      const loader = el.shadowRoot!.querySelector('[part="loader"]')!.getBoundingClientRect();
      expect(Math.abs(loader.left + loader.width / 2 - box.width / 2)).toBeLessThan(1);
      expect(Math.abs(loader.top + loader.height / 2 - box.height / 2)).toBeLessThan(1);
      host.remove();
    });

    it('WrapperView changes the wrapper tag; withWrapper=false renders no wrapper', async () => {
      const { host, el, wrapper } = await mount((loader) => (loader.WrapperView = 'header'));
      expect(wrapper.tagName).toBe('HEADER');
      el.WrapperView = 'not a tag!' as never;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('[part="wrapper"]')!.tagName).toBe('SPAN');
      el.withWrapper = false;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('[part="wrapper"]')).toBeNull();
      host.remove();
    });
  });
});
