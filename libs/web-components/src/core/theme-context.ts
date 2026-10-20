import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { ThemeLike } from './theme';

/**
 * Dependency-free equivalent of React's `ThemeContext`: a descendant dispatches this composed,
 * bubbling event on connect, the nearest `gd-theme-provider` answers it, and every later theme
 * change is pushed to the same callback. Composed, so it crosses shadow-DOM boundaries
 * (a `gd-*` element inside another element's shadow root still finds the page's provider).
 */
export const THEME_REQUEST_EVENT = 'gd-theme-request';

/**
 * Fired by a provider when it connects. Consumers that connected before any provider existed
 * (provider element defined later, or attached after its children) listen for it and re-request.
 */
export const THEME_PROVIDER_READY_EVENT = 'gd-theme-provider-ready';

export interface ThemeRequestDetail {
  /** Called immediately with the current theme and again on every change. */
  callback: (theme: ThemeLike) => void;
  /** The provider hands back a function that stops further callbacks. */
  registerUnsubscribe: (unsubscribe: () => void) => void;
}

export class ThemeRequestEvent extends CustomEvent<ThemeRequestDetail> {
  constructor(detail: ThemeRequestDetail) {
    super(THEME_REQUEST_EVENT, { detail, bubbles: true, composed: true });
  }
}

type ThemedHost = ReactiveControllerHost & HTMLElement & { theme: ThemeLike };

const isEmptyTheme = (theme: ThemeLike | undefined): boolean => !theme || Object.keys(theme).length === 0;

// Consumers still waiting for a provider share ONE window listener instead of one each.
const unresolved = new Set<ThemeConsumerController>();
const onProviderReady = () => unresolved.forEach((consumer) => consumer.request());

function track(consumer: ThemeConsumerController) {
  if (typeof window === 'undefined') return;
  if (unresolved.size === 0) window.addEventListener(THEME_PROVIDER_READY_EVENT, onProviderReady);
  unresolved.add(consumer);
}

function untrack(consumer: ThemeConsumerController) {
  if (!unresolved.delete(consumer) || unresolved.size > 0 || typeof window === 'undefined') return;
  window.removeEventListener(THEME_PROVIDER_READY_EVENT, onProviderReady);
}

/**
 * Keeps `host.theme` in sync with the nearest `gd-theme-provider`.
 *
 * An explicitly assigned theme always wins, like passing a custom theme to a single component:
 * the provider only writes `host.theme` while it is still empty or still holds the value the
 * provider itself last wrote. Without any provider nothing changes — `theme` stays `{}`.
 */
export class ThemeConsumerController implements ReactiveController {
  private _unsubscribe?: () => void;
  private _inherited?: ThemeLike;

  constructor(private readonly host: ThemedHost) {
    host.addController(this);
  }

  hostConnected() {
    this.request();
  }

  hostDisconnected() {
    this._unsubscribe?.();
    this._unsubscribe = undefined;
    untrack(this);
  }

  request() {
    if (this._unsubscribe || !this.host.isConnected) return;
    this.host.dispatchEvent(
      new ThemeRequestEvent({
        callback: (theme) => this._apply(theme),
        registerUnsubscribe: (unsubscribe) => {
          this._unsubscribe = unsubscribe;
          untrack(this);
        },
      })
    );
    if (!this._unsubscribe) track(this);
  }

  private _apply(theme: ThemeLike) {
    const current = this.host.theme;
    if (isEmptyTheme(current) || current === this._inherited || current === theme) {
      this.host.theme = theme;
    }
    this._inherited = theme;
  }
}
