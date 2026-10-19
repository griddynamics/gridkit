import type { GdTypography } from '../src';
import { element } from './helpers';
import { formattedSource } from './layout-story-helpers';

export type Props = Record<string, unknown>;

/** Text parts become separate text nodes, like the adjacent text and expression children of a JSX element. */
export const typography = (variant: GdTypography['variant'], ...parts: Array<string | Node>) => {
  const node = element('gd-typography', { variant });
  node.append(...parts);
  return node;
};
/** A typography element with extra properties such as `as` or `color`. */
export const text = (props: Props, ...parts: Array<string | Node>) => {
  const node = element('gd-typography', props);
  node.append(...parts);
  return node;
};
export const row = (props: Props, ...children: Node[]) => {
  const node = element('gd-row', props);
  node.append(...children);
  return node;
};
export const column = (props: Props, ...children: Node[]) => {
  const node = element('gd-column', props);
  node.append(...children);
  return node;
};
export const flexContainer = (props: Props, ...children: Node[]) => {
  const node = element('gd-flex-container', props);
  node.append(...children);
  return node;
};

export const storyParameters = (description: string | undefined, source?: string, extra: Props = {}) => {
  const docs = {
    ...(source ? formattedSource(source).docs : {}),
    ...(description ? { description: { story: description } } : {}),
  };
  return { ...extra, docs };
};
