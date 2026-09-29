import { describe, expect, it } from 'vitest';
import '../src/index';
import { element, items, storySource } from '../stories/helpers';

function source(...nodes: HTMLElement[]) {
  const canvas = document.createElement('main');
  canvas.append(...nodes);
  return storySource(canvas, 'fallback');
}

describe('Storybook custom-element source', () => {
  it('shows the effective properties for each Button state without Lit internals', () => {
    const secondary = source(element('gd-button', { variant: 'secondary' }, 'Button'));
    const disabled = source(element('gd-button', { variant: 'primary', disabled: true }, 'Button'));

    expect(secondary).toContain('<gd-button variant="secondary" rounded="none">Button</gd-button>');
    expect(disabled).toMatch(/<gd-button[^>]*variant="primary"[^>]*disabled[^>]*>Button<\/gd-button>/);
    expect(secondary).toContain('component.theme = defaultTheme;');
    expect(secondary).toContain("import 'web-components';");
    expect(secondary).not.toContain('_hasContent');
  });

  it('uses JavaScript properties and native events for non-attribute Select inputs', () => {
    const select = element('gd-select', { items, value: items[1], multiple: true });
    const generated = source(select);

    expect(generated).toContain('component.items = [');
    expect(generated).toContain('component.value = {');
    expect(generated).toContain("component.addEventListener('gd-change'");
  });

  it('keeps named slots in the consumer markup', () => {
    const button = element('gd-button', { variant: 'outlined' }, 'Continue');
    const icon = document.createElement('span');
    icon.slot = 'icon-start';
    icon.textContent = '→';
    button.prepend(icon);

    expect(source(button)).toContain('<span slot="icon-start">→</span>Continue');
  });
});
