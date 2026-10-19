import { describe, expect, it } from 'vitest';
import '../src';
import * as selectStories from '../stories/Select.stories';
import * as checkboxStories from '../stories/Checkbox.stories';
import * as switchStories from '../stories/Switch.stories';
import * as toggleStories from '../stories/Toggle.stories';
import type { GdCheckbox, GdSelect, GdSwitch, GdToggle } from '../src';

type Rendered = {
  render?: (args: Record<string, unknown>, context?: unknown) => HTMLElement;
  args?: Record<string, unknown>;
  play?: unknown;
};
type StoryModule = Record<string, unknown> & { default: Rendered & { args?: Record<string, unknown> } };

const mount = async (module: StoryModule, name: string, overrides: Record<string, unknown> = {}) => {
  const meta = module.default as unknown as {
    render: (args: Record<string, unknown>) => HTMLElement;
    args?: Record<string, unknown>;
  };
  const definition = module[name] as Rendered;
  const node = (definition.render ?? meta.render)({ ...(meta.args ?? {}), ...definition.args, ...overrides });
  document.body.replaceChildren(node);
  await Promise.all(
    [...document.body.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('*')].map(
      (el) => el.updateComplete
    )
  );
  return node;
};
const names = (module: Record<string, unknown>) => Object.keys(module).filter((key) => key !== 'default');
const texts = (node: ParentNode, selector: string) =>
  [...node.querySelectorAll(selector)].map((item) => item.textContent?.trim());
const nextTask = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('Select Storybook parity', () => {
  // Same names as libs/ui/src/components/atoms/Select/Select.stories.tsx.
  const storyNames = [
    'Default',
    'MultipleSelect',
    'WithAdornmentsAndResetOptionStory',
    'WithCustomInitiatorAndSelectedOutputValue',
    'UsingRefComponentWithCustomPlaceholder',
    'WithFileInputAndCustomDropdown',
    'CustomItemIdentifierComponent',
    'WithAccessibility',
    'Disabled',
    'EmptyItems',
    'ColorPrimary',
    'ColorSuccess',
    'ColorWarning',
    'ColorError',
    'Searchable',
    'DefaultTokens',
  ];
  const select = (node: ParentNode) => node.querySelector<GdSelect>('gd-select')!;
  const trigger = (el: GdSelect) => el.shadowRoot!.querySelector('.trigger')!;

  it('preserves the story inventory and gives every interactive story a play function', () => {
    expect(names(selectStories).sort()).toEqual([...storyNames].sort());
    const withPlay = [
      'Default',
      'MultipleSelect',
      'WithAdornmentsAndResetOptionStory',
      'WithCustomInitiatorAndSelectedOutputValue',
      'UsingRefComponentWithCustomPlaceholder',
      'WithFileInputAndCustomDropdown',
      'CustomItemIdentifierComponent',
      'Disabled',
      'EmptyItems',
    ];
    for (const name of withPlay) expect((selectStories as unknown as StoryModule)[name]).toHaveProperty('play');
  });

  it('wraps the default select in a flex container with a minimum width', async () => {
    const node = (await mount(selectStories, 'Default')) as HTMLElement;
    expect(node.localName).toBe('gd-flex-container');
    expect(node.getAttribute('min-width')).toBe('306px');
    expect(node.getAttribute('gap')).toBe('10px');
    const el = select(node);
    expect(el.items.map((item) => item.name)).toEqual(['Option 1', 'Option 2', 'Option 3']);
    expect(el.maxWidth).toBe('400px');
    expect(trigger(el).textContent).toContain('Select');
  });

  it('mirrors the multiple, searchable and color stories', async () => {
    const multiple = select(await mount(selectStories, 'MultipleSelect'));
    expect(multiple.multiple).toBe(true);
    expect(trigger(multiple).textContent).toContain('Select multiple options');
    expect(multiple.itemStringifier({ name: 'Option 2', value: { test: 'option2' } })).toBe(
      'Option 2 ({"test":"option2"})'
    );
    const searchable = select(await mount(selectStories, 'Searchable'));
    expect([searchable.searchable, searchable.searchPlaceholder, searchable.items.length]).toEqual([
      true,
      'Search fruits...',
      8,
    ]);
    for (const [name, color] of [
      ['ColorPrimary', 'primary'],
      ['ColorSuccess', 'success'],
      ['ColorWarning', 'warning'],
      ['ColorError', 'error'],
    ] as const) {
      const el = select(await mount(selectStories, name));
      expect(el.color).toBe(color);
      expect(trigger(el).textContent).toContain(`${color[0].toUpperCase()}${color.slice(1)} color select`);
    }
  });

  it('renders the disabled and empty stories with their explanatory text', async () => {
    const disabled = (await mount(selectStories, 'Disabled')) as HTMLElement;
    expect(select(disabled).disabled).toBe(true);
    expect(texts(disabled, ':scope > gd-typography')[0]).toBe(
      'This Select is disabled and cannot be interacted with. Click events and keyboard navigation are blocked.'
    );
    const empty = (await mount(selectStories, 'EmptyItems')) as HTMLElement;
    const el = select(empty);
    expect(el.items).toEqual([]);
    el.open();
    await nextTask();
    expect(el.querySelector('[slot="empty"]')!.textContent).toContain('No items available.');
    el.close();
    await nextTask();
    expect(el.querySelector('[slot="empty"]')).toBeNull();
  });

  it('keeps adornments and the custom initiator as named slots', async () => {
    const adornments = select(await mount(selectStories, 'WithAdornmentsAndResetOptionStory'));
    expect(adornments.querySelector('[slot="adornment-start"]')!.localName).toBe('gd-icon');
    expect(adornments.querySelector('[slot="adornment-end"]')!.textContent).toBe('(k)');
    expect(adornments.items[0]).toEqual({ name: 'Reset', value: null });
    const custom = select(await mount(selectStories, 'WithCustomInitiatorAndSelectedOutputValue'));
    expect(custom.querySelector('gd-input[slot="initiator"]')).not.toBeNull();
    expect(texts(custom, '[slot^="adornment"]')).toEqual(['€', '.00']);
  });

  it('shows the dropdown extras of the file input story only while the dropdown is open', async () => {
    const el = select(await mount(selectStories, 'WithFileInputAndCustomDropdown'));
    expect(el.querySelector('gd-input-file')).toBeNull();
    el.open();
    await nextTask();
    expect(el.querySelector('gd-input-file')).not.toBeNull();
    expect(el.items.map((item) => [item.name, item.disabled ?? false])).toEqual([
      ['Custom Opt 1', false],
      ['Disabled Option', true],
    ]);
  });

  it('uses the custom identifier to match selections in the identifier story', async () => {
    const node = (await mount(selectStories, 'CustomItemIdentifierComponent')) as HTMLElement;
    const el = select(node);
    expect(el.placeholder).toBe('Select an item');
    el.open();
    await el.updateComplete;
    el.shadowRoot!.querySelectorAll<HTMLElement>('[role="option"]')[0].click();
    await el.updateComplete;
    expect(el.selectedValue).toMatchObject({ name: 'Object 1' });
    expect(node.textContent).toContain('Selected value: ');
  });
});

