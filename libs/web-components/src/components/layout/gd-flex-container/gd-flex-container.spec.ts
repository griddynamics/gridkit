import { afterEach, describe, expect, it } from 'vitest';
import './gd-flex-container';
import type { GdFlexContainer } from './gd-flex-container';

const mounted: HTMLElement[] = [];
afterEach(() => mounted.splice(0).forEach((element) => element.remove()));

async function flexContainer() {
  const element = document.createElement('gd-flex-container') as GdFlexContainer;
  element.append('First', 'Second');
  document.body.append(element);
  mounted.push(element);
  await element.updateComplete;
  return { element, root: element.shadowRoot!.querySelector<HTMLElement>('[part="root"]')! };
}

describe('gd-flex-container', () => {
  it('renders the React FlexContainer defaults', async () => {
    const { element, root } = await flexContainer();
    const styles = getComputedStyle(root);
    expect(element.localName).toBe('gd-flex-container');
    expect(root.localName).toBe('div');
    expect(styles.display).toBe('flex');
    expect(styles.width).toBe(`${document.body.clientWidth}px`);
    expect(styles.marginLeft).toBe('0px');
    expect(styles.marginRight).toBe('0px');
    expect(styles.flexDirection).toBe('column');
  });

  it('supports the complete Box prop surface and styles override', async () => {
    const { element } = await flexContainer();
    Object.assign(element, {
      gap: '8px',
      minWidth: '420px',
      padding: '10px',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      styles: { backgroundColor: 'rgb(243, 244, 246)' },
    });
    await element.updateComplete;
    const styles = getComputedStyle(element.shadowRoot!.querySelector<HTMLElement>('[part="root"]')!);
    expect(styles.gap).toBe('8px');
    expect(styles.minWidth).toBe('420px');
    expect(styles.padding).toBe('10px');
    expect(styles.flexDirection).toBe('row');
    expect(styles.justifyContent).toBe('flex-start');
    expect(styles.backgroundColor).toBe('rgb(243, 244, 246)');
  });
});
