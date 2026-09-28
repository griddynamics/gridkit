import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { avatar } from 'gd-design-library/tokens';
import { get, resolveThemeTree, type DesignCoreTheme } from 'gd-design-core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface ResolvedAvatarTokens {
  default: { borderRadius: string; position: string; width: number; height: number };
  imageWrapper: {
    default: {
      borderRadius: string;
      overflow: string;
      height: string;
      width: string;
      alignContent: string;
      backgroundColor: string;
    };
  };
  badge: {
    default: Record<string, string | number>;
    size: Record<Exclude<AvatarSize, 'xxl'>, Record<string, string | number>>;
  };
}

function resolveAvatarTokens(theme: DesignCoreTheme, size: AvatarSize): ResolvedAvatarTokens {
  const resolved = resolveThemeTree(avatar, theme) as unknown as ResolvedAvatarTokens & {
    size: Partial<Record<AvatarSize, { width: number; height: number }>>;
  };
  const dimensions = resolved.size[size] ?? resolved.size.md!;
  return { ...resolved, default: { ...resolved.default, ...dimensions } };
}

/** Resolves GridKit token paths while leaving ordinary CSS colours untouched. */
function resolveColor(theme: DesignCoreTheme, color: string | undefined, fallback: string): string {
  return color ? (get(theme, `colors.${color}`, color) as string) : fallback;
}

function cssLengths(values: Record<string, string | number>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, typeof value === 'number' ? `${value}px` : value])
  );
}

/**
 * Framework-neutral Avatar port. `src`, `alt`, `size`, `with-badge`, `badge-color`,
 * `background-color`, and scalar `fallback` are reflected attributes; `theme` is an object
 * property. Rich fallback content uses the `fallback` slot. The inner image's load failure is
 * browser-owned and causes fallback content to replace it, matching the React component.
 */
@customElement('gd-avatar')
export class GdAvatar extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    .avatar {
      box-sizing: border-box;
    }
    .image-wrapper {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .fallback {
      width: 100%;
      height: 100%;
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .fallback-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .badge {
      box-sizing: border-box;
    }
  `;

  @property({ type: String, reflect: true }) src?: string;
  @property({ type: String, reflect: true }) alt = '';
  @property({ type: String, reflect: true }) size: AvatarSize = 'md';
  @property({ type: Boolean, attribute: 'with-badge', reflect: true }) withBadge = false;
  @property({ type: String, attribute: 'badge-color', reflect: true }) badgeColor = 'bg.fill.success.primary.default';
  @property({ type: String, attribute: 'background-color', reflect: true }) backgroundColor?: string;
  @property({ type: String, reflect: true }) fallback?: string;
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  @state() private _failed = false;
  @state() private _hasFallbackSlot = false;

  private _onImageError() {
    this._failed = true;
  }
  private _onImageLoad() {
    this._failed = false;
  }
  private _onFallbackSlotChange(event: Event) {
    this._hasFallbackSlot = (event.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  }

  render() {
    const tokens = resolveAvatarTokens(this.theme, this.size);
    const fallbackFontSize = get(
      this.theme,
      `font.size.${this.size === 'xs' ? 'caption' : this.size === 'sm' ? 'small' : this.size === 'md' ? 'h6' : this.size === 'lg' ? 'h5' : this.size === 'xl' ? 'h4' : 'h3'}`,
      '16px'
    );
    const hostStyle = cssLengths(tokens.default);
    const imageStyle = {
      ...tokens.imageWrapper.default,
      backgroundColor: resolveColor(this.theme, this.backgroundColor, tokens.imageWrapper.default.backgroundColor),
    };
    const badgeStyle = {
      ...cssLengths(tokens.badge.default),
      ...cssLengths(tokens.badge.size[this.size as Exclude<AvatarSize, 'xxl'>] ?? tokens.badge.size.md),
      backgroundColor: resolveColor(this.theme, this.badgeColor, this.badgeColor),
    };
    const showImage = Boolean(this.src) && !this._failed;
    const showFallback = !showImage;

    return html`
      <div class="avatar" part="avatar" role="img" aria-label=${this.alt} style=${styleMap(hostStyle)}>
        <div class="image-wrapper" part="image-wrapper" style=${styleMap(imageStyle)}>
          ${showImage
            ? html`<img
                part="image"
                src=${this.src!}
                alt=${this.alt}
                @error=${this._onImageError}
                @load=${this._onImageLoad}
              />`
            : showFallback
              ? html`<div class="fallback" part="fallback" aria-label=${this.alt}>
                  ${this._hasFallbackSlot
                    ? html`<slot name="fallback" @slotchange=${this._onFallbackSlotChange}></slot>`
                    : this.fallback !== undefined
                      ? html`<span
                          class="fallback-text"
                          part="fallback-text"
                          style=${styleMap({ fontSize: `${fallbackFontSize}` })}
                          >${this.fallback}</span
                        >`
                      : html`<slot name="fallback" @slotchange=${this._onFallbackSlotChange}></slot>`}
                </div>`
              : nothing}
        </div>
        ${this.withBadge
          ? html`<span class="badge" part="badge" role="status" style=${styleMap(badgeStyle)}></span>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-avatar': GdAvatar;
  }
}
