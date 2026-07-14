import { vi } from 'vitest';
import { SizeVariant } from '@types';

import { animations, colors, spacing, Unit, values } from './';
import {
  convertJsonToCssKeyframeCss,
  convertToInlineBoxStyles,
  convertToUnit,
  generateStateStyles,
  getBoxStyles,
  getFocusStyles,
  getSpacing,
  hexToRgba,
  getImgSrc,
  getMediaQuery,
  tokensHandler,
  resolveThemeColor,
} from './utils';
import { breakpoints } from './breakpoints';

describe('generateStateStyles', () => {
  it('SHOULD generates focus styles with correct outline color', () => {
    const result = generateStateStyles('primary');
    expect(result.focus.outline).toContain(colors.primary);
  });

  it('SHOULD generates disabled styles with correct properties', () => {
    const result = generateStateStyles('primary');
    expect(result.disabled.cursor).toBe('not-allowed');
    expect(result.disabled.border).toBe(values.borderNone);
  });
});

describe('convertJsonToCssKeyframeCss', () => {
  it('SHOULD converts JSON to CSS keyframe string', () => {
    const result = convertJsonToCssKeyframeCss(animations.spinKeyframes);
    expect(result.styles).toContain('0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) }');
  });
});

describe('convertToUnit', () => {
  it('SHOULD converts default to origin value', () => {
    const result = convertToUnit(12);
    expect(result).toBe(`12${Unit.Px}`);
  });
  it('SHOULD converts px value to rem', () => {
    const result = convertToUnit('16', Unit.Rem);
    expect(result).toBe(`1${Unit.Rem}`);
  });
  it('SHOULD converts px value to rem', () => {
    const result = convertToUnit('16', Unit.Percents);
    expect(result).toBe(`0.16${Unit.Percents}`);
  });

  it('SHOULD returns value as is for px unit', () => {
    const result = convertToUnit('16px', Unit.Px);
    expect(result).toBe(`16${Unit.Px}`);
  });

  it('SHOULD converts number value to rem', () => {
    const result = convertToUnit(16, Unit.Rem);
    expect(result).toBe(`1${Unit.Rem}`);
  });
});

describe('getSpacing', () => {
  it('SHOULD returns default span size', () => {
    const result = getSpacing();
    expect(result).toBe(spacing[SizeVariant.Sm]);
  });

  it('SHOULD returns spacing value for valid key', () => {
    const result = getSpacing(SizeVariant.Md);
    expect(result).toBe(spacing[SizeVariant.Md]);
  });

  it('SHOULD converts spacing value to rem', () => {
    const result = getSpacing(SizeVariant.Md, Unit.Rem);
    expect(result).toBe(`1${Unit.Rem}`);
  });

  it('SHOULD converts spacing value to percents', () => {
    const result = getSpacing(SizeVariant.Md, Unit.Percents);
    expect(result).toBe(`0.16${Unit.Percents}`);
  });

  it('SHOULD used as a span sizer default in px', () => {
    const result = getSpacing(3);
    expect(result).toBe('12px');
  });

  it('SHOULD used as a span sizer in rem', () => {
    const result = getSpacing(3, Unit.Rem);
    expect(result).toBe(`0.75${Unit.Rem}`);
  });

  it('SHOULD used as a span sizer in rem', () => {
    const result = getSpacing(3, Unit.Percents);
    expect(result).toBe(`0.12${Unit.Percents}`);
  });
});

describe('hexToRgba', () => {
  it('SHOULD converts 3-digit hex to rgba', () => {
    const result = hexToRgba('#abc');
    expect(result).toBe('rgba(170, 187, 204, 1)');
  });

  it('SHOULD converts 6-digit hex to rgba', () => {
    const result = hexToRgba('#aabbcc');
    expect(result).toBe('rgba(170, 187, 204, 1)');
  });

  it('SHOULD applies alpha value correctly', () => {
    const result = hexToRgba('#aabbcc', 0.5);
    expect(result).toBe('rgba(170, 187, 204, 0.5)');
  });

  it('SHOULD handles invalid hex length', () => {
    const result = hexToRgba('#abcd');
    expect(result).toBe('rgba(0, 0, 0, 1)');
  });

  it('SHOULD handles invalid hex characters', () => {
    const result = hexToRgba('#zzzzzz');
    expect(result).toBe('rgba(0, 0, 0, 1)');
  });
});

