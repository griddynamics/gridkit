import type { GdTypography } from '../src';
import { element } from './helpers';
import { formattedSource } from './layout-story-helpers';

export type Props = Record<string, unknown>;
type Child = string | Node;

/** Drop `undefined` entries so that unset story args fall back to the element defaults. */
export const defined = (props: Props): Props =>
  Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined));

const withChildren = <T extends HTMLElement>(node: T, children: Child[]) => {
  node.append(...children);
  return node;
};

/** `gd-typography` without a variant renders the inherited `span` variant, like the source component. */
export const typography = (props: Props, ...children: Child[]) =>
  withChildren(element('gd-typography', { variant: 'span', ...defined(props) } as Partial<GdTypography>), children);
export const row = (props: Props, ...children: Child[]) => withChildren(element('gd-row', props), children);
export const column = (props: Props, ...children: Child[]) => withChildren(element('gd-column', props), children);

/** Docs parameters of a story: a readable HTML source plus the story description. */
export const storyParameters = (description: string, source: string, extra: Props = {}) => ({
  ...extra,
  docs: { ...formattedSource(source).docs, description: { story: description } },
});
