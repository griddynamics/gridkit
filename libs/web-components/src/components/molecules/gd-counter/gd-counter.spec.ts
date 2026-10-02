import { beforeEach, describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-counter';

describe('gd-counter composition', () => {
  beforeEach(() => document.body.replaceChildren());

  it('reuses the migrated button, input, and catalog-backed icon components', async () => {
    const counter = document.createElement('gd-counter');
    counter.theme = defaultTheme;
    document.body.append(counter);
    await counter.updateComplete;

    expect(counter.shadowRoot!.querySelectorAll('gd-button')).toHaveLength(2);
    expect(counter.shadowRoot!.querySelector('gd-input')).not.toBeNull();
    expect([...counter.shadowRoot!.querySelectorAll('gd-icon')].map((icon) => icon.getAttribute('name'))).toEqual([
      'minus',
      'plus',
    ]);
  });
});
