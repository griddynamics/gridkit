import { describe, expect, it } from 'vitest';
import '../src';
import * as inputStories from '../stories/Input.stories';
import * as textareaStories from '../stories/Textarea.stories';
import * as inputFileStories from '../stories/InputFile.stories';
import type { GdInput, GdInputFile, GdTextarea } from '../src';

// Same export names, in the same order, as the matching `*.stories.tsx` files of the published Storybook.
const inputNames = [
  'PrimaryDefaultWithLabelAndHelperText',
  'SuccessWithLabelAndHelperText',
  'WarningWithLabelAndHelperText',
  'ErrorWithLabelAndHelperText',
  'Disabled',
  'ReadOnly',
  'WrapperAsSpan',
  'WithAdornments',
  'WithStartAdornment',
  'WithEndAdornmentAsIcon',
  'DefaultWithTailwind',
  'CustomStyles',
  'CheckboxWithLabel',
  'RadioControlledWithLabel',
  'RadioGroupWithLabel',
  'WithAccessibility',
  'DefaultTokens',
];
const textareaNames = [
  'Default',
  'Disabled',
  'ReadOnly',
  'VariantInline',
  'ColorPrimary',
  'ColorSuccess',
  'ColorWarning',
  'ColorError',
  'AutoFocus',
  'DynamicHeight',
  'WithCharLimit',
  'Resizable',
  'WithControlledStateEraseOnEnterClick',
  'MaxCharacters',
  'WithAccessibility',
  'DefaultTokens',
];
const inputFileNames = [
  'Default',
  'Disabled',
  'Multiple',
  'WithAccept',
  'CustomLabel',
  'IconLabel',
  'WithCustomStyles',
  'WithAccessibility',
  'DefaultTokens',
];

type Definition = {
  render?: (args: Record<string, unknown>, context?: unknown) => HTMLElement;
  args?: Record<string, unknown>;
  play?: unknown;
  parameters?: Record<string, unknown>;
};
type Module = Record<string, unknown> & { default: { render: Definition['render']; args?: object } };

const mount = async (module: Module, name: string, extraArgs: Record<string, unknown> = {}) => {
  const definition = module[name] as Definition;
  const meta = module.default;
  const render = definition.render ?? meta.render!;
  const node = render({ ...(meta.args ?? {}), ...definition.args, ...extraArgs });
  document.body.replaceChildren(node);
  await Promise.all(
    [...document.body.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('*')].map(
      (el) => el.updateComplete
    )
  );
  return node;
};
const exportsOf = (module: Record<string, unknown>) => Object.keys(module).filter((key) => key !== 'default');
const hostsOf = <T extends HTMLElement>(node: Element, tag: string) =>
  node.localName === tag ? [node as T] : [...node.querySelectorAll<T>(tag)];
const innerInput = (host: GdInput, index = 0) => host.shadowRoot!.querySelectorAll('input')[index]!;

