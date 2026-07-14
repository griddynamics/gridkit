import type { ReactNode } from 'react';
import type { A2UIComponent, A2UISpec, A2UICustomComponentMeta } from '../../ai';
import type { INLINE_STYLE_PROP_KEYS } from './constants';

export type RenderableA2UISpec = Pick<A2UISpec, 'ui'>;
export type DispatchAction = (actionId: string, extraPayload?: Record<string, unknown>) => boolean;
export type Renderer = (
  component: A2UIComponent,
  renderChildren: (children?: A2UIComponent[]) => ReactNode[],
  dispatchAction?: DispatchAction
) => ReactNode;
export type StyleValue = string | number | undefined;
export type InlineStyleKey = (typeof INLINE_STYLE_PROP_KEYS)[number];

/**
 * A custom component definition that participates in both prompt generation and runtime rendering.
 *
 * Pass an array of these to `buildA2UISystemPrompt` (via `customComponents`) so the LLM knows
 * the type exists, and to `renderA2UISpec` so the renderer can handle it at runtime.
 * Built-in component types always win on type collisions.
 */
export type A2UICustomComponentDefinition = A2UICustomComponentMeta & {
  /** Renders the component when its `type` appears in a spec produced by the LLM */
  renderer: Renderer;
};
