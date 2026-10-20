import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../src';
import * as counterStories from '../stories/Counter.stories';
import * as menuStories from '../stories/Menu.stories';
import * as sliderDotsStories from '../stories/SliderDots.stories';
import * as sliderStories from '../stories/Slider.stories';
import type { GdColumn, GdCounter, GdMenu, GdSlider, GdSliderDots, GdTypography } from '../src';

// Same names as the stories under libs/ui/src/components/{atoms,molecules}/{Slider,SliderDots,Counter,Menu}.
const inventories = {
  Slider: [
    sliderStories,
    ['Default', 'WithInitialValue', 'Disabled', 'CustomStyles', 'Controlled', 'WithAccessibility', 'DefaultTokens'],
  ],
  SliderDots: [sliderDotsStories, ['Default', 'Interactive', 'ManyDots', 'DefaultTokens']],
  Counter: [
    counterStories,
    [
      'Default',
      'AdjustedMaxValue5',
      'AdjustedMinValue3',
      'AdjustedMin2MaxValue10',
      'WithExternalCounterChangeHandler',
      'Disabled',
      'DefaultTokens',
    ],
  ],
  Menu: [
    menuStories,
    [
      'Default',
      'CloseOnSelectFalse',
      'Placement',
      'WithRefControl',
      'WithOffset',
      'WithHeightConstraints',
      'WithPositioningOptions',
      'WithEditAndDeleteModals',
      'DefaultTokens',
    ],
  ],
} as const;

type Rendered = {
  render?: (args: Record<string, unknown>, context?: unknown) => HTMLElement;
  args?: Record<string, unknown>;
  parameters?: { layout?: string; docs?: { description?: { story?: string }; disable?: boolean } };
  play?: unknown;
};
type Module = Record<string, unknown> & { default: { render: Rendered['render']; args?: object; parameters?: object } };

const mount = async (module: Module, name: string) => {
  const definition = module[name] as Rendered;
  const meta = module.default;
  const render = definition.render ?? meta.render!;
  const node = render({ ...(meta.args ?? {}), ...(definition.args ?? {}) });
  document.body.replaceChildren(node);
  await settle();
  return node;
};
const settle = async () => {
  await Promise.all(
    [...document.body.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('*')].map(
      (el) => el.updateComplete
    )
  );
};
const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

afterEach(() => document.body.replaceChildren());

