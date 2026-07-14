import { describe, expect, it } from 'vitest';
import { buildA2UISystemPrompt } from './system-prompt';

describe('A2UI system prompt', () => {
  it('SHOULD include custom components in the prompt and group them by category', () => {
    const prompt = buildA2UISystemPrompt({
      customComponents: [
        {
          type: 'product-badge',
          description: 'Displays a colored status badge with a short label.',
          props: {
            label: 'string — badge text',
            color: '"success" | "warning" | "error" | "info" — background color token',
          },
          notes: ['Always set label. Omit color to use the default neutral style.'],
          category: 'Commerce',
        },
      ],
    });

    expect(prompt).toContain('### Commerce');
    expect(prompt).toContain('"product-badge": Displays a colored status badge with a short label.');
    expect(prompt).toContain('label (string)');
    expect(prompt).toContain('color ("success" | "warning" | "error" | "info")');
    expect(prompt).toContain('→ Always set label. Omit color to use the default neutral style.');
  });

  it('SHOULD ignore custom components that collide with built-in component types', () => {
    const prompt = buildA2UISystemPrompt({
      customComponents: [
        {
          type: 'button',
          description: 'OVERRIDE BUTTON SHOULD NOT APPEAR',
        },
      ],
    });

    expect(prompt).not.toContain('OVERRIDE BUTTON SHOULD NOT APPEAR');
  });

  it('SHOULD include image sourcing guidance by default', () => {
    const prompt = buildA2UISystemPrompt();

    expect(prompt).toContain('IMAGE URL RULES');
    expect(prompt).toContain('any public CDN');
    expect(prompt).not.toContain('images.unsplash.com');
  });

  it('SHOULD accept imageSources as a string or array', () => {
    const promptWithString = buildA2UISystemPrompt({ imageSources: 'cdn.example.com' });
    const promptWithArray = buildA2UISystemPrompt({ imageSources: ['cdn.example.com', 'images.example.com'] });

    expect(promptWithString).toContain('ALLOWED HOSTS ONLY');
    expect(promptWithString).toContain('cdn.example.com');
    expect(promptWithArray).toContain('cdn.example.com');
    expect(promptWithArray).toContain('images.example.com');
  });

  it('SHOULD include theme token guidance for component color props', () => {
    const prompt = buildA2UISystemPrompt();

    expect(prompt).toContain('For any free-form component color props');
    expect(prompt).toContain('Header.bgColor');
    expect(prompt).toContain('ProgressBar fillColor/backgroundColor');
    expect(prompt).toContain('Chart colors and series[].color');
  });

  it('SHOULD expose all organism A2UI types and their structured slot props', () => {
    const prompt = buildA2UISystemPrompt();

    expect(prompt).toContain('"input-area"');
    expect(prompt).toContain('"drag-and-drop-files"');
    expect(prompt).toContain('"image-preview"');
    expect(prompt).toContain('"sidebar"');
    expect(prompt).toContain('logoChildren');
    expect(prompt).toContain('actionChildren');
    expect(prompt).toContain('dragOverChildren');
    expect(prompt).toContain('children[]: box, wrapper, portal, card, modal');
    expect(prompt).toContain('image-preview, input-area');
  });

  it('SHOULD include caption nesting guidance for typography', () => {
    const prompt = buildA2UISystemPrompt();

    expect(prompt).toContain('NEVER use typography variant="caption" inside normal div/card/row/column/flex layouts');
    expect(prompt).toContain('set as="div" for block metadata or as="span" for inline metadata');
  });

  it('SHOULD include carousel routing guidance for gallery and repeated-item prompts', () => {
    const prompt = buildA2UISystemPrompt();

    expect(prompt).toContain('KEYWORD → COMPONENT mapping');
    expect(prompt).toContain('"context carousel" or "content carousel"');
    expect(prompt).toContain('"generate carousel 7 images" → "carousel"');
    expect(prompt).toContain('Trigger: the word "carousel" WITHOUT the prefix "context" or "content"');
    expect(prompt).toContain('If the request is vertical, use "carousel" instead');
    expect(prompt).toContain('content MUST go in children[]');
    expect(prompt).toContain('NEVER emit React-only fields like');
    expect(prompt).toContain('"preview for images", "preview of images", "image preview"');
    expect(prompt).toContain('"create a context carousel for product cards" → "content-carousel"');
    expect(prompt).toContain('"create a carousel for images" → "carousel"');
    expect(prompt).toContain('"create a preview for images" → "image-preview"');
  });

  it('SHOULD route galleries inside a chat-bubble to chat-image-gallery, not image-preview', () => {
    const prompt = buildA2UISystemPrompt();

    expect(prompt).toContain('"chat-image-gallery"');
    expect(prompt).toContain('"chat bubble component with image gallery containing 2 random images"');
    expect(prompt).toContain('NEVER use "image-preview" as a child of chat-bubble');
    expect(prompt).toContain('"chat-image-gallery" is ONLY valid as a direct child of "chat-bubble"');
  });

  it('SHOULD include drag-and-drop widget prop details and callback guardrails', () => {
    const prompt = buildA2UISystemPrompt();

    expect(prompt).toContain('### Widgets');
    expect(prompt).toContain('"drag-and-drop"');
    expect(prompt).toContain('Prop details:');
    expect(prompt).toContain('inputFileButtonLabel: string');
    expect(prompt).toContain('acceptedFileTypes: string[]');
    expect(prompt).toContain('loadingOverlay: A2UIComponent[]');
    expect(prompt).toContain('NEVER emit React callbacks or refs');
    expect(prompt).toContain('Use actions[] instead.');
  });

  it('SHOULD include portal support and chat-container slot guidance for layout specs', () => {
    const prompt = buildA2UISystemPrompt();

    expect(prompt).toContain('"portal":');
    expect(prompt).toContain('container (string)');
    expect(prompt).toContain('sidebarContent (Component[])');
    expect(prompt).toContain('Only these support children[]: box, wrapper, portal');
    expect(prompt).toContain(
      'chat-container also supports headerContent[], sidebarContent[], sidebarMinifiedContent[]'
    );
  });

  it('SHOULD expose provider, scenario, and segment metadata fields', () => {
    const prompt = buildA2UISystemPrompt({
      provider: 'openai',
      scenario: 'knowledge-sharing',
      segment: 'summary',
    });

    expect(prompt).toContain('metadata.provider, metadata.scenario, and metadata.segment are optional');
    expect(prompt).toContain('Include them only when the application provides them');
    expect(prompt).toContain('metadata.provider, metadata.scenario, and metadata.segment');
    expect(prompt).toContain('across any LLM vendor');
  });

  it('SHOULD include aligned atom guidance for action-based events and top-level text props', () => {
    const prompt = buildA2UISystemPrompt();

    expect(prompt).toContain('styleVariant');
    expect(prompt).toContain('htmlFor');
    expect(prompt).toContain('animationProps');
    expect(prompt).toContain('iconStart');
    expect(prompt).toContain('interactive icon, link, slider, and slider-dots components use actions[]');
  });

  it('SHOULD include avatar-user guidance for subtitle text and trailing actions', () => {
    const prompt = buildA2UISystemPrompt();

    expect(prompt).toContain('"avatar-user"');
    expect(prompt).toContain('subtitle (string)');
    expect(prompt).toContain('actionChildren (Component[])');
  });

  // ── priceFormat ────────────────────────────────────────────────────────────

  describe('priceFormat option', () => {
    it('SHOULD use US convention by default (no locale, no priceFormat)', () => {
      const prompt = buildA2UISystemPrompt();

      expect(prompt).toContain('Price convention: US');
      expect(prompt).toContain('BEFORE the value');
      expect(prompt).toContain('Thousands separator: comma');
      expect(prompt).toContain('Decimal separator: period');
    });

    it('SHOULD use US convention for English locale when no priceFormat given', () => {
      const prompt = buildA2UISystemPrompt({ locale: 'en-US' });

      expect(prompt).toContain('Price convention: US');
      expect(prompt).toContain('inferred from locale "en-US"');
    });

    it('SHOULD auto-detect EU convention for European locale', () => {
      const prompt = buildA2UISystemPrompt({ locale: 'de-DE' });

      expect(prompt).toContain('Price convention: EU');
      expect(prompt).toContain('inferred from locale "de-DE"');
      expect(prompt).toContain('AFTER the value with a space');
      expect(prompt).toContain('Thousands separator: space');
      expect(prompt).toContain('Decimal separator: comma');
    });

    it('SHOULD use EU convention for all supported European locales', () => {
      const euLocales = ['fr-FR', 'it-IT', 'nl-NL', 'pl-PL', 'pt-PT', 'sv-SE', 'fi-FI', 'el-GR'];
      for (const locale of euLocales) {
        const prompt = buildA2UISystemPrompt({ locale });
        expect(prompt).toContain('Price convention: EU');
      }
    });

    it('SHOULD override locale detection when priceFormat="us" is explicit', () => {
      const prompt = buildA2UISystemPrompt({ locale: 'de-DE', priceFormat: 'us' });

      expect(prompt).toContain('Price convention: US');
      expect(prompt).toContain('explicit priceFormat option');
      // Should NOT contain EU-specific rules
      expect(prompt).not.toContain('Thousands separator: space');
    });

    it('SHOULD override locale detection when priceFormat="eu" is explicit', () => {
      const prompt = buildA2UISystemPrompt({ locale: 'en-US', priceFormat: 'eu' });

      expect(prompt).toContain('Price convention: EU');
      expect(prompt).toContain('explicit priceFormat option');
      expect(prompt).toContain('AFTER the value with a space');
    });

    it('SHOULD apply custom priceFormat object', () => {
      const prompt = buildA2UISystemPrompt({
        priceFormat: {
          symbolPosition: 'after',
          decimalSeparator: ',',
          thousandsSeparator: '.',
          trailingZeros: false,
        },
      });

      expect(prompt).toContain('Price convention: custom');
      expect(prompt).toContain('explicit priceFormat option');
      expect(prompt).toContain('AFTER the value with a space');
      expect(prompt).toContain('Decimal separator: ","');
      expect(prompt).toContain('Trailing zeros for whole amounts: NO');
    });

    it('SHOULD apply custom priceFormat with trailingZeros=true', () => {
      const prompt = buildA2UISystemPrompt({
        priceFormat: { symbolPosition: 'before', trailingZeros: true },
      });

      expect(prompt).toContain('Trailing zeros for whole amounts: YES');
    });

    it('SHOULD include currencySymbolPosition="after" instruction for EU preset', () => {
      const prompt = buildA2UISystemPrompt({ priceFormat: 'eu' });

      expect(prompt).toContain('currencySymbolPosition: "after"');
    });

    it('SHOULD include currencySymbolPosition="before" instruction for US preset', () => {
      const prompt = buildA2UISystemPrompt({ priceFormat: 'us' });

      expect(prompt).toContain('currencySymbolPosition: "before"');
    });

    it('SHOULD include concrete price examples for EU preset', () => {
      const prompt = buildA2UISystemPrompt({ priceFormat: 'eu' });

      expect(prompt).toContain('→ "99 €"');
      expect(prompt).toContain('→ "1 299 €"');
      expect(prompt).toContain('→ "29,99 €"');
    });

    it('SHOULD include concrete price examples for US preset', () => {
      const prompt = buildA2UISystemPrompt({ priceFormat: 'us' });

      expect(prompt).toContain('→ "$99"');
      expect(prompt).toContain('→ "$1,299"');
      expect(prompt).toContain('→ "$29.99"');
    });
  });
});
