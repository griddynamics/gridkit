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

  it('composes the shared animated skeleton only when placeholder content is provided', async () => {
    const element = document.createElement('gd-image');
    element.theme = defaultTheme;
    element.src = '/pending-image.png';
    element.innerHTML = '<span slot="placeholder">Loading…</span>';
    document.body.append(element);
    await element.updateComplete;
    await element.updateComplete;

    const placeholder = element.shadowRoot!.querySelector<HTMLElement>('[part="placeholder"]')!;
    const skeleton = placeholder.querySelector('gd-skeleton')!;
    await skeleton.updateComplete;
    const surface = skeleton.shadowRoot!.querySelector<HTMLElement>('[part="skeleton"]')!;
    expect(getComputedStyle(placeholder).display).not.toBe('none');
    expect(getComputedStyle(surface).animationName).toBe('gd-skeleton-animation');
    element.remove();

    const withoutPlaceholder = document.createElement('gd-image');
    withoutPlaceholder.theme = defaultTheme;
    withoutPlaceholder.src = '/another-pending-image.png';
    document.body.append(withoutPlaceholder);
    await withoutPlaceholder.updateComplete;
    expect(getComputedStyle(withoutPlaceholder.shadowRoot!.querySelector('[part="placeholder"]')!).display).toBe(
      'none'
    );
    withoutPlaceholder.remove();
  });
});
