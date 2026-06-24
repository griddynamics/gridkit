import { describe, it, expect, beforeEach } from 'vitest';
import {
  isHTMLElement,
  isElement,
  isNativeKeyboardFocusable,
  isNativeMouseFocusable,
  getClosestFocusable,
  svgNodeFilter,
} from './focus';

describe('Focus Utilities', () => {
  let document: Document;
  let container: HTMLElement;

  beforeEach(() => {
    document = window.document;
    document.body.innerHTML = `
      <div id="container">
        <button>Click me</button>
        <input type="text" />
        <input type="hidden" />
        <textarea></textarea>
        <button tabindex="0">Tab index -1</button>
        <button tabindex="-1">Tab index -1</button>
        <button disabled>Tab index -1</button>
        <a href="#">Link</a>
        <svg>
          <circle />
        </svg>
      </div>
    `;
    container = document.querySelector('#container') as HTMLElement;
  });

  describe('isHTMLElement', () => {
    it('SHOULD return true for HTML elements', () => {
      const button = document.querySelector('button');
      expect(isHTMLElement(button)).toBe(true);
    });

    it('SHOULD return false for non-HTML elements', () => {
      const svg = document.querySelector('svg');
      expect(isHTMLElement(svg)).toBe(false);
    });

    it('SHOULD return false for null or undefined', () => {
      expect(isHTMLElement(null)).toBe(false);
      expect(isHTMLElement(undefined)).toBe(false);
    });
  });

  describe('isElement', () => {
    it('SHOULD return true for Element nodes', () => {
      const button = document.querySelector('button');
      expect(isElement(button)).toBe(true);
    });

    it('SHOULD return false for non-Element nodes', () => {
      const textNode = document.createTextNode('text');
      expect(isElement(textNode)).toBe(false);
    });

    it('SHOULD return false for null or undefined', () => {
      expect(isElement(null)).toBe(false);
      expect(isElement(undefined)).toBe(false);
    });
  });

  describe('isNativeKeyboardFocusable', () => {
    it('SHOULD return true for naturally focusable elements', () => {
      const button = document.querySelector('button:not([disabled])');
      const input = document.querySelector('input[type="text"]');
      const textarea = document.querySelector('textarea');
      const link = document.querySelector('a');

      expect(isNativeKeyboardFocusable(button!)).toBe(true);
      expect(isNativeKeyboardFocusable(input!)).toBe(true);
      expect(isNativeKeyboardFocusable(textarea!)).toBe(true);
      expect(isNativeKeyboardFocusable(link!)).toBe(true);
    });

    it('SHOULD return true for elements with tabindex="0"', () => {
      const tabIndex0 = document.querySelector('[tabindex="0"]');
      expect(isNativeKeyboardFocusable(tabIndex0!)).toBe(true);
    });

    it('SHOULD return true for elements with tabindex="0" even if not naturally focusable', () => {
      const div = document.createElement('div');
      div.setAttribute('tabindex', '0');
      expect(isNativeKeyboardFocusable(div)).toBe(true);
    });

    it('SHOULD return false for disabled elements', () => {
      const disabledButton = document.querySelector('button[disabled]');
      expect(isNativeKeyboardFocusable(disabledButton!)).toBe(false);
    });

    it('SHOULD return false for elements with tabindex="-1"', () => {
      const tabIndexMinus1 = document.querySelector('[tabindex="-1"]');
      expect(isNativeKeyboardFocusable(tabIndexMinus1!)).toBe(false);
    });

    it('SHOULD return false for hidden inputs', () => {
      const hiddenInput = document.querySelector('input[type="hidden"]');
      expect(isNativeKeyboardFocusable(hiddenInput!)).toBe(false);
    });
  });

  describe('isNativeMouseFocusable', () => {
    it('SHOULD return true for elements with tabindex="-1"', () => {
      const tabIndex = document.querySelector('[tabindex="-1"]');
      expect(isNativeMouseFocusable(tabIndex!)).toBe(true);
    });

    it('SHOULD return false for disabled elements', () => {
      const disabledButton = document.querySelector('button[disabled]');
      expect(isNativeMouseFocusable(disabledButton!)).toBe(false);
    });

    it('SHOULD return true for naturally focusable elements', () => {
      const button = document.querySelector('button:not([disabled])');
      expect(isNativeMouseFocusable(button!)).toBe(true);
    });
  });

  describe('getClosestFocusable', () => {
    it('SHOULD find current focusable element', () => {
      const button = document.querySelector('button:not([disabled])');
      const result = getClosestFocusable({
        initial: button!,
        root: container,
      });
      expect(result).toBe(button);
    });

    it('SHOULD return null when no focusable element is found', () => {
      const emptyContainer = document.createElement('div');
      const result = getClosestFocusable({
        initial: emptyContainer,
        root: emptyContainer,
      });
      expect(result).toBeNull();
    });

    it('SHOULD return null when root has no ownerDocument', () => {
      const root = document.createElement('div');
      Object.defineProperty(root, 'ownerDocument', {
        get: () => null,
        configurable: true,
      });
      const result = getClosestFocusable({
        initial: root,
        root: root,
      });
      expect(result).toBeNull();
    });
  });

  describe('svgNodeFilter', () => {
    it('SHOULD reject SVG elements', () => {
      const svg = document.querySelector('svg');
      expect(svgNodeFilter.acceptNode(svg!)).toBe(NodeFilter.FILTER_REJECT);
    });

    it('SHOULD accept non-SVG elements', () => {
      const div = document.querySelector('div');
      expect(svgNodeFilter.acceptNode(div!)).toBe(NodeFilter.FILTER_ACCEPT);
    });
  });
});