describe('Checkbox Storybook parity', () => {
  // Same names as libs/ui/src/components/atoms/Checkbox/Checkbox.stories.tsx.
  it('preserves the story inventory', () => {
    expect(names(checkboxStories).sort()).toEqual(
      ['Default', 'Controlled', 'Indeterminate', 'Disabled', 'Sizes', 'DefaultTokens'].sort()
    );
    for (const name of ['Default', 'Controlled', 'Indeterminate', 'Disabled', 'Sizes'])
      expect((checkboxStories as unknown as StoryModule)[name]).toHaveProperty('play');
  });

  it('renders the labelled default, indeterminate and size stories', async () => {
    const def = (await mount(checkboxStories, 'Default')) as GdCheckbox;
    expect(def.textContent).toBe('Accept terms');
    const indeterminate = (await mount(checkboxStories, 'Indeterminate')) as GdCheckbox;
    expect([indeterminate.indeterminate, indeterminate.textContent]).toEqual([true, 'Select all']);
    const sizes = await mount(checkboxStories, 'Sizes');
    expect(sizes.localName).toBe('gd-row');
    expect(sizes.getAttribute('gap')).toBe('24px');
    expect([...sizes.querySelectorAll<GdCheckbox>('gd-checkbox')].map((item) => [item.size, item.textContent])).toEqual(
      [
        ['sm', 'Small checkbox'],
        ['md', 'Medium checkbox'],
      ]
    );
  });

  it('renders the three disabled states in a column', async () => {
    const node = await mount(checkboxStories, 'Disabled');
    expect(node.localName).toBe('gd-column');
    expect(
      [...node.querySelectorAll<GdCheckbox>('gd-checkbox')].map((item) => [
        item.textContent,
        item.disabled,
        item.checked ?? false,
        item.indeterminate,
      ])
    ).toEqual([
      ['Disabled unchecked', true, false, false],
      ['Disabled checked', true, true, false],
      ['Disabled indeterminate', true, false, true],
    ]);
  });

  it('keeps the controlled status text in sync with the checkbox', async () => {
    const node = await mount(checkboxStories, 'Controlled');
    const status = node.querySelector('gd-typography')!;
    const checkbox = node.querySelector<GdCheckbox>('gd-checkbox')!;
    expect(status.textContent).toBe('Current state: Unchecked');
    checkbox.shadowRoot!.querySelector('input')!.click();
    await checkbox.updateComplete;
    expect(status.textContent).toBe('Current state: Checked');
    expect(checkbox.checked).toBe(true);
  });
});

