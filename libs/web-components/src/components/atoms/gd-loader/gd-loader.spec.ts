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
});
