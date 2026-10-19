import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ThemeConsumerController } from './theme-context';
import type { ThemeLike } from './theme';

/**
 * Base class of every themed `gd-*` element. `theme` can be assigned directly (it then wins) or
 * inherited from the nearest `gd-theme-provider`, so `setTheme()` on a provider re-renders every
 * descendant — the web-component counterpart of React's `ThemeProvider` + `useTheme()`.
 */
export abstract class GdThemedElement extends LitElement {
  @property({ attribute: false }) theme: ThemeLike = {};

  private readonly _themeConsumer = new ThemeConsumerController(this);
}
