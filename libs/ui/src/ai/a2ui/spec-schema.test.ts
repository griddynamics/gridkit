import { describe, expect, it } from 'vitest';
import { A2UI_SPEC_SCHEMA, extendA2UISpecSchema } from './spec-schema';

describe('extendA2UISpecSchema', () => {
  it('SHOULD append custom component types without mutating the base schema', () => {
    const baseEnumBefore = [...A2UI_SPEC_SCHEMA.properties.ui.properties.components.items.properties.type.enum];

    const extendedSchema = extendA2UISpecSchema(['product-badge']) as typeof A2UI_SPEC_SCHEMA;
    const extendedEnum = extendedSchema.properties.ui.properties.components.items.properties.type.enum;

    expect(extendedEnum).toContain('product-badge');
    expect(A2UI_SPEC_SCHEMA.properties.ui.properties.components.items.properties.type.enum).toEqual(baseEnumBefore);
    expect(A2UI_SPEC_SCHEMA.properties.ui.properties.components.items.properties.type.enum).not.toContain(
      'product-badge'
    );
  });

  it('SHOULD ignore built-in and duplicate custom component types', () => {
    const extendedSchema = extendA2UISpecSchema([
      'button',
      'product-badge',
      'product-badge',
    ]) as typeof A2UI_SPEC_SCHEMA;
    const extendedEnum = extendedSchema.properties.ui.properties.components.items.properties.type.enum;

    expect(extendedEnum.filter((type) => type === 'button')).toHaveLength(1);
    expect(extendedEnum.filter((type) => type === 'product-badge')).toHaveLength(1);
  });
});
