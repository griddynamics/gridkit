import { beforeEach, describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-typography';
import type { GdTypography } from './gd-typography';

describe('gd-typography React parity', () => {
  let host: HTMLElement;
  beforeEach(() => {
    host = document.createElement('div');
    document.body.replaceChildren(host);
  });
  async function mount(props: Partial<GdTypography>) {
    const el = document.createElement('gd-typography');
    Object.assign(el, { theme: defaultTheme }, props);
    el.textContent = 'Text';
    host.append(el);
    await el.updateComplete;
    return el;
  }
  it.each([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'small',
    'div',
    'span',
    'strong',
    'i',
    'code',
    'kbd',
    'caption',
    'header',
    'sup',
    'sub',
  ] as const)('supports the React %s variant', async (variant) => {
    const el = await mount({ variant });
    expect(el.shadowRoot!.firstElementChild).toBeTruthy();
  });
  it('applies display size, alignment, token color, style variants, and custom styles', async () => {
    const el = await mount({
      variant: 'div',
      size: 'xl',
      align: 'center',
      color: 'text.default',
      styleVariant: ['bold', 'italic'],
      styles: { letterSpacing: '2px' },
    });
    const inner = el.shadowRoot!.querySelector<HTMLElement>('div')!;
    expect(inner.style.fontSize).toBeTruthy();
    expect(inner.style.textAlign).toBe('center');
    expect(inner.style.color).toBeTruthy();
    expect(inner.style.fontWeight).toBe('700');
    expect(inner.style.fontStyle).toBe('italic');
    expect(inner.style.letterSpacing).toBe('2px');
  });
  it('separates visual variant from semantic tag', async () => {
    const el = await mount({ variant: 'h2', as: 'h3' });
    expect(el.shadowRoot!.querySelector('h3')).toBeTruthy();
  });
});
