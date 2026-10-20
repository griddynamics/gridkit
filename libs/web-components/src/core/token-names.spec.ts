import { describe, expect, it } from 'vitest';
import { checkbox, radius, typography } from 'gd-design-library/tokens';
import { iconCatalog } from 'gd-design-library/icons';
import { CHECKBOX_SIZE_NAMES, ICON_NAMES, RADIUS_NAMES, TYPOGRAPHY_STYLE_VARIANT_NAMES } from './token-names';

describe('token-names', () => {
  it.each([
    ['radius', RADIUS_NAMES, radius],
    ['checkbox.size', CHECKBOX_SIZE_NAMES, checkbox.size],
    ['typography.styleVariant', TYPOGRAPHY_STYLE_VARIANT_NAMES, typography.styleVariant],
    ['iconCatalog', ICON_NAMES, iconCatalog],
  ])('%s names match the real tokens', (_label, names, tokens) => {
    expect([...names].sort()).toEqual(Object.keys(tokens).sort());
  });
});