describe('Slider, SliderDots, Counter and Menu Storybook parity', () => {
  it.each(Object.entries(inventories))('preserves the %s story inventory', (_name, [module, names]) => {
    expect(Object.keys(module).filter((key) => key !== 'default')).toEqual([...names].sort());
  });

  it.each([
    ['Slider', sliderStories, { Default: 'centered', DefaultTokens: 'padded' }],
    ['SliderDots', sliderDotsStories, { Default: 'centered', DefaultTokens: 'padded' }],
    ['Counter', counterStories, { Default: 'centered', DefaultTokens: 'padded' }],
    ['Menu', menuStories, { Default: 'centered', DefaultTokens: 'padded' }],
  ] as const)('mirrors the %s layout parameters', (_name, module, expected) => {
    const meta = (module as unknown as Module).default as { parameters?: { layout?: string } };
    expect(meta.parameters?.layout).toBe('centered');
    expect((module.DefaultTokens as Rendered).parameters?.layout).toBe(expected.DefaultTokens);
  });

  describe('Slider', () => {
    it('renders every story with the shared labelled range', async () => {
      for (const [name, value] of [
        ['Default', 1],
        ['WithInitialValue', 50],
        ['Disabled', 30],
        ['CustomStyles', 70],
      ] as const) {
        const slider = (await mount(sliderStories as unknown as Module, name)) as GdSlider;
        expect([slider.min, slider.max, slider.value]).toEqual([1, 100, value]);
        expect(slider.getAttribute('aria-label')).toBe('Select value');
      }
      expect(((await mount(sliderStories as unknown as Module, 'Disabled')) as GdSlider).disabled).toBe(true);
      expect(
        ((await mount(sliderStories as unknown as Module, 'WithAccessibility')) as GdSlider).getAttribute('aria-label')
      ).toBe('Select volume level');
    });

    it('keeps the controlled story in step with every reported value', async () => {
      const slider = (await mount(sliderStories as unknown as Module, 'Controlled')) as GdSlider;
      expect(slider.value).toBe(25);
      slider.shadowRoot!.querySelector('input')!.value = '40';
      slider.shadowRoot!.querySelector('input')!.dispatchEvent(new Event('input', { bubbles: true }));
      await settle();
      expect(slider.value).toBe(40);
      expect(slider.shadowRoot!.querySelector('input')!.getAttribute('aria-valuenow')).toBe('40');
    });

    it('adds the story play functions of the source stories', () => {
      for (const name of ['Default', 'WithInitialValue', 'Disabled', 'CustomStyles', 'Controlled']) {
        expect(typeof (sliderStories[name as keyof typeof sliderStories] as Rendered).play).toBe('function');
      }
    });
  });

  describe('SliderDots', () => {
    it('leaves the active dot to the arguments in the default stories', async () => {
      const dots = (await mount(sliderDotsStories as unknown as Module, 'Default')) as GdSliderDots;
      expect([dots.count, dots.activeIndex]).toEqual([5, 0]);
      dots.shadowRoot!.querySelectorAll<HTMLElement>('[role="tab"]')[2].click();
      await settle();
      expect(dots.activeIndex).toBe(0);
      const many = (await mount(sliderDotsStories as unknown as Module, 'ManyDots')) as GdSliderDots;
      expect([many.count, many.activeIndex]).toEqual([10, 4]);
    });

    it('updates the active slide text from the clicked dot in the interactive story', async () => {
      const column = (await mount(sliderDotsStories as unknown as Module, 'Interactive')) as GdColumn;
      const label = column.querySelector<GdTypography>('gd-typography')!;
      const dots = column.querySelector<GdSliderDots>('gd-slider-dots')!;
      expect([column.gap, column.align]).toEqual(['16px', 'center']);
      expect(label.textContent).toBe('Active slide: 1 of 5');
      dots.shadowRoot!.querySelectorAll<HTMLElement>('[role="tab"]')[3].click();
      await settle();
      expect(dots.activeIndex).toBe(3);
      expect(label.textContent).toBe('Active slide: 4 of 5');
    });
  });

  describe('Counter', () => {
    it('renders the source argument sets', async () => {
      const read = async (name: string) => {
        const counter = (await mount(counterStories as unknown as Module, name)) as GdCounter;
        return [counter.min, counter.max, counter.initial, counter.isDisabled];
      };
      expect(await read('Default')).toEqual([1, Infinity, 1, false]);
      expect(await read('AdjustedMaxValue5')).toEqual([1, 5, 1, false]);
      expect(await read('AdjustedMinValue3')).toEqual([3, Infinity, 3, false]);
      expect(await read('AdjustedMin2MaxValue10')).toEqual([2, 10, 2, false]);
      expect(await read('WithExternalCounterChangeHandler')).toEqual([1, Infinity, 3, false]);
      expect(await read('Disabled')).toEqual([1, Infinity, 5, true]);
    });

    it('restores the committed value when the input is emptied and blurred', async () => {
      const counter = (await mount(counterStories as unknown as Module, 'Default')) as GdCounter;
      const input = counter.shadowRoot!.querySelector('gd-input')!.shadowRoot!.querySelector('input')!;
      input.focus();
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      input.blur();
      await settle();
      await frame();
      expect(input.value).toBe('1');
    });
  });

  describe('Menu', () => {
    const triggerOf = (menu: GdMenu) => menu.querySelector('[slot="trigger"]')!;
    const itemsOf = (menu: GdMenu) =>
      [...menu.querySelectorAll<HTMLElement>('[data-testid="DropdownItem"]')].map((item) => item.textContent);

    it('renders the trigger text and options of every menu story', async () => {
      const expected: Record<string, [string, string[]]> = {
        Default: ['Menu', ['Profile', 'Settings', 'Logout']],
        CloseOnSelectFalse: ['Menu', ['Profile', 'Settings', 'Logout']],
        Placement: ['Menu (Placement)', ['Profile', 'Settings', 'Logout']],
        WithOffset: ['Menu (Custom Offset)', ['Profile', 'Settings', 'Logout']],
        WithPositioningOptions: ['Menu (All Positioning Options)', ['Profile', 'Settings', 'Logout']],
      };
      for (const [name, [trigger, items]] of Object.entries(expected)) {
        const menu = (await mount(menuStories as unknown as Module, name)) as GdMenu;
        expect(triggerOf(menu).textContent).toBe(trigger);
        expect(itemsOf(menu)).toEqual(items);
      }
    });

    it('applies the positioning arguments of the source stories', async () => {
      const read = async (name: string) => {
        const node = await mount(menuStories as unknown as Module, name);
        const menu = (node.localName === 'gd-menu' ? node : node.querySelector('gd-menu')) as GdMenu;
        return [menu.placement, menu.offsetX, menu.offsetY, menu.minHeight, menu.maxHeight, menu.closeOnSelect];
      };
      expect(await read('Default')).toEqual(['bottom-right', 4, 4, 80, 400, true]);
      expect(await read('CloseOnSelectFalse')).toEqual(['bottom-right', 4, 4, 80, 400, false]);
      expect(await read('WithOffset')).toEqual(['bottom-right', 12, 8, 80, 400, true]);
      expect(await read('WithHeightConstraints')).toEqual(['bottom-right', 4, 4, 100, 300, true]);
      expect(await read('WithPositioningOptions')).toEqual(['bottom-right', 8, 8, 120, 350, true]);
    });

    it('wraps the height constraint menu in a viewport tall box with two options', async () => {
      const box = await mount(menuStories as unknown as Module, 'WithHeightConstraints');
      expect(box.localName).toBe('gd-box');
      expect((box as HTMLElement & { minHeight: string }).minHeight).toBe('100vh');
      expect(itemsOf(box.querySelector('gd-menu') as GdMenu)).toEqual(['Profile', 'Settings']);
    });

    it('opens and closes the menu from the buttons of the ref control story', async () => {
      const column = await mount(menuStories as unknown as Module, 'WithRefControl');
      const [open, close] = [...column.querySelectorAll('gd-button')] as HTMLElement[];
      const menu = column.querySelector('gd-menu') as GdMenu;
      expect([open.textContent, close.textContent]).toEqual(['Open Menu', 'Close Menu']);
      expect(menu.querySelector('gd-typography')!.textContent).toBe('Menu (Controlled via Ref)');
      open.click();
      await settle();
      expect(menu.open).toBe(true);
      close.click();
      await settle();
      expect(menu.open).toBe(false);
    });

    it('opens the edit and delete modals from their options and closes them from the footer button', async () => {
      const box = await mount(menuStories as unknown as Module, 'WithEditAndDeleteModals');
      const menu = box.querySelector('gd-menu') as GdMenu;
      expect(itemsOf(menu)).toEqual(['Edit', 'Delete', 'View']);
      const choose = async (name: string) => {
        menu.open = true;
        await settle();
        await frame();
        await userEvent.click(menu.querySelector(`[data-gd-menu-name="${name}"]`)!);
        await settle();
      };
      const modalText = () => box.querySelector('[data-testid="Modal-body"]')?.textContent;

      await choose('Edit');
      expect(modalText()).toBe('Edit modal for item: Edit');
      box.querySelector<HTMLElement>('[data-testid="Modal-footer"] gd-button')!.click();
      expect(modalText()).toBeUndefined();

      await choose('Delete');
      expect(modalText()).toBe('Are you sure you want to delete: Delete?');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(modalText()).toBeUndefined();

      await choose('View');
      expect(modalText()).toBeUndefined();
    });
  });
});