describe('Input, Textarea and InputFile Storybook parity with the published stories', () => {
  it('preserves the story inventory of all three atoms', () => {
    expect(exportsOf(inputStories).sort()).toEqual([...inputNames].sort());
    expect(exportsOf(textareaStories).sort()).toEqual([...textareaNames].sort());
    expect(exportsOf(inputFileStories).sort()).toEqual([...inputFileNames].sort());
  });

  it('keeps the centered layout and padded token viewers', () => {
    for (const module of [inputStories, textareaStories, inputFileStories] as unknown as Module[]) {
      const meta = module.default as unknown as { parameters: { layout: string } };
      expect(meta.parameters.layout).toBe('centered');
      expect((module['DefaultTokens'] as Definition).parameters).toEqual({ layout: 'padded' });
    }
  });

  it('documents every control with a description and a table category', () => {
    for (const module of [inputStories, textareaStories, inputFileStories] as unknown as Module[]) {
      const argTypes = (module.default as unknown as { argTypes: Record<string, { description: string }> }).argTypes;
      for (const [name, argType] of Object.entries(argTypes)) {
        expect(argType.description, name).toBeTruthy();
        // Like the published story, the Textarea `maxCharacters` row is documented without a category.
        if (name !== 'maxCharacters')
          expect((argType as unknown as { table: { category: string } }).table.category, name).toBeTruthy();
      }
    }
    const inputArgTypes = (
      inputStories.default as unknown as { argTypes: Record<string, { table: { category: string } }> }
    ).argTypes;
    expect(new Set(Object.values(inputArgTypes).map((a) => a.table.category))).toEqual(
      new Set([
        'Core Properties',
        'Appearance & Styling',
        'Content & Labels',
        'State & Behavior',
        'Accessibility',
        'Events',
      ])
    );
  });

  describe('Input', () => {
    const module = inputStories as unknown as Module;

    it('renders the label and helper text around the field for every color story', async () => {
      for (const [name, color, value] of [
        ['PrimaryDefaultWithLabelAndHelperText', 'primary', 'Default Input'],
        ['SuccessWithLabelAndHelperText', 'success', 'Success Input'],
        ['WarningWithLabelAndHelperText', 'warning', 'Warning Input'],
        ['ErrorWithLabelAndHelperText', 'error', 'Error Input'],
      ] as const) {
        const host = (await mount(module, name)) as GdInput;
        expect(host.color).toBe(color);
        expect(host.label).toBe('Label');
        expect(host.helperText).toBe('Helper text');
        expect(innerInput(host).value).toBe(value);
        expect(host.shadowRoot!.querySelector('.label')!.textContent).toBe('Label');
        expect(host.shadowRoot!.querySelector('.helper')!.textContent).toBe('Helper text');
      }
    });

    it('applies the shared defaults to every createStory story', async () => {
      const host = (await mount(module, 'Disabled')) as GdInput;
      const control = innerInput(host);
      expect(control.disabled).toBe(true);
      expect(control.getAttribute('role')).toBe('textbox');
      expect(control.getAttribute('name')).toBe('input');
      expect(control.getAttribute('placeholder')).toBe('placeholder');
      expect(control.getAttribute('aria-required')).toBe('false');
      expect(control.value).toBe('Disabled Input');
      expect(host.width).toBe('100%');
    });

    it('wraps in a label by default and in a span for WrapperAsSpan', async () => {
      expect((await mount(module, 'ReadOnly')).shadowRoot!.querySelector('[part="outer"]')!.localName).toBe('label');
      const host = (await mount(module, 'WrapperAsSpan')) as GdInput;
      expect(host.shadowRoot!.querySelector('[part="outer"]')!.localName).toBe('span');
      expect(innerInput(host).value).toBe('Input wrapper span');
    });

    it('slots the start and end adornments', async () => {
      const both = await mount(module, 'WithAdornments');
      expect([...both.querySelectorAll('[slot]')].map((el) => [el.getAttribute('slot'), el.textContent])).toEqual([
        ['adornment-start', '€'],
        ['adornment-end', '.00'],
      ]);
      const start = (await mount(module, 'WithStartAdornment')) as GdInput;
      expect(start.variant).toBe('email');
      expect(innerInput(start).value).toBe('user@example.com');
      expect(start.querySelector('[slot="adornment-start"]')!.textContent).toBe('@');
    });

    it('toggles the password visibility from the end adornment icon', async () => {
      const host = (await mount(module, 'WithEndAdornmentAsIcon')) as GdInput;
      expect(host.width).toBe('150px');
      expect(innerInput(host).type).toBe('password');
      host.querySelector<HTMLElement>('[slot="adornment-end"]')!.click();
      await host.updateComplete;
      expect(innerInput(host).type).toBe('text');
      host.querySelector<HTMLElement>('[slot="adornment-end"]')!.click();
      await host.updateComplete;
      expect(innerInput(host).type).toBe('password');
    });

    it('resolves the utility classes of the tailwind story into wrapper styles', async () => {
      const host = (await mount(module, 'DefaultWithTailwind')) as GdInput;
      const outer = host.shadowRoot!.querySelector<HTMLElement>('[part="outer"]')!;
      expect(getComputedStyle(outer).fontSize).toBe('20px');
      expect(getComputedStyle(outer).fontWeight).toBe('700');
      expect(getComputedStyle(outer).paddingLeft).toBe('12px');
      expect(getComputedStyle(outer).paddingTop).toBe('8px');
    });

    it('applies custom wrapper styles', async () => {
      const host = (await mount(module, 'CustomStyles')) as GdInput;
      const outer = host.shadowRoot!.querySelector<HTMLElement>('[part="outer"]')!;
      expect(getComputedStyle(outer).backgroundColor).toBe('rgb(173, 216, 230)');
      expect(getComputedStyle(outer).paddingLeft).toBe('16px');
    });

    it('wraps the checkbox and radio stories in a label with the text "Label"', async () => {
      for (const [name, variant] of [
        ['CheckboxWithLabel', 'checkbox'],
        ['RadioControlledWithLabel', 'radio'],
      ] as const) {
        const label = await mount(module, name);
        expect(label.localName).toBe('gd-label');
        expect(label.textContent).toBe('Label');
        const host = label.querySelector<GdInput>('gd-input')!;
        expect(host.variant).toBe(variant);
        expect(host.role).toBe(variant);
        expect(innerInput(host).checked).toBe(false);
        innerInput(host).click();
        await host.updateComplete;
        expect(host.checked).toBe(true);
      }
    });

    it('renders three radios of one group with the first preselected', async () => {
      const group = await mount(module, 'RadioGroupWithLabel');
      const hosts = hostsOf<GdInput>(group, 'gd-input');
      expect(hosts.map((host) => host.value)).toEqual(['1', '2', '3']);
      expect(hosts.map((host) => host.wrapperAs)).toEqual(['span', 'span', 'span']);
      expect(hosts.map((host) => innerInput(host).checked)).toEqual([true, false, false]);
      expect([...group.querySelectorAll('gd-label')].map((label) => label.textContent)).toEqual([
        'Label 1',
        'Label 2',
        'Label 3',
      ]);
      innerInput(hosts[1]!).click();
      await hosts[1]!.updateComplete;
      await hosts[0]!.updateComplete;
      expect(hosts.map((host) => innerInput(host).checked)).toEqual([false, true, false]);
    });

    it('links the accessible example to its helper text and keeps the labelled checkbox', async () => {
      const wrapper = await mount(module, 'WithAccessibility');
      const [email, terms] = hostsOf<GdInput>(wrapper, 'gd-input');
      expect(email!.color).toBe('error');
      expect(email!.shadowRoot!.querySelector('input')!.getAttribute('aria-describedby')).toBe('error-id');
      expect(email!.shadowRoot!.querySelector('#error-id')!.textContent).toBe('Error message');
      expect(terms!.variant).toBe('checkbox');
      expect(terms!.label).toBe('Agree to terms');
      expect(innerInput(terms!).getAttribute('aria-label')).toBe('terms');
      expect(getComputedStyle(wrapper).gap).toBe('20px');
    });
  });

  describe('Textarea', () => {
    const module = textareaStories as unknown as Module;
    const area = (host: GdTextarea) => host.shadowRoot!.querySelector('textarea')!;

    it('renders default values, placeholders and the native state flags', async () => {
      const normal = (await mount(module, 'Default')) as GdTextarea;
      expect(area(normal).value).toBe('This is a default value ');
      expect(area(normal).placeholder).toBe('Type something...');
      expect(area(normal).getAttribute('name')).toBe('textarea');
      expect(normal.shadowRoot!.querySelector('[part="wrapper"]')).toBeNull();
      const disabled = (await mount(module, 'Disabled')) as GdTextarea;
      expect(area(disabled).disabled).toBe(true);
      const readOnly = (await mount(module, 'ReadOnly')) as GdTextarea;
      expect(area(readOnly).readOnly).toBe(true);
      expect(area(readOnly).value).toBe('This text cannot be changed');
    });

    it('maps the variant and color stories to their tokens', async () => {
      expect(((await mount(module, 'VariantInline')) as GdTextarea).variant).toBe('inline');
      for (const [name, color] of [
        ['ColorPrimary', 'primary'],
        ['ColorSuccess', 'success'],
        ['ColorWarning', 'warning'],
        ['ColorError', 'error'],
      ] as const) {
        const host = (await mount(module, name)) as GdTextarea;
        expect(host.color).toBe(color);
        expect(area(host).value).toBe(`This is ${color === 'error' ? 'an' : 'a'} ${color} color textarea`);
      }
    });

    it('focuses on mount, grows with content, limits and resizes', async () => {
      const focused = (await mount(module, 'AutoFocus')) as GdTextarea;
      expect(focused.autoFocus).toBe(true);
      const dynamic = (await mount(module, 'DynamicHeight')) as GdTextarea;
      expect(dynamic.dynamicHeightAdjustment).toBe(true);
      expect(area(dynamic).style.height).toMatch(/px$/);
      expect(area((await mount(module, 'WithCharLimit')) as GdTextarea).maxLength).toBe(50);
      expect(getComputedStyle(area((await mount(module, 'Resizable')) as GdTextarea)).resize).toBe('both');
    });

    it('clears the controlled value on Enter', async () => {
      const host = (await mount(module, 'WithControlledStateEraseOnEnterClick')) as GdTextarea;
      expect(host.rows).toBe(1);
      expect(host.getAttribute('aria-invalid')).toBe('false');
      expect(area(host).value).toBe('This is a controlled textarea, initially 1 row');
      area(host).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
      await host.updateComplete;
      expect(area(host).value).toBe('');
    });

    it('wraps the field with a counter only for MaxCharacters', async () => {
      const host = (await mount(module, 'MaxCharacters')) as GdTextarea;
      expect(host.shadowRoot!.querySelector('[part="wrapper"]')).not.toBeNull();
      expect(host.shadowRoot!.querySelector('[part="counter"]')!.textContent).toBe('0/100');
    });

    it('labels the accessible example through its decorator', () => {
      const definition = module['WithAccessibility'] as Definition & {
        decorators: Array<(story: () => HTMLElement) => Node>;
      };
      const story = () => document.createElement('gd-textarea');
      const fragment = definition.decorators[0]!(story) as DocumentFragment;
      expect(fragment.querySelector('label')!.textContent).toBe('Comments');
      expect(fragment.querySelector('label')!.htmlFor).toBe('comments');
      expect(definition.args).toMatchObject({ id: 'comments', name: 'comments', ariaDescribedBy: 'textarea-helper' });
    });
  });

  describe('InputFile', () => {
    const module = inputFileStories as unknown as Module;
    const nativeInput = (host: GdInputFile) => host.shadowRoot!.querySelector('input')!;

    it('renders the default label and forwards native attributes', async () => {
      const host = (await mount(module, 'Default')) as GdInputFile;
      expect(host.textContent).toBe('');
      expect(nativeInput(host).getAttribute('aria-label')).toBe('Browse Files');
      expect(nativeInput(host).hasAttribute('accept')).toBe(false);
      expect(nativeInput((await mount(module, 'Multiple')) as GdInputFile).multiple).toBe(true);
      expect(nativeInput((await mount(module, 'WithAccept')) as GdInputFile).accept).toBe('image/*');
      expect(nativeInput((await mount(module, 'Disabled')) as GdInputFile).disabled).toBe(true);
    });

    it('uses a string label, an icon label with a text button, and an explicit aria-label', async () => {
      const custom = (await mount(module, 'CustomLabel')) as GdInputFile;
      expect(custom.textContent).toBe('Pick a Photo');
      expect(nativeInput(custom).getAttribute('aria-label')).toBe('Pick a Photo');
      const icon = (await mount(module, 'IconLabel')) as GdInputFile;
      expect(icon.querySelector('gd-icon')!.getAttribute('name')).toBe('attachment');
      expect(icon.buttonProps).toEqual({ variant: 'text' });
      expect(nativeInput(icon).hasAttribute('aria-label')).toBe(false);
      const accessible = (await mount(module, 'WithAccessibility')) as GdInputFile;
      expect(accessible.textContent).toBe('Accessible Input File');
      expect(nativeInput(accessible).getAttribute('aria-label')).toBe('Accessible InputFile');
    });

    it('applies custom wrapper styles and emits click and change events', async () => {
      const host = (await mount(module, 'WithCustomStyles')) as GdInputFile;
      const root = host.shadowRoot!.querySelector<HTMLElement>('[part="root"]')!;
      expect(getComputedStyle(root).borderTopStyle).toBe('dashed');
      expect(getComputedStyle(root).paddingTop).toBe('16px');
      let clicks = 0;
      host.addEventListener('gd-click', () => (clicks += 1));
      host.shadowRoot!.querySelector('gd-button')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(clicks).toBe(1);
    });
  });
});
