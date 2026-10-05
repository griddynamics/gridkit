import { afterEach, describe, expect, it } from 'vitest';
import '../src/index';
import { demo, renderDemo } from '../stories/native-story';

const mounted: Node[] = [];
afterEach(() => mounted.splice(0).forEach((node) => node.parentNode?.removeChild(node)));
function mount(recipe: unknown) {
  const node = renderDemo(recipe) as HTMLElement;
  document.body.append(node);
  mounted.push(node);
  return node;
}

describe('native story fixtures', () => {
  it('creates independent native controls and retains nested slots and layout', async () => {
    const recipe = demo(
      'Row',
      { gap: '24px' },
      demo('gd-button', { variant: 'outlined', iconStart: demo('gd-icon', { name: 'check' }) }, 'Continue')
    );
    const first = mount(recipe);
    const second = mount(recipe);
    expect(first.style.gap).toBe('24px');
    const button = first.querySelector('gd-button')!;
    await button.updateComplete;
    expect(button.variant).toBe('outlined');
    expect(button.querySelector('[slot="icon-start"]')?.localName).toBe('gd-icon');
    expect(button.theme).toBeTruthy();
    button.remove();
    expect(second.querySelector('gd-button')?.textContent).toBe('Continue');
  });

  it('forwards changed args and native change details to the source callback', async () => {
    const changes: unknown[] = [];
    const control = mount(
      demo(
        'gd-checkbox',
        { checked: true, disabled: false, onValueChange: (value: unknown) => changes.push(value) },
        'Accept'
      )
    ) as HTMLElementTagNameMap['gd-checkbox'];
    await control.updateComplete;
    expect(control.shadowRoot?.querySelector('input')?.checked).toBe(true);
    control.dispatchEvent(new CustomEvent('gd-change', { detail: { checked: false } }));
    expect(changes).toEqual([false]);
  });

  it('does not mask fallback slot content with empty children', async () => {
    const file = mount(
      demo('gd-input-file', { buttonProps: { variant: 'secondary' } })
    ) as HTMLElementTagNameMap['gd-input-file'];
    await file.updateComplete;
    expect(file.childNodes.length).toBe(0);
    expect(file.buttonVariant).toBe('secondary');
  });
});
