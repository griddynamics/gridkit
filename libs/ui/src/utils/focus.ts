export interface ClosestFocusableOptions {
  /**
   * @description:
   * current HTML element
   */
  initial: Element;

  /**
   * @description:
   * determine if only keyboard focus is of interest
   */
  keyboard?: boolean;

  /**
   * @description:
   * should it look backwards instead (find item that will be focused with Shift + Tab)
   */
  previous?: boolean;

  /**
   * @description:
   * top Node limiting the search area
   */
  root: Node;
}

export const svgNodeFilter: Exclude<NodeFilter, (node: Node) => number> = {
  acceptNode(node: Node): number {
    return 'ownerSVGElement' in node ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
  },
};

export function isHTMLElement(node: unknown): node is HTMLElement {
  const defaultView = (node as Element | undefined)?.ownerDocument.defaultView;

  return !!node && !!defaultView && node instanceof defaultView.HTMLElement;
}

export function isElement(node?: Element | EventTarget | Node | null): node is Element {
  return !!node && 'nodeType' in node && node.nodeType === Node.ELEMENT_NODE;
}

/**
 * Checks for signs that element can be focused with keyboard. tabIndex above 0 is ignored to
 * only target natural focus order.
 */
export function isNativeKeyboardFocusable(element: Element): boolean {
  if (element.hasAttribute('disabled') || element.getAttribute('tabIndex') === '-1') {
    return false;
  }

  if ((isHTMLElement(element) && element.isContentEditable) || element.getAttribute('tabIndex') === '0') {
    return true;
  }

  switch (element.tagName) {
    case 'A':
    case 'LINK':
      return element.hasAttribute('href');
    case 'BUTTON':
    case 'SELECT':
    case 'TEXTAREA':
      return true;
    case 'INPUT':
      return element.getAttribute('type') !== 'hidden';
    default:
      return false;
  }
}

export function isNativeMouseFocusable(element: Element): boolean {
  return (
    !element.hasAttribute('disabled') &&
    (element.getAttribute('tabIndex') === '-1' || isNativeKeyboardFocusable(element))
  );
}

export function getClosestFocusable({
  initial,
  root,
  previous = false,
  keyboard = true,
}: ClosestFocusableOptions): HTMLElement | null {
  if (!root.ownerDocument) {
    return null;
  }

  const checkIsFocusable = keyboard ? isNativeKeyboardFocusable : isNativeMouseFocusable;
  const treeWalker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, svgNodeFilter);

  treeWalker.currentNode = initial;

  do {
    if (isHTMLElement(treeWalker.currentNode)) {
      initial = treeWalker.currentNode;
    }

    if (isHTMLElement(initial) && checkIsFocusable(initial)) {
      return initial;
    }
  } while (previous ? treeWalker.previousNode() : treeWalker.nextNode());

  return null;
}
