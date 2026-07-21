/**
 * A2UI Security Module
 *
 * Shared, dependency-free hardening primitives for the A2UI pipeline: resource limits
 * (tree depth / node count / payload size), URL scheme validation, and attribute
 * sanitization. These functions are pure and side-effect-free so they can run both at
 * spec-ingest time (an external consumer such as Cerebra, importing `gd-design-library/ai`)
 * and at spec-render time (`renderA2UISpec`, `gd-design-library/renderer`) without pulling
 * in React or any other runtime dependency.
 *
 * A2UI protocol: https://a2ui.org
 */

import type { A2UISpec } from './spec-schema';

export type A2UISecurityLimits = {
  /** Maximum nesting depth of the component tree (root components are depth 1). */
  maxTreeDepth: number;
  /** Maximum total number of component nodes across the whole tree. */
  maxNodeCount: number;
  /** Maximum serialized spec size, measured in UTF-16 code units (a conservative proxy for byte length). */
  maxPayloadBytes: number;
};

export const A2UI_SECURITY_LIMITS: A2UISecurityLimits = {
  maxTreeDepth: 24,
  maxNodeCount: 1000,
  maxPayloadBytes: 300 * 1024,
};

/**
 * Component fields that hold nested `A2UIComponent[]` trees. Kept in sync by hand with
 * `A2UIComponent` in `spec-schema.ts` — data-only arrays (`options`, `columns`, `rows`,
 * `data`, `items`, `images`, `files`, `errors`) are intentionally excluded: they hold plain
 * data, not renderable component nodes, so they count toward payload size only.
 */
const COMPONENT_ARRAY_FIELDS = [
  'children',
  'footer',
  'actionChildren',
  'logoChildren',
  'menuChildren',
  'bannerChildren',
  'advChildren',
  'headerChildren',
  'footerChildren',
  'headerContent',
  'sidebarContent',
  'sidebarMinifiedContent',
  'sidebarHeaderContent',
  'dragOverContent',
  'loadingOverlay',
  'dragOverChildren',
] as const;

