import { waitFor } from 'storybook/test';

/** Query inside the open shadow root of `host`. */
export const inShadow = <T extends Element = HTMLElement>(host: Element | null | undefined, selector: string) =>
  (host?.shadowRoot?.querySelector<T>(selector) ?? null) as T | null;

export const inShadowAll = <T extends Element = HTMLElement>(host: Element | null | undefined, selector: string) =>
  Array.from(host?.shadowRoot?.querySelectorAll<T>(selector) ?? []);

/** `document.activeElement`, descending through shadow roots. */
export const deepActiveElement = () => {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
};

/** Text of the nearest element in the canvas whose own text nodes read `text`. */
export const hasText = (canvasElement: HTMLElement, text: string | RegExp) =>
  Array.from(canvasElement.querySelectorAll('*')).some((node) => {
    const own = Array.from(node.childNodes)
      .filter((child) => child.nodeType === Node.TEXT_NODE)
      .map((child) => child.textContent ?? '')
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
    return typeof text === 'string' ? own === text : text.test(own);
  });

export const waitForCondition = (condition: () => boolean, timeout = 1000) =>
  waitFor(
    () => {
      if (!condition()) throw new Error('Condition not met yet');
    },
    { timeout }
  );
