import { describe, expect, it, vi } from 'vitest';
import {
  A2UI_SECURITY_LIMITS,
  A2UI_ALWAYS_BLOCKED_URL_SCHEMES,
  A2UI_DEFAULT_ALLOWED_URL_SCHEMES,
  checkA2UISpecLimits,
  isSafeA2UIUrl,
  sanitizeA2UIAttributes,
} from './security';

function buildNestedChildrenSpec(depth: number) {
  let leaf: Record<string, unknown> = { id: `node_${depth}`, type: 'box' };

  for (let level = depth - 1; level >= 1; level--) {
    leaf = { id: `node_${level}`, type: 'box', children: [leaf] };
  }

  return { ui: { components: [leaf] } };
}

function buildWideSiblingSpec(count: number) {
  const components = Array.from({ length: count }, (_, index) => ({ id: `sibling_${index}`, type: 'box' }));
  return { ui: { components } };
}

describe('checkA2UISpecLimits', () => {
  it('SHOULD pass a spec at or under the default tree-depth limit', () => {
    const result = checkA2UISpecLimits(buildNestedChildrenSpec(A2UI_SECURITY_LIMITS.maxTreeDepth));

    expect(result.valid).toBe(true);
    expect(result.stats.maxDepth).toBe(A2UI_SECURITY_LIMITS.maxTreeDepth);
  });

  it('SHOULD fail a spec over the default tree-depth limit', () => {
    const result = checkA2UISpecLimits(buildNestedChildrenSpec(A2UI_SECURITY_LIMITS.maxTreeDepth + 1));

    expect(result.valid).toBe(false);
    expect(result.violations.some((v) => v.includes('depth'))).toBe(true);
  });

  it('SHOULD count depth across every component-array slot, not just children', () => {
    const spec = {
      ui: {
        components: [
          {
            id: 'sidebar_root',
            type: 'sidebar',
            headerChildren: [
              {
                id: 'sidebar_header_child',
                type: 'box',
                dragOverContent: [{ id: 'deep_leaf', type: 'box' }],
              },
            ],
          },
        ],
      },
    };

    const result = checkA2UISpecLimits(spec);

    expect(result.stats.maxDepth).toBe(3);
    expect(result.stats.nodeCount).toBe(3);
  });

  it('SHOULD pass a spec at or under the default node-count limit', () => {
    const result = checkA2UISpecLimits(buildWideSiblingSpec(A2UI_SECURITY_LIMITS.maxNodeCount));

    expect(result.valid).toBe(true);
    expect(result.stats.nodeCount).toBe(A2UI_SECURITY_LIMITS.maxNodeCount);
  });

  it('SHOULD fail a spec over the default node-count limit', () => {
    const result = checkA2UISpecLimits(buildWideSiblingSpec(A2UI_SECURITY_LIMITS.maxNodeCount + 1));

    expect(result.valid).toBe(false);
    expect(result.violations.some((v) => v.includes('nodes'))).toBe(true);
  });

  it('SHOULD fail a spec over the default payload-size limit', () => {
    const spec = {
      ui: {
        components: [{ id: 'huge_value', type: 'typography', value: 'x'.repeat(A2UI_SECURITY_LIMITS.maxPayloadBytes) }],
      },
    };

    const result = checkA2UISpecLimits(spec);

    expect(result.valid).toBe(false);
    expect(result.violations.some((v) => v.includes('payload'))).toBe(true);
  });

  it('SHOULD NOT count data-only arrays (rows/columns/options/items/images) toward depth or node count', () => {
    const spec = {
      ui: {
        components: [
          {
            id: 'big_table',
            type: 'table',
            columns: Array.from({ length: 12 }, (_, i) => ({ key: `col_${i}`, label: `Column ${i}` })),
            rows: Array.from({ length: 200 }, (_, i) => ({ col_0: `row ${i}` })),
          },
        ],
      },
    };

    const result = checkA2UISpecLimits(spec);

    expect(result.valid).toBe(true);
    expect(result.stats.nodeCount).toBe(1);
    expect(result.stats.maxDepth).toBe(1);
  });

  it('SHOULD respect overridden limits', () => {
    const spec = buildWideSiblingSpec(5);

    expect(checkA2UISpecLimits(spec, { maxNodeCount: 4 }).valid).toBe(false);
    expect(checkA2UISpecLimits(spec, { maxNodeCount: 5 }).valid).toBe(true);
  });

  it('SHOULD treat a missing/empty spec as valid with zero stats', () => {
    expect(checkA2UISpecLimits(undefined)).toMatchObject({
      valid: true,
      stats: { nodeCount: 0, maxDepth: 0 },
    });
    expect(checkA2UISpecLimits({ ui: { components: [] } }).valid).toBe(true);
  });
});

