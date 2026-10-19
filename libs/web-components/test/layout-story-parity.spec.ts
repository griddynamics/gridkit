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
  it('exposes only platform-relevant layout controls', () => {
    const columnMeta = columnStories.default as { args?: Record<string, unknown>; argTypes?: Record<string, unknown> };
    const rowMeta = rowStories.default as { args?: Record<string, unknown>; argTypes?: Record<string, unknown> };
    const flexMeta = flexContainerStories.default as {
      args?: Record<string, unknown>;
      argTypes?: Record<string, unknown>;
    };
    const portalMeta = portalStories.default as { argTypes?: Record<string, unknown> };
    const chatMeta = chatContainerStories.default as { argTypes?: Record<string, unknown> };

    for (const meta of [columnMeta, rowMeta]) {
      expect(meta.args).toHaveProperty('as', 'div');
      expect(meta.argTypes).toHaveProperty('as');
    }
    expect(flexMeta.args ?? {}).not.toHaveProperty('className');
    expect(flexMeta.argTypes ?? {}).not.toHaveProperty('className');
    expect(portalMeta.argTypes ?? {}).toHaveProperty('WrapperView');
    expect(chatMeta.argTypes ?? {}).not.toHaveProperty('ref');
    expect(chatMeta.argTypes ?? {}).not.toHaveProperty('className');
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
});
