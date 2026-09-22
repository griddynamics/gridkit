import { GD_FONT_FACES } from '../fonts';
import {
  FIRA_CODE_FACES,
  FIRA_SANS_FACES,
  FIRA_SANS_ITALIC_FACES,
  parseFirstFontFamily,
  toFontFamily,
} from './toFontFamily';

describe('parseFirstFontFamily', () => {
  it('reduces a CSS font stack to its first family, unquoted', () => {
    expect(parseFirstFontFamily('"Fira Sans", sans-serif')).toBe('Fira Sans');
  });

  it('handles single quotes and unquoted single families', () => {
    expect(parseFirstFontFamily("'Fira Code', Monaco")).toBe('Fira Code');
    expect(parseFirstFontFamily('Monaco')).toBe('Monaco');
  });

  it('returns undefined for undefined or empty input rather than an empty string', () => {
    expect(parseFirstFontFamily(undefined)).toBeUndefined();
    expect(parseFirstFontFamily('')).toBeUndefined();
    expect(parseFirstFontFamily('   ')).toBeUndefined();
  });
});

describe('toFontFamily', () => {
  it('never returns a CSS stack — the defect this exists to fix', () => {
    // The literal value gd-design-core returns. Handing this to RN's `fontFamily` matches no
    // native family, so iOS/Android silently fall back to the system face.
    const resolved = toFontFamily('"Fira Sans", sans-serif');
    expect(resolved).not.toContain(',');
    expect(resolved).not.toContain('"');
  });

  it('maps the default weight to the regular Fira Sans face', () => {
    expect(toFontFamily('"Fira Sans", sans-serif')).toBe(FIRA_SANS_FACES[400]);
    expect(toFontFamily('"Fira Sans", sans-serif', 400)).toBe(FIRA_SANS_FACES[400]);
  });

  it('selects a distinct face per gd-design-core weight, since RN does not synthesize weights', () => {
    expect(toFontFamily('"Fira Sans", sans-serif', 300)).toBe(FIRA_SANS_FACES[300]);
    expect(toFontFamily('"Fira Sans", sans-serif', 500)).toBe(FIRA_SANS_FACES[500]);
    expect(toFontFamily('"Fira Sans", sans-serif', 700)).toBe(FIRA_SANS_FACES[700]);
  });

  it('accepts a string weight, matching the resolver\'s loose "string | number" shape', () => {
    expect(toFontFamily('"Fira Sans", sans-serif', '700')).toBe(FIRA_SANS_FACES[700]);
  });

  it('selects the italic face when fontStyle is italic', () => {
    expect(toFontFamily('"Fira Sans", sans-serif', 400, 'italic')).toBe(FIRA_SANS_ITALIC_FACES[400]);
    expect(toFontFamily('"Fira Sans", sans-serif', 700, 'italic')).toBe(FIRA_SANS_ITALIC_FACES[700]);
  });

  it('snaps an unregistered weight to the nearest registered one, keeping the family correct', () => {
    // 600 is equidistant from 500 and 700 — ties resolve to the lighter face.
    expect(toFontFamily('"Fira Sans", sans-serif', 600)).toBe(FIRA_SANS_FACES[500]);
    expect(toFontFamily('"Fira Sans", sans-serif', 100)).toBe(FIRA_SANS_FACES[300]);
    expect(toFontFamily('"Fira Sans", sans-serif', 900)).toBe(FIRA_SANS_FACES[700]);
    // Italic registers only 400/700, so 500 snaps down to 400 rather than losing the italic.
    expect(toFontFamily('"Fira Sans", sans-serif', 500, 'italic')).toBe(FIRA_SANS_ITALIC_FACES[400]);
  });

  it('resolves the monospace stack used by the code/kbd variants', () => {
    expect(toFontFamily('"Fira Code", Monaco')).toBe(FIRA_CODE_FACES[400]);
  });

  it('falls back to the regular face for a family with no italic registered', () => {
    expect(toFontFamily('"Fira Code", Monaco', 400, 'italic')).toBe(FIRA_CODE_FACES[400]);
  });

  it('returns undefined for inherit, matching how every atom drops inherit-valued fields', () => {
    expect(toFontFamily('inherit')).toBeUndefined();
    expect(toFontFamily(undefined)).toBeUndefined();
  });

  it('ignores an inherit/garbage weight instead of producing no face at all', () => {
    expect(toFontFamily('"Fira Sans", sans-serif', 'inherit')).toBe(FIRA_SANS_FACES[400]);
    expect(toFontFamily('"Fira Sans", sans-serif', 'bold')).toBe(FIRA_SANS_FACES[400]);
  });

  it('passes through an unknown family as a bare name rather than a stack', () => {
    // A themed override can supply any family; we cannot map it to a registered face, but the
    // bare name is still a valid RN lookup key where the stack never was.
    expect(toFontFamily('"Helvetica Neue", Arial, sans-serif')).toBe('Helvetica Neue');
  });
});

describe('font face registry contract', () => {
  it('registers an asset for every face name toFontFamily can return', () => {
    const declared = [
      ...Object.values(FIRA_SANS_FACES),
      ...Object.values(FIRA_SANS_ITALIC_FACES),
      ...Object.values(FIRA_CODE_FACES),
    ];
    // Guards the one way this fix silently regresses: a face selected here but never loaded by
    // `src/fonts.ts` resolves to nothing at runtime and falls back to the system font — exactly
    // the original bug, reintroduced one weight at a time.
    for (const face of declared) {
      expect(GD_FONT_FACES).toHaveProperty(face);
    }
  });

  it('loads no face that nothing can select, so the bundle carries no dead TTFs', () => {
    const declared = new Set([
      ...Object.values(FIRA_SANS_FACES),
      ...Object.values(FIRA_SANS_ITALIC_FACES),
      ...Object.values(FIRA_CODE_FACES),
    ]);
    for (const loaded of Object.keys(GD_FONT_FACES)) {
      expect(declared).toContain(loaded);
    }
  });
});
