import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-scroll';
import type { ScrollbarVisibility } from './gd-scroll';

let host: HTMLDivElement;

beforeEach(() => {
  host = document.createElement('div');
  document.body.append(host);
});

afterEach(() => host.remove());

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

async function mount(options: {
  vertical?: ScrollbarVisibility;
  horizontal?: ScrollbarVisibility;
  autoHide?: boolean;
  contentWidth?: number;
  contentHeight?: number;
}) {
  const element = document.createElement('gd-scroll');
  Object.assign(element, {
    theme: defaultTheme,
    vertical: options.vertical ?? 'auto',
    horizontal: options.horizontal ?? 'auto',
    autoHide: options.autoHide ?? false,
    styles: { width: 120, height: 100, border: '1px solid rgb(160, 174, 192)' },
  });
  const content = document.createElement('div');
  content.textContent = 'Scrollable content';
  content.style.width = `${options.contentWidth ?? 300}px`;
  content.style.height = `${options.contentHeight ?? 400}px`;
  element.append(content);
  host.append(element);
  await element.updateComplete;
  element.refresh();
  await nextFrame();
  await element.updateComplete;
  return element;
}

describe('gd-scroll', () => {
  it('applies React CSS-in-JS numeric dimensions as pixels and wins over document reset styles', async () => {
    const element = await mount({});
    expect(element.getBoundingClientRect().width).toBe(120);
    expect(element.getBoundingClientRect().height).toBe(100);
    expect(getComputedStyle(element).borderWidth).toBe('1px');
    expect(element.clientWidth).toBe(118);
    expect(element.clientHeight).toBe(98);
  });

  it('renders the source content inventory and automatic vertical and horizontal scrollbars', async () => {
    const element = await mount({});
    expect(element.textContent).toContain('Scrollable content');
    expect(element.shadowRoot!.querySelector('[part="content"]')).not.toBeNull();
    expect(element.shadowRoot!.querySelector('[part~="vertical-scrollbar"]')).not.toBeNull();
    expect(element.shadowRoot!.querySelector('[part~="horizontal-scrollbar"]')).not.toBeNull();
    expect(element.shadowRoot!.querySelectorAll('[part~="thumb"]')).toHaveLength(2);
  });

  it('honors visible and hidden modes independently and constrains hidden horizontal content', async () => {
    const element = await mount({ vertical: 'visible', horizontal: 'hidden', contentWidth: 50, contentHeight: 20 });
    expect(element.shadowRoot!.querySelector('[part~="vertical-scrollbar"]')).not.toBeNull();
    expect(element.shadowRoot!.querySelector('[part~="horizontal-scrollbar"]')).toBeNull();
    expect(getComputedStyle(element.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!).maxWidth).toBe('100%');
  });

  it('tracks programmatic scrolling in the rendered thumb geometry', async () => {
    const element = await mount({ vertical: 'visible', horizontal: 'hidden' });
    const thumb = element.shadowRoot!.querySelector<HTMLElement>('[part~="vertical-thumb"]')!;
    expect(thumb.style.top).toBe('0%');
    element.scrollTop = 100;
    element.dispatchEvent(new Event('scroll'));
    await nextFrame();
    await element.updateComplete;
    expect(Number.parseFloat(thumb.style.top)).toBeGreaterThan(0);
  });

  it('exposes the native imperative scrolling surface and a refresh method', async () => {
    const element = await mount({ vertical: 'visible', horizontal: 'hidden' });
    element.scrollTo({ top: 80 });
    expect(element.scrollTop).toBe(80);
    expect(() => element.refresh()).not.toThrow();
  });

  it('uses the component token tree for theme replacement', async () => {
    const element = await mount({ vertical: 'visible' });
    element.theme = {
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        neutral: { ...defaultTheme.colors.neutral, 'grey.80': 'rgb(1, 2, 3)' },
      },
    };
    await element.updateComplete;
    const thumb = element.shadowRoot!.querySelector<HTMLElement>('[part~="vertical-thumb"]')!;
    expect(getComputedStyle(thumb).backgroundColor).toBe('rgb(1, 2, 3)');
  });

  it('reveals auto-hidden scrollbars while scrolling and hides them after inactivity', async () => {
    const element = await mount({ vertical: 'visible', horizontal: 'hidden', autoHide: true });
    const scrollbar = element.shadowRoot!.querySelector<HTMLElement>('[part~="vertical-scrollbar"]')!;
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(getComputedStyle(scrollbar).opacity).toBe('0');

    element.scrollTop = 40;
    element.dispatchEvent(new Event('scroll'));
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(getComputedStyle(scrollbar).opacity).toBe('0.2');

    await new Promise((resolve) => setTimeout(resolve, 1050));
    await element.updateComplete;
    expect(getComputedStyle(scrollbar).opacity).toBe('0');
  });

  it('maps pointer dragging on the vertical thumb to native scrollTop', async () => {
    const element = await mount({ vertical: 'visible', horizontal: 'hidden' });
    const track = element.shadowRoot!.querySelector<HTMLElement>('[part~="vertical-scrollbar"]')!;
    const thumb = element.shadowRoot!.querySelector<HTMLElement>('[part~="vertical-thumb"]')!;
    const trackRect = track.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();

    thumb.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        clientX: thumbRect.left + thumbRect.width / 2,
        clientY: thumbRect.top + thumbRect.height / 2,
      })
    );
    document.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: trackRect.left + trackRect.width / 2,
        clientY: trackRect.bottom - 1,
      })
    );
    document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

    expect(element.scrollTop).toBeGreaterThan(0);
  });

  it('polls overflow like React when shadow content changes without a slotchange', async () => {
    const element = await mount({ vertical: 'auto', horizontal: 'hidden', contentWidth: 50, contentHeight: 20 });
    const content = element.firstElementChild as HTMLElement;
    expect(element.shadowRoot!.querySelector('[part~="vertical-scrollbar"]')).toBeNull();

    content.style.height = '400px';
    await new Promise((resolve) => setTimeout(resolve, 350));
    await element.updateComplete;

    expect(element.shadowRoot!.querySelector('[part~="vertical-scrollbar"]')).not.toBeNull();
  });
});
