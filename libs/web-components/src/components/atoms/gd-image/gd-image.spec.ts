import { describe, expect, it, vi } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-image';

describe('gd-image', () => {
  it('renders caption and switches to slotted fallback after an image error', async () => {
    const element = document.createElement('gd-image');
    element.theme = defaultTheme;
    element.src = '/missing.png';
    element.alt = 'Missing portrait';
    element.caption = 'Portrait';
    element.innerHTML = '<span slot="fallback">Unavailable</span>';
    const onError = vi.fn();
    element.addEventListener('gd-error', onError);
    document.body.append(element);
    await element.updateComplete;
    const image = element.shadowRoot!.querySelector('img')!;
    image.dispatchEvent(new Event('error'));
    await element.updateComplete;
    expect(onError).toHaveBeenCalledOnce();
    expect(element.shadowRoot!.querySelector('img')).toBeNull();
    expect(element.shadowRoot!.querySelector('slot[name="fallback"]')).not.toBeNull();
    expect(element.shadowRoot!.querySelector('figcaption')?.textContent).toBe('Portrait');
    element.remove();
  });

  it('matches React wrapper, caption, and placeholder semantics', async () => {
    const element = document.createElement('gd-image');
    element.src = '/portrait.png';
    element.placeholder = 'Loading image...';
    element.caption = 'Caption';
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('[part="root"]')?.tagName).toBe('DIV');
    expect(element.shadowRoot!.querySelector('gd-skeleton')?.textContent).toContain('Loading image...');
    const image = element.shadowRoot!.querySelector('img')!;
    expect(image.getAttribute('src')).toBe('/portrait.png');
    image.dispatchEvent(new Event('load'));
    await element.updateComplete;
    expect(image.style.opacity).toBe('1');
    expect(element.shadowRoot!.querySelector('gd-skeleton')).toBeNull();
    element.as = 'figure';
    element.captionAs = 'p';
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('[part="root"]')?.tagName).toBe('FIGURE');
    expect(element.shadowRoot!.querySelector('[part="caption"]')?.tagName).toBe('P');
    element.remove();
  });
});
