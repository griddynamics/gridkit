import '@testing-library/jest-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testUtils';
import { renderA2UISpec } from './a2ui';
import { A2UI_SECURITY_LIMITS } from '../ai';
import { SECURITY_FALLBACK_TEST_ID } from './a2ui/constants';

declare global {
  var __pwned: boolean | undefined;
}

function buildWideSiblingSpec(count: number) {
  return {
    ui: {
      components: Array.from({ length: count }, (_, index) => ({ id: `sibling_${index}`, type: 'box' as const })),
    },
  };
}

function buildNestedChildrenSpec(depth: number) {
  let leaf: Record<string, unknown> = { id: `node_${depth}`, type: 'box' };

  for (let level = depth - 1; level >= 1; level--) {
    leaf = { id: `node_${level}`, type: 'box', children: [leaf] };
  }

  return { ui: { components: [leaf] } };
}

describe('renderA2UISpec security', () => {
  beforeAll(() => {
    if (typeof globalThis.ResizeObserver === 'undefined') {
      globalThis.ResizeObserver = class ResizeObserver {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        observe() {}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        unobserve() {}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        disconnect() {}
      } as typeof ResizeObserver;
    }
  });

  it('SHOULD render the fallback notice, not the tree, for a spec over the node-count limit', () => {
    const onSecurityViolation = vi.fn();
    const spec = buildWideSiblingSpec(A2UI_SECURITY_LIMITS.maxNodeCount + 1);

    render(<>{renderA2UISpec(spec, undefined, undefined, { onSecurityViolation })}</>);

    expect(screen.getByTestId(SECURITY_FALLBACK_TEST_ID)).toBeTruthy();
    expect(screen.queryByTestId('a2ui-layout-root')).toBeNull();
    expect(onSecurityViolation).toHaveBeenCalledTimes(1);
    expect(onSecurityViolation.mock.calls[0]![0]).toEqual(expect.arrayContaining([expect.stringContaining('nodes')]));
  });

  it('SHOULD render the fallback notice for a spec over the tree-depth limit', () => {
    const spec = buildNestedChildrenSpec(A2UI_SECURITY_LIMITS.maxTreeDepth + 1);

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByTestId(SECURITY_FALLBACK_TEST_ID)).toBeTruthy();
    expect(screen.queryByTestId('a2ui-layout-root')).toBeNull();
  });

  it('SHOULD render normally, and not call onSecurityViolation, for a spec within limits', () => {
    const onSecurityViolation = vi.fn();
    const spec = buildWideSiblingSpec(5);

    render(<>{renderA2UISpec(spec, undefined, undefined, { onSecurityViolation })}</>);

    expect(screen.getByTestId('a2ui-layout-root')).toBeTruthy();
    expect(screen.queryByTestId(SECURITY_FALLBACK_TEST_ID)).toBeNull();
    expect(onSecurityViolation).not.toHaveBeenCalled();
  });

  it('SHOULD still render a large but realistic table (many rows/columns) within limits', () => {
    const spec = {
      ui: {
        components: [
          {
            id: 'big_table',
            type: 'table' as const,
            columns: Array.from({ length: 12 }, (_, i) => ({ key: `col_${i}`, label: `Column ${i}` })),
            rows: Array.from({ length: 200 }, (_, i) => ({ col_0: `row ${i}` })),
          },
        ],
      },
    };

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByTestId('a2ui-layout-root')).toBeTruthy();
    expect(screen.queryByTestId(SECURITY_FALLBACK_TEST_ID)).toBeNull();
  });

  it('SHOULD render a link with a javascript: href without a functioning navigational href', () => {
    const unsafeHref = 'javascript:alert(1)';
    const spec = {
      ui: {
        components: [{ id: 'evil_link', type: 'link' as const, href: unsafeHref, label: 'Click me' }],
      },
    };

    render(<>{renderA2UISpec(spec)}</>);

    const link = screen.getByText('Click me').closest('a');
    expect(link?.getAttribute('href')).not.toBe(unsafeHref);

    expect(link?.getAttribute('href') ?? '').not.toContain('javascript:');
  });

  it('SHOULD never inject raw HTML or execute markup from attributes.dangerouslySetInnerHTML on skeleton', () => {
    globalThis.__pwned = false;

    const spec = {
      ui: {
        components: [
          {
            id: 'evil_skeleton',
            type: 'skeleton' as const,
            attributes: {
              dangerouslySetInnerHTML: { __html: '<img src=x onerror="window.__pwned=true">' },
            },
          },
        ],
      },
    };

    render(<>{renderA2UISpec(spec)}</>);

    expect(document.querySelector('img[onerror]')).toBeNull();
    expect(document.body.innerHTML).not.toContain('onerror');
    expect(globalThis.__pwned).toBe(false);
  });

  it('SHOULD render label/value text containing markup as inert escaped text', () => {
    const spec = {
      ui: {
        components: [
          {
            id: 'evil_text',
            type: 'typography' as const,
            value: '<script>window.__pwned = true</script>',
          },
        ],
      },
    };

    globalThis.__pwned = false;

    render(<>{renderA2UISpec(spec)}</>);

    expect(screen.getByText('<script>window.__pwned = true</script>')).toBeTruthy();
    expect(document.querySelectorAll('script')).toHaveLength(0);
    expect(globalThis.__pwned).toBe(false);
  });
});
