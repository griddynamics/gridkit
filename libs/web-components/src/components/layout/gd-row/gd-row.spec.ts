import { afterEach, describe, expect, it } from 'vitest';
import './gd-row';
import type { GdRow } from './gd-row';

const mounted: HTMLElement[] = [];
afterEach(() => mounted.splice(0).forEach((element) => element.remove()));

async function row() {
  const element = document.createElement('gd-row') as GdRow;
  element.append('Item 1', 'Item 2');
  document.body.append(element);
  mounted.push(element);
  await element.updateComplete;
  return { element, root: element.shadowRoot!.querySelector<HTMLElement>('[part="root"]')! };
}

describe('gd-row', () => {
  it('renders the React defaults as a dedicated component', async () => {
    const { element, root } = await row();
    const styles = getComputedStyle(root);
    expect(element.localName).toBe('gd-row');
    expect(root.localName).toBe('div');
    expect(styles.display).toBe('flex');
    expect(styles.flexDirection).toBe('row');
    expect(styles.flexWrap).toBe('wrap');
    expect(styles.alignItems).toBe('stretch');
    expect(styles.justifyContent).toBe('flex-start');
  });

  it('maps aliases, reversal, wrapping, gutter, and Box props', async () => {
    const { element } = await row();
    Object.assign(element, {
      gutter: '1rem',
      isReversed: true,
      isWrap: false,
      align: 'center',
      justify: 'space-between',
      display: 'inline-flex',
      width: '300px',
      height: '100px',
      paddingBottom: '20px',
    });
    await element.updateComplete;
    const styles = getComputedStyle(element.shadowRoot!.querySelector<HTMLElement>('[part="root"]')!);
    expect(styles.display).toBe('inline-flex');
    expect(styles.flexDirection).toBe('row-reverse');
    expect(styles.flexWrap).toBe('nowrap');
    expect(styles.alignItems).toBe('center');
    expect(styles.justifyContent).toBe('space-between');
    expect(styles.gap).toBe('16px');
    expect(styles.width).toBe('300px');
    expect(styles.height).toBe('100px');
    expect(styles.paddingBottom).toBe('20px');
  });

  it('uses the custom element as the public element and supports a semantic internal root', async () => {
    const { element } = await row();
    element.setAttribute('as', 'nav');
    await element.updateComplete;
    expect(element.as).toBe('nav');
    expect(element.shadowRoot!.querySelector('[part="root"]')?.localName).toBe('nav');
  });
});
