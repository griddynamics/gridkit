import { afterEach, describe, expect, it } from 'vitest';
import './gd-column';
import type { GdColumn } from './gd-column';

const mounted: HTMLElement[] = [];
afterEach(() => mounted.splice(0).forEach((element) => element.remove()));

async function column() {
  const element = document.createElement('gd-column') as GdColumn;
  element.append('Item 1', 'Item 2');
  document.body.append(element);
  mounted.push(element);
  await element.updateComplete;
  return { element, root: element.shadowRoot!.querySelector<HTMLElement>('[part="root"]')! };
}

describe('gd-column', () => {
  it('renders the React defaults as a dedicated component', async () => {
    const { element, root } = await column();
    const styles = getComputedStyle(root);
    expect(element.localName).toBe('gd-column');
    expect(root.localName).toBe('div');
    expect(styles.display).toBe('flex');
    expect(styles.flexDirection).toBe('column');
    expect(styles.flexWrap).toBe('wrap');
    expect(styles.alignItems).toBe('stretch');
    expect(styles.justifyContent).toBe('flex-start');
    expect(styles.gap).toBe('0px');
  });

  it('maps every Column-specific prop and Box style with React precedence', async () => {
    const { element } = await column();
    Object.assign(element, {
      gutter: 12,
      isReversed: true,
      isWrap: false,
      align: 'flex-end',
      justify: 'space-around',
      width: '300px',
      minHeight: '120px',
      paddingTop: '20px',
      flex: '1 1 auto',
      styles: { width: '320px' },
    });
    await element.updateComplete;
    const styles = getComputedStyle(element.shadowRoot!.querySelector<HTMLElement>('[part="root"]')!);
    expect(styles.flexDirection).toBe('column-reverse');
    expect(styles.flexWrap).toBe('nowrap');
    expect(styles.alignItems).toBe('flex-end');
    expect(styles.justifyContent).toBe('space-around');
    expect(styles.gap).toBe('12px');
    expect(styles.width).toBe('320px');
    expect(styles.minHeight).toBe('120px');
    expect(styles.paddingTop).toBe('20px');
    expect(styles.flex).toBe('1 1 auto');
  });

  it('uses the custom element as the public element and supports a semantic internal root', async () => {
    const { element } = await column();
    element.setAttribute('as', 'main');
    await element.updateComplete;
    expect(element.as).toBe('main');
    expect(element.shadowRoot!.querySelector('[part="root"]')?.localName).toBe('main');
    expect(element.shadowRoot!.querySelector('slot')?.assignedNodes().length).toBe(2);
  });
});