export type A2UISpecLimitCheck = {
  valid: boolean;
  violations: string[];
  stats: {
    nodeCount: number;
    maxDepth: number;
    payloadBytes: number;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function walkComponentTree(
  components: unknown,
  depth: number,
  accumulator: { nodeCount: number; maxDepth: number }
): void {
  if (!Array.isArray(components)) {
    return;
  }

  for (const component of components) {
    if (!isRecord(component)) {
      continue;
    }

    accumulator.nodeCount += 1;
    accumulator.maxDepth = Math.max(accumulator.maxDepth, depth);

    for (const field of COMPONENT_ARRAY_FIELDS) {
      walkComponentTree(component[field], depth + 1, accumulator);
    }
  }
}

/**
 * Validates a spec against resource limits (tree depth, node count, payload size) before
 * it is rendered or otherwise trusted. Accepts any object shaped like an A2UI spec (or a
 * partial `{ ui: { components } }` shape), since ingest-side consumers may validate a
 * spec before it is fully normalized.
 */
export function checkA2UISpecLimits(
  spec: Pick<A2UISpec, 'ui'> | A2UISpec | null | undefined,
  limits?: Partial<A2UISecurityLimits>
): A2UISpecLimitCheck {
  const mergedLimits: A2UISecurityLimits = {
    ...A2UI_SECURITY_LIMITS,
    ...(typeof limits?.maxTreeDepth === 'number' ? { maxTreeDepth: limits.maxTreeDepth } : {}),
    ...(typeof limits?.maxNodeCount === 'number' ? { maxNodeCount: limits.maxNodeCount } : {}),
    ...(typeof limits?.maxPayloadBytes === 'number' ? { maxPayloadBytes: limits.maxPayloadBytes } : {}),
  };
  const violations: string[] = [];
  const accumulator = { nodeCount: 0, maxDepth: 0 };

  walkComponentTree(spec?.ui?.components, 1, accumulator);

  const payloadBytes = spec ? JSON.stringify(spec).length : 0;

  if (accumulator.nodeCount > mergedLimits.maxNodeCount) {
    violations.push(
      `Component tree has ${accumulator.nodeCount} nodes, exceeding the maximum of ${mergedLimits.maxNodeCount}.`
    );
  }

  if (accumulator.maxDepth > mergedLimits.maxTreeDepth) {
    violations.push(
      `Component tree depth is ${accumulator.maxDepth}, exceeding the maximum of ${mergedLimits.maxTreeDepth}.`
    );
  }

  if (payloadBytes > mergedLimits.maxPayloadBytes) {
    violations.push(`Spec payload is ${payloadBytes} bytes, exceeding the maximum of ${mergedLimits.maxPayloadBytes}.`);
  }

  return {
    valid: violations.length === 0,
    violations,
    stats: { nodeCount: accumulator.nodeCount, maxDepth: accumulator.maxDepth, payloadBytes },
  };
}

/**
 * URL schemes that are never safe to navigate to or load, regardless of any configured
 * allowlist. `data:` is included here (not just left out of the default allowlist) because
 * it is also an unbounded-size payload vector, not only a script-injection vector.
 */
export const A2UI_ALWAYS_BLOCKED_URL_SCHEMES = ['javascript:', 'vbscript:', 'data:', 'file:'] as const;

export const A2UI_DEFAULT_ALLOWED_URL_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'] as const;

function extractUrlScheme(url: string): string | null {
  const match = /^([a-z][a-z0-9+.-]*):/i.exec(url);
  return match ? `${match[1]!.toLowerCase()}:` : null;
}

/**
 * Determines whether a spec-provided URL (`href`, `src`, `path`, etc.) is safe to use.
 *
 * Resolution order:
 * 1. Non-string input is never safe.
 * 2. Protocol-relative URLs (`//host/path`) inherit the current page scheme (always
 *    http/https in a browser), so they are treated as safe.
 * 3. A scheme-less value (relative path, `#fragment`, `?query`) is safe.
 * 4. Any scheme in `A2UI_ALWAYS_BLOCKED_URL_SCHEMES` is unsafe, regardless of `allowedSchemes`.
 * 5. Otherwise, the URL is safe only if its scheme appears in `allowedSchemes`.
 */
export function isSafeA2UIUrl(
  url: unknown,
  allowedSchemes: readonly string[] = A2UI_DEFAULT_ALLOWED_URL_SCHEMES
): boolean {
  if (typeof url !== 'string') {
    return false;
  }

  const trimmed = url.trim();

  if (trimmed.length === 0) {
    return false;
  }

  if (trimmed.startsWith('//')) {
    return true;
  }

  const scheme = extractUrlScheme(trimmed);

  if (scheme === null) {
    return true;
  }

  if ((A2UI_ALWAYS_BLOCKED_URL_SCHEMES as readonly string[]).includes(scheme)) {
    return false;
  }

  return allowedSchemes.includes(scheme);
}

const EVENT_HANDLER_ATTRIBUTE_PATTERN = /^on[a-z]/i;

/**
 * Strips dangerous keys/values from a spec's free-form `attributes` object before it is
 * spread onto a React element: `dangerouslySetInnerHTML` (raw HTML injection), a `children`
 * override, event-handler-shaped keys (`onClick`, `onError`, ...), and any function-typed
 * value. Everything else — including `data-*`, `aria-*`, `className`, `style` — passes
 * through unchanged, so legitimate DOM passthrough attributes keep working.
 */
export function sanitizeA2UIAttributes(attributes?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!isRecord(attributes)) {
    return undefined;
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'dangerouslySetInnerHTML' || key === 'children') {
      continue;
    }

    if (EVENT_HANDLER_ATTRIBUTE_PATTERN.test(key)) {
      continue;
    }

    if (typeof value === 'function') {
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
}