describe('isSafeA2UIUrl', () => {
  it.each(A2UI_ALWAYS_BLOCKED_URL_SCHEMES)('SHOULD always reject the %s scheme regardless of allowlist', (scheme) => {
    const url = `${scheme}alert(1)`;

    expect(isSafeA2UIUrl(url)).toBe(false);
    expect(isSafeA2UIUrl(url, [...A2UI_DEFAULT_ALLOWED_URL_SCHEMES, scheme])).toBe(false);
  });

  it.each(A2UI_DEFAULT_ALLOWED_URL_SCHEMES)('SHOULD accept the %s scheme by default', (scheme) => {
    expect(isSafeA2UIUrl(`${scheme}//example.com/resource`)).toBe(true);
  });

  it('SHOULD accept relative paths, hash fragments, and query strings', () => {
    expect(isSafeA2UIUrl('/products/123')).toBe(true);
    expect(isSafeA2UIUrl('products/123')).toBe(true);
    expect(isSafeA2UIUrl('#section-2')).toBe(true);
    expect(isSafeA2UIUrl('?tab=details')).toBe(true);
  });

  it('SHOULD accept protocol-relative URLs', () => {
    expect(isSafeA2UIUrl('//cdn.example.com/image.png')).toBe(true);
  });

  it('SHOULD reject a scheme not present in a custom allowlist', () => {
    expect(isSafeA2UIUrl('https://example.com', ['mailto:'])).toBe(false);
  });

  it('SHOULD accept a scheme added via a custom allowlist', () => {
    expect(isSafeA2UIUrl('ftp://example.com/file', ['ftp:'])).toBe(true);
  });

  it('SHOULD reject non-string input without throwing', () => {
    expect(isSafeA2UIUrl(undefined)).toBe(false);
    expect(isSafeA2UIUrl(null)).toBe(false);
    expect(isSafeA2UIUrl(42)).toBe(false);
    expect(isSafeA2UIUrl({})).toBe(false);
  });

  it('SHOULD reject an empty or whitespace-only string', () => {
    expect(isSafeA2UIUrl('')).toBe(false);
    expect(isSafeA2UIUrl('   ')).toBe(false);
  });

  it('SHOULD be case-insensitive when matching blocked schemes', () => {
    expect(isSafeA2UIUrl('JavaScript:alert(1)')).toBe(false);
    expect(isSafeA2UIUrl('  JAVASCRIPT:alert(1)')).toBe(false);
  });
});

describe('sanitizeA2UIAttributes', () => {
  it('SHOULD strip dangerouslySetInnerHTML', () => {
    const result = sanitizeA2UIAttributes({ dangerouslySetInnerHTML: { __html: '<img src=x onerror=alert(1)>' } });

    expect(result).not.toHaveProperty('dangerouslySetInnerHTML');
  });

  it('SHOULD strip a children override', () => {
    const result = sanitizeA2UIAttributes({ children: 'override' });

    expect(result).not.toHaveProperty('children');
  });

  it('SHOULD strip event-handler-shaped keys', () => {
    const result = sanitizeA2UIAttributes({ onClick: 'not-a-real-handler', onError: 'x', onLoad: 'y' });

    expect(result).toEqual({});
  });

  it('SHOULD strip function-typed values regardless of key name', () => {
    const result = sanitizeA2UIAttributes({ handler: vi.fn(), label: 'kept' });

    expect(result).toEqual({ label: 'kept' });
  });

  it('SHOULD preserve data-*, aria-*, and other plain attribute values', () => {
    const result = sanitizeA2UIAttributes({
      'data-testid': 'widget',
      'aria-label': 'Widget',
      className: 'custom-class',
      style: { color: 'red' },
      min: 0,
      max: 100,
    });

    expect(result).toEqual({
      'data-testid': 'widget',
      'aria-label': 'Widget',
      className: 'custom-class',
      style: { color: 'red' },
      min: 0,
      max: 100,
    });
  });

  it('SHOULD return undefined for undefined or non-object input', () => {
    expect(sanitizeA2UIAttributes(undefined)).toBeUndefined();
    expect(sanitizeA2UIAttributes(null as never)).toBeUndefined();
    expect(sanitizeA2UIAttributes([] as never)).toBeUndefined();
  });
});