describe('Switch Storybook parity', () => {
  // Same names as libs/ui/src/components/atoms/Switch/Switch.stories.tsx.
  const storyNames = [
    'Default',
    'Checked',
    'Disabled',
    'LabelLeft',
    'Controlled',
    'Uncontrolled',
    'WithLoading',
    'WithAccessibility',
    'DefaultTokens',
  ];

  it('preserves the story inventory', () => {
    expect(names(switchStories).sort()).toEqual([...storyNames].sort());
    for (const name of ['Default', 'Checked', 'Disabled', 'Controlled', 'Uncontrolled', 'WithLoading'])
      expect((switchStories as unknown as StoryModule)[name]).toHaveProperty('play');
  });

  it('renders the default label and the label on the left', async () => {
    const def = (await mount(switchStories, 'Default')) as GdSwitch;
    expect([def.textContent, def.name, def.label]).toEqual(['Label', 'switch', 'right']);
    const left = (await mount(switchStories, 'LabelLeft')) as GdSwitch;
    expect([left.textContent, left.label]).toEqual(['Label on the left', 'left']);
  });

  it('keeps a defined checked value controlled in the checked story', async () => {
    const el = (await mount(switchStories, 'Checked')) as GdSwitch;
    expect(el.checked).toBe(true);
    el.shadowRoot!.querySelector('input')!.click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
  });

  it('shows the status lines of the controlled, uncontrolled and loading stories', async () => {
    const controlled = await mount(switchStories, 'Controlled');
    expect(texts(controlled, 'gd-typography')).toEqual(['Current state: OFF']);
    expect(controlled.querySelector('gd-switch')!.textContent).toBe('Controlled Switch, with 1.5 seconds delay');
    const uncontrolled = await mount(switchStories, 'Uncontrolled');
    expect(texts(uncontrolled, 'gd-typography')).toEqual([
      'Uncontrolled Switch - state is managed internally. Check the Actions panel to see onChange events.',
    ]);
    const loading = await mount(switchStories, 'WithLoading');
    expect(texts(loading, 'gd-typography')).toEqual(['Current state: OFF', 'Loading: No']);
    expect(loading.querySelector('gd-switch')!.textContent).toBe('Switch with Loading State (3 seconds)');
  });

  it('enters the loading state when toggled and restores the previous value meanwhile', async () => {
    const node = await mount(switchStories, 'WithLoading');
    const el = node.querySelector<GdSwitch>('gd-switch')!;
    el.shadowRoot!.querySelector('input')!.click();
    await el.updateComplete;
    expect(el.isLoading).toBe(true);
    expect(el.checked).toBe(false);
    expect(texts(node, 'gd-typography')[1]).toBe('Loading: Yes (3 seconds)');
  });
});

describe('Toggle Storybook parity', () => {
  // Same names as libs/ui/src/components/atoms/Toggle/Toggle.stories.tsx.
  it('preserves the story inventory', () => {
    expect(names(toggleStories).sort()).toEqual(
      ['Default', 'Disabled', 'WithCustomRender', 'WithAccessibility', 'DefaultTokens'].sort()
    );
    for (const name of ['Default', 'Disabled', 'WithCustomRender'])
      expect((toggleStories as unknown as StoryModule)[name]).toHaveProperty('play');
  });

  it('renders the default and disabled option groups', async () => {
    const def = (await mount(toggleStories, 'Default')) as GdToggle;
    expect(def.items).toEqual(['Option 1', 'Option 2', 'Option 3']);
    expect([def.value, def.disabled]).toEqual(['Option 1', false]);
    const disabled = (await mount(toggleStories, 'Disabled')) as GdToggle;
    expect(disabled.disabled).toBe(true);
  });

  it('renders icons for object items in the custom render story', async () => {
    const el = (await mount(toggleStories, 'WithCustomRender')) as GdToggle;
    expect(el.items).toEqual([
      { label: 'Fire', value: 'home' },
      { label: 'Water', value: 'accountCircle' },
      { label: 'Earth', value: 'success' },
    ]);
    const icons = [...el.shadowRoot!.querySelectorAll<HTMLElement>('gd-icon')];
    expect(icons.map((icon) => icon.getAttribute('name'))).toEqual(['home', 'accountCircle', 'success']);
  });

  it('wraps the accessibility story in a labelled group', async () => {
    const definition = (
      toggleStories as unknown as Record<string, { decorators?: Array<(story: () => HTMLElement) => HTMLElement> }>
    ).WithAccessibility;
    const wrapped = definition.decorators![0](() => document.createElement('gd-toggle'));
    expect(wrapped.querySelector('label')!.textContent).toBe('Select an option:');
    expect(wrapped.querySelector('#toggle-group')!.getAttribute('role')).toBe('group');
    expect(wrapped.querySelector('#toggle-group')!.getAttribute('aria-label')).toBe('Toggle options');
  });
});
