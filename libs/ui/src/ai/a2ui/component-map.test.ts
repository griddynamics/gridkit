import { describe, expect, it } from 'vitest';
import { A2UI_COMPONENT_MAP } from './component-map';

describe('A2UI_COMPONENT_MAP — notes restoration', () => {
  it("SHOULD include Avatar's restored commonPatterns, examples, and troubleshooting content, not just compositionTips", () => {
    const notes = A2UI_COMPONENT_MAP['avatar']?.notes ?? [];

    expect(notes.length).toBe(24);
    expect(notes.some((n) => n.includes('Icon Fallback'))).toBe(true);
    expect(
      notes.some((n) =>
        n.includes(
          '<Avatar fallbackComponent={<Icon name="star" fill="#646464" />} backgroundColor="#E0E0E0" sizeVariant="xl" />'
        )
      )
    ).toBe(true);
    expect(notes.some((n) => n.includes('Troubleshooting — Icon fallback not showing'))).toBe(true);
  });

  it("SHOULD include Card's restored commonPatterns content as a second acceptance case", () => {
    const notes = A2UI_COMPONENT_MAP['card']?.notes ?? [];

    expect(notes.some((n) => n.includes('E-commerce Product Card (Vertical)'))).toBe(true);
  });

  it('SHOULD give every top-level a2uiName component a non-empty notes array', () => {
    const emptyNotesTypes = Object.entries(A2UI_COMPONENT_MAP)
      .filter(([, entry]) => !entry.notes || entry.notes.length === 0)
      .map(([type]) => type);

    expect(emptyNotesTypes).toEqual([]);
  });

  it("SHOULD inherit the parent's fully-merged notes for card-title (a Card subcomponent), not just compositionTips", () => {
    expect(A2UI_COMPONENT_MAP['card-title']?.notes).toEqual(A2UI_COMPONENT_MAP['card']?.notes);
    expect(A2UI_COMPONENT_MAP['card-title']?.notes?.length).toBeGreaterThan(0);
  });

  it("SHOULD inherit the parent's fully-merged notes for accordion-item (a non-Card subcomponent), proving the fix isn't Card-special-cased", () => {
    expect(A2UI_COMPONENT_MAP['accordion-item']?.notes).toEqual(A2UI_COMPONENT_MAP['accordion']?.notes);
    expect(A2UI_COMPONENT_MAP['accordion-item']?.notes?.length).toBeGreaterThan(0);
  });
});