describe('getBoxStyles', () => {
  it('SHOULD return default box styles when no parameters are provided', () => {
    const result = getBoxStyles();
    expect(result).toEqual({ boxStyles: {}, restProps: {} });
  });

  it('SHOULD apply custom margin and padding correctly', () => {
    const result = getBoxStyles({
      margin: spacing[SizeVariant.Md],
      padding: spacing[SizeVariant.Sm],
      border: `1px solid ${colors.primary}`,
      'data-testid': 'test',
      'aria-label': 'test',
      'data-label': 'test',
    });
    expect(result).toEqual({
      boxStyles: {
        margin: spacing[SizeVariant.Md],
        padding: spacing[SizeVariant.Sm],
        border: `1px solid ${colors.primary}`,
      },
      restProps: {
        'data-testid': 'test',
        'aria-label': 'test',
        'data-label': 'test',
      },
    });
  });
});

describe('resolveThemeColor', () => {
  it('SHOULD resolve theme token paths before returning a raw color value', () => {
    const result = resolveThemeColor(colors as never, 'text.secondary');

    expect(result).toBe(colors.text.secondary);
  });

  it('SHOULD resolve documented brand palette aliases before returning a raw color value', () => {
    const result = resolveThemeColor(colors as never, 'brand.500');

    expect(result).toBe(colors.yellow['50']);
  });

  it('SHOULD resolve theme palette semantic aliases before returning a raw color value', () => {
    const result = resolveThemeColor(colors as never, 'theme.palette.warning.main');

    expect(result).toBe(colors.bg.fill.warning.primary.default);
  });

  it('SHOULD fall back to the provided color value when no token exists', () => {
    const result = resolveThemeColor(colors as never, '#123456');

    expect(result).toBe('#123456');
  });

  it('SHOULD resolve figma-map tokenPath format (color. prefix) to theme value', () => {
    const result = resolveThemeColor(colors as never, 'color.text.secondary');

    expect(result).toBe(colors.text.secondary);
  });
});

describe('getFocusStyles', () => {
  it('SHOULD handle custom border', () => {
    const customBorder = '5px solid #ffff';
    const result = getFocusStyles({ inset: '-2px', border: customBorder });
    const expected = {
      position: 'relative',
      '&::after': {
        border: customBorder,
        borderRadius: undefined,
        content: '""',
        top: '-2px',
        right: '-2px',
        bottom: '-2px',
        left: '-2px',
        position: 'absolute',
      },
    };
    expect(result).toStrictEqual(expected);
  });
});

describe('convertToInlineBoxStyles', () => {
  it('SHOULD include valid keys with their corresponding values', () => {
    const result = convertToInlineBoxStyles({ margin: '10px', padding: '10px', float: 'left' });
    expect(result).toEqual({ $margin: '10px', $padding: '10px', float: 'left' });
  });
  it('SHOULD handle empty input objects correctly', () => {
    const result = convertToInlineBoxStyles({});
    expect(result).toEqual({});
  });
});

describe('getImgSrc', () => {
  it('SHOULD generate the correct URL with default metadata', () => {
    const src = '<svg></svg>';
    const result = getImgSrc(src);
    expect(result).toBe('url("data:image/svg+xml,%3Csvg%3E%3C%2Fsvg%3E")');
  });

  it('SHOULD generate the correct URL with custom metadata', () => {
    const src = '<svg></svg>';
    const metaData = 'data:image/png';
    const result = getImgSrc(src, metaData);
    expect(result).toBe('url("data:image/png,%3Csvg%3E%3C%2Fsvg%3E")');
  });

  it('SHOULD handle an empty source string correctly', () => {
    const src = '';
    const result = getImgSrc(src);
    expect(result).toBe('url("data:image/svg+xml,")');
  });
});

describe('getMediaQuery', () => {
  const expectedStyles = {
    width: '20px',
  };

  it('SHOULD handle min breakpoint', () => {
    const result = getMediaQuery({ min: breakpoints.sm }, expectedStyles);
    const expectedResult = {
      [`@media (min-width: ${breakpoints.sm})`]: {
        width: '20px',
      },
    };
    expect(result).toEqual(expectedResult);
  });
  it('SHOULD handle max breakpoint', () => {
    const result = getMediaQuery({ max: breakpoints.md }, expectedStyles);
    const expectedResult = {
      [`@media (max-width: ${breakpoints.md})`]: {
        width: '20px',
      },
    };
    expect(result).toEqual(expectedResult);
  });
  it('SHOULD handle min and max breakpoint', () => {
    const result = getMediaQuery({ min: breakpoints.lg, max: breakpoints.xl }, expectedStyles);
    const expectedResult = {
      [`@media (min-width: ${breakpoints.lg}) and (max-width: ${breakpoints.xl})`]: {
        width: '20px',
      },
    };
    expect(result).toEqual(expectedResult);
  });

  it('SHOULD return empty object if no breakpoint is provided', () => {
    const result = getMediaQuery({}, expectedStyles);
    expect(result).toEqual({});
  });
});

