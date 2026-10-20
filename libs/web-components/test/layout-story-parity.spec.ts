import { describe, expect, it } from 'vitest';
import * as columnStories from '../stories/Column.stories';
import * as chatContainerStories from '../stories/ChatContainer.stories';
import * as flexContainerStories from '../stories/FlexContainer.stories';
import * as portalStories from '../stories/Portal.stories';
import * as rowStories from '../stories/Row.stories';
import * as scrollStories from '../stories/Scroll.stories';

type StoryModule = Record<
  string,
  | unknown
  | {
      parameters?: { docs?: { source?: { code?: string; language?: string } } };
    }
>;

const contracts: Array<[string, StoryModule, string[]]> = [
  [
    'ChatContainer',
    chatContainerStories,
    ['Default', 'MinimalLayoutWithRefControl', 'InteractiveDemo', 'DefaultTokens'],
  ],
  ['Column', columnStories, ['Default', 'DefaultTokens']],
  ['FlexContainer', flexContainerStories, ['Default', 'JustifyStart', 'DefaultTokens']],
  ['Portal', portalStories, ['Default', 'RenderingInTarget', 'WithWrapper', 'WithWrapperAsTagMain']],
  ['Row', rowStories, ['Default', 'DefaultTokens']],
  [
    'Scroll',
    scrollStories,
    [
      'InteractiveExample',
      'VerticalScrollOnly',
      'HorizontalScrollOnly',
      'AutoHideScrollbars',
      'AutoHideVerticalOnly',
      'DefaultTokens',
    ],
  ],
];

describe('Layout & Structure Storybook parity', () => {
  it('mirrors the source layout controls', () => {
    const argTypesOf = (module: StoryModule) =>
      (module.default as { argTypes?: Record<string, { table?: { category?: string }; category?: string }> })
        .argTypes ?? {};
    const columnMeta = columnStories.default as { args?: Record<string, unknown> };
    const rowMeta = rowStories.default as { args?: Record<string, unknown> };

    for (const [meta, stories] of [
      [columnMeta, columnStories],
      [rowMeta, rowStories],
    ] as const) {
      expect(meta.args).toHaveProperty('as', 'div');
      expect(argTypesOf(stories)).toHaveProperty('as');
      expect(argTypesOf(stories).as.table?.category).toBe('Behavior');
    }
    expect(Object.keys(argTypesOf(rowStories))).toHaveLength(44);
    expect(Object.keys(argTypesOf(columnStories))).toHaveLength(44);
    expect(Object.keys(argTypesOf(flexContainerStories))).toHaveLength(39);
    expect(argTypesOf(flexContainerStories)).toHaveProperty('className');
    expect(argTypesOf(portalStories)).toHaveProperty('WrapperView');
    expect(argTypesOf(chatContainerStories)).toHaveProperty('ref');
    expect(argTypesOf(chatContainerStories)).toHaveProperty('className');
    expect(Object.keys(argTypesOf(scrollStories))).toEqual([
      'vertical',
      'horizontal',
      'autoHide',
      'styles',
      'children',
    ]);
  });

  it('centres the stories that the source centres and pads the token pages', () => {
    const layoutOf = (module: StoryModule, story?: string) =>
      story
        ? (module[story] as { parameters?: { layout?: string } }).parameters?.layout
        : (module.default as { parameters?: { layout?: string } }).parameters?.layout;
    for (const module of [columnStories, flexContainerStories, portalStories, rowStories])
      expect(layoutOf(module)).toBe('centered');
    expect(layoutOf(chatContainerStories)).toBe('fullscreen');
    for (const module of [columnStories, chatContainerStories, flexContainerStories, rowStories, scrollStories])
      expect(layoutOf(module, 'DefaultTokens')).toBe('padded');
  });

  it.each(contracts)('%s preserves the complete React story inventory', (_name, stories, expected) => {
    expect(Object.keys(stories).filter((key) => key !== 'default')).toEqual(expect.arrayContaining(expected));
    expect(Object.keys(stories).filter((key) => key !== 'default')).toHaveLength(expected.length);
  });

  it.each(contracts)(
    '%s provides readable, explicitly formatted Show code for every story',
    (_name, stories, expected) => {
      for (const storyName of expected) {
        const story = stories[storyName] as {
          parameters?: { docs?: { source?: { code?: string; language?: string } } };
        };
        const source = story.parameters?.docs?.source;
        expect(source?.language, storyName).toBe('html');
        expect(source?.code, storyName).toBeTypeOf('string');
        expect(source?.code?.split('\n').length, storyName).toBeGreaterThanOrEqual(3);
        expect(source?.code, storyName).not.toMatch(/\[object Object\]|data-story-block|=>\s*\{/);
      }
    }
  );

  describe('rendered structure', () => {
    type Rendered = { render?: (args: Record<string, unknown>) => Node; args?: object };
    const mount = (module: StoryModule, name: string) => {
      const meta = module.default as unknown as { render: (args: Record<string, unknown>) => Node; args?: object };
      const story = module[name] as Rendered;
      const node = (story.render ?? meta.render)({ ...(meta.args ?? {}), ...(story.args ?? {}) });
      document.body.replaceChildren(node);
      return node;
    };

    it('keeps the line number as a separate text node in Scroll content, like the source JSX', () => {
      const node = mount(scrollStories, 'VerticalScrollOnly') as HTMLElement;
      const lines = [...node.querySelectorAll('gd-typography')];
      expect(lines).toHaveLength(20);
      expect(lines[0].textContent).toBe('Vertical content line 1');
      expect(lines[0].childNodes).toHaveLength(2);
    });

    it('renders the FlexContainer default story with an empty maxWidth like the source', () => {
      const node = mount(flexContainerStories, 'Default') as HTMLElement;
      expect(node.className).toBe('bg-gray-100 border border-gray-300');
      expect([...node.querySelectorAll('p')].map((p) => p.textContent)).toEqual([
        '1. This is a container with maxWidth set to ',
        '2. This is a container with maxWidth set to ',
        '3. This is a container with maxWidth set to ',
      ]);
    });

    it('renders Row and Column inside the same 300px stage as the source', () => {
      for (const [module, tag] of [
        [rowStories, 'gd-row'],
        [columnStories, 'gd-column'],
      ] as const) {
        const stage = mount(module, 'Default') as HTMLElement;
        expect(stage.localName).toBe('gd-flex-container');
        const layout = stage.querySelector(tag)!;
        expect(layout.querySelectorAll('div')).toHaveLength(3);
        expect([...layout.querySelectorAll('div')].map((item) => item.textContent)).toEqual([
          'Item 1',
          'Item 2',
          'Item 3',
        ]);
      }
    });

    it('splits the Portal trigger label into the state word and the fixed label', () => {
      const root = mount(portalStories, 'Default') as HTMLElement;
      const trigger = root.querySelector('[data-testid="Portal-show-link"]')!;
      expect(trigger.textContent).toBe('Show Portal');
      expect(trigger.childNodes).toHaveLength(2);
      // The custom-container stories render the trigger container directly in the canvas.
      expect(mount(portalStories, 'WithWrapper')).toBeInstanceOf(DocumentFragment);
    });

    it('renders four chat bubbles, the snackbar and a pending loader in ChatContainer', () => {
      const node = mount(chatContainerStories, 'Default') as HTMLElement;
      expect(node.querySelectorAll('[data-testid="ChatBubble"]')).toHaveLength(4);
      expect(node.querySelector('[data-testid="Snackbar"]')?.textContent).toContain('Click the button below to retry.');
      expect(node.querySelector('gd-loader')).not.toBeNull();
      expect(node.querySelectorAll('gd-box')).toHaveLength(3);
    });
  });
});