describe('tokensHandler', () => {
  const mockTheme: Partial<Record<symbol, unknown>> = {
    colors: {
      'bg.fill.primary': '#FFB800',
      'bg.fill.secondary': '#F0A800',
      'text.active': '#FFFFFF',
    },
    spacing: {
      sm: '8px',
      lg: '16px',
    },
    values: {
      borderMedium: '1px',
    },
  };

  describe('handling function', () => {
    it('SHOULD call functions with theme and return result', () => {
      const mockFunction = vi.fn().mockReturnValue('function-result');
      const target = {
        testProp: mockFunction,
      };

      const proxy = new Proxy(target, tokensHandler(mockTheme));
      const result = proxy.testProp;

      expect(mockFunction).toHaveBeenCalledWith(mockTheme);
      expect(result).toBe('function-result');
    });

    it('SHOULD handle functions that return theme-based values', () => {
      const themeFunction = (theme: any) => theme?.colors?.['bg.fill.primary'] || 'fallback-color';

      const target = {
        color: themeFunction,
      };

      const proxy = new Proxy(target, tokensHandler(mockTheme));
      const result = proxy.color;

      expect(result).toBe('#FFB800');
    });

    it('SHOULD handle functions that return path strings when theme value is undefined', () => {
      const themeFunction = (theme: any) => theme?.colors?.notExists || 'colors.bg.fill.secondary';

      const target = {
        color: themeFunction,
      };

      const proxy = new Proxy(target, tokensHandler(mockTheme));
      const result = proxy.color;

      expect(result).toBe('colors.bg.fill.secondary');
    });

    it('SHOULD handle functions with complex theme logic', () => {
      const complexFunction = (theme: any) => {
        const sm = theme?.spacing?.sm;
        const lg = theme?.spacing?.lg;
        if (sm && lg) return `${sm} ${lg}`;
        return 'spacing.sm spacing.lg';
      };

      const target = {
        padding: complexFunction,
      };

      const proxy = new Proxy(target, tokensHandler(mockTheme));
      const result = proxy.padding;

      expect(result).toBe('8px 16px');
    });
  });

  describe('object handling', () => {
    it('SHOULD recursively wrap objects in new proxies', () => {
      const target = {
        level1: {
          level2: {
            value: 'nested-value',
          },
        },
      };

      const proxy = new Proxy(target, tokensHandler(mockTheme));
      const level1 = proxy.level1;
      const level2 = level1.level2;
      const value = level2.value;

      expect(level1).toBeInstanceOf(Object);
      expect(level2).toBeInstanceOf(Object);
      expect(value).toBe('nested-value');
    });

    it('SHOULD handle nested objects with functions', () => {
      const nestedFunction = (theme: any) => theme?.colors?.['text.active'] || 'colors.text.active';

      const target = {
        nested: {
          color: nestedFunction,
          static: 'static-value',
        },
      };

      const proxy = new Proxy(target, tokensHandler(mockTheme));
      const nested = proxy.nested;
      const color = nested.color;
      const staticValue = nested.static;

      expect(color).toBe('#FFFFFF');
      expect(staticValue).toBe('static-value');
    });

    it('SHOULD handle arrays as objects', () => {
      const target = {
        items: ['item1', 'item2', 'item3'],
      };

      const proxy = new Proxy(target, tokensHandler(mockTheme));
      const items = proxy.items;

      expect(Array.isArray(items)).toBe(true);
      expect(items).toEqual(['item1', 'item2', 'item3']);
    });
  });

  describe('primitive value handling', () => {
    it('SHOULD return primitive values as-is', () => {
      const target = {
        string: 'string-value',
        number: 42,
        boolean: true,
        nullValue: null,
        undefinedValue: undefined,
      };

      const proxy = new Proxy(target, tokensHandler(mockTheme));

      expect(proxy.string).toBe('string-value');
      expect(proxy.number).toBe(42);
      expect(proxy.boolean).toBe(true);
      expect(proxy.nullValue).toBe(null);
      expect(proxy.undefinedValue).toBe(undefined);
    });

    it('SHOULD handle symbol properties', () => {
      const target = {
        [Symbol.for('test')]: 'symbol-value',
      };

      const proxy = new Proxy(target, tokensHandler(mockTheme));
      const result = proxy[Symbol.for('test')];

      expect(result).toBe('symbol-value');
    });
  });

  describe('edge cases', () => {
    it('SHOULD handle empty theme object', () => {
      const emptyTheme = {};
      const target = {
        test: (theme: any) => theme?.missing?.value || 'fallback',
      };

      const proxy = new Proxy(target, tokensHandler(emptyTheme));
      const result = proxy.test;

      expect(result).toBe('fallback');
    });

    it('SHOULD handle null theme', () => {
      const target = {
        test: (theme: any) => theme?.missing?.value || 'fallback',
      };

      const proxy = new Proxy(target, tokensHandler(null as any));
      const result = proxy.test;

      expect(result).toBe('fallback');
    });

    it('SHOULD handle undefined theme', () => {
      const target = {
        test: (theme: any) => theme?.missing?.value || 'fallback',
      };

      const proxy = new Proxy(target, tokensHandler(undefined as any));
      const result = proxy.test;

      expect(result).toBe('fallback');
    });

    it('SHOULD handle functions that throw errors', () => {
      const errorFunction = () => {
        throw new Error('Test error');
      };

      const target = {
        error: errorFunction,
      };

      const proxy = new Proxy(target, tokensHandler(mockTheme));

      expect(() => proxy.error).toThrow('Test error');
    });

    it('SHOULD handle functions that return undefined', () => {
      const undefinedFunction = () => undefined;

      const target = {
        undefined: undefinedFunction,
      };

      const proxy = new Proxy(target, tokensHandler(mockTheme));
      const result = proxy.undefined;

      expect(result).toBe(undefined);
    });
  });

  describe('real-world button token scenarios', () => {
    it('SHOULD handle button token structure with theme-based borders', () => {
      const buttonTokens = {
        default: {
          border: (theme: any) => theme?.borders?.none || 'borders.none',
          padding: (theme: any) => {
            const sm = theme?.spacing?.sm;
            const lg = theme?.spacing?.lg;
            if (sm && lg) return `${sm} ${lg}`;
            return 'spacing.sm spacing.lg';
          },
        },
        [Symbol.for('variant')]: {
          primary: {
            border: (theme: any) => theme?.borders?.generic || 'borders.generic',
            background: (theme: any) => theme?.colors?.['bg.fill.primary'] || 'colors.bg.fill.primary',
          },
        },
      };

      const proxy = new Proxy(buttonTokens, tokensHandler(mockTheme));

      // Test default properties
      const defaultProps = proxy.default;
      expect(defaultProps.border).toBe('borders.none');
      expect(defaultProps.padding).toBe('8px 16px');

      // Test variant properties
      const variant = proxy[Symbol.for('variant')];
      const primary = variant.primary;
      expect(primary.border).toBe('borders.generic');
      expect(primary.background).toBe('#FFB800');
    });

    it('SHOULD handle complex nested button structure', () => {
      const complexButtonTokens = {
        [Symbol.for('contained')]: {
          [Symbol.for('primary')]: {
            border: (theme: any) => theme?.borders?.generic || 'borders.generic',
            '&:hover': {
              border: (theme: any) => theme?.borders?.generic || 'borders.generic',
              background: (theme: any) => theme?.colors?.['bg.fill.secondary'] || 'colors.bg.fill.secondary',
            },
            '&:disabled': {
              border: (theme: any) => theme?.borders?.generic || 'borders.generic',
              background: (theme: any) => theme?.colors?.['bg.fill.disabled'] || 'colors.bg.fill.disabled',
            },
          },
        },
      };

      const proxy = new Proxy(complexButtonTokens, tokensHandler(mockTheme));
      const contained = proxy[Symbol.for('contained')];
      const primary = contained[Symbol.for('primary')];
      const hover = primary['&:hover'];
      const disabled = primary['&:disabled'];

      expect(primary.border).toBe('borders.generic');
      expect(hover.border).toBe('borders.generic');
      expect(hover.background).toBe('#F0A800');
      expect(disabled.border).toBe('borders.generic');
      expect(disabled.background).toBe('colors.bg.fill.disabled');
    });
  });

  describe('performance and memory', () => {
    it('SHOULD not create infinite loops with circular references', () => {
      const circular: any = {
        self: null,
        value: 'test',
      };
      circular.self = circular;

      const proxy = new Proxy(circular, tokensHandler(mockTheme));

      // This should not throw or cause infinite loops
      expect(() => {
        const value = proxy.value;
        expect(value).toBe('test');
      }).not.toThrow();
    });

    it('SHOULD handle large nested structures efficiently', () => {
      const largeStructure: any = {
        level0: {
          value: 0,
          level1: {
            value: 1,
            level2: {
              value: 2,
              level3: {
                value: 3,
                level4: {
                  value: 4,
                },
              },
            },
          },
        },
      };

      const proxy = new Proxy(largeStructure, tokensHandler(mockTheme));

      // Access deep nested property
      const level0 = proxy.level0;
      const level1 = level0.level1;
      const level2 = level1.level2;
      const level3 = level2.level3;
      const level4 = level3.level4;

      expect(level0.value).toBe(0);
      expect(level1.value).toBe(1);
      expect(level2.value).toBe(2);
      expect(level3.value).toBe(3);
      expect(level4.value).toBe(4);
    });
  });
});
