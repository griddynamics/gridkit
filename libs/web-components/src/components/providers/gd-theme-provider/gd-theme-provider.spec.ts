import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import { GdThemeProvider } from './gd-theme-provider';
import '../../atoms/gd-button/gd-button';
import '../../atoms/gd-label/gd-label';

type Themed = HTMLElement & { theme: Record<string, unknown>; updateComplete: Promise<unknown> };

const fill = (defaultTheme as { colors: { bg: { fill: Record<string, unknown> } } }).colors.bg.fill;
const darkTheme = {
  ...defaultTheme,
  name: 'dark',
  colors: {
    ...defaultTheme.colors,
    bg: { ...defaultTheme.colors.bg, fill: { ...fill, primary: '#112233' } },
  },
} as Record<string, unknown>;

let host: HTMLDivElement;

// gd-button animates `background` over 0.2s, so computed colours are only final after that.
const settle = async (...els: Themed[]) => {
  await Promise.all(els.map((el) => el.updateComplete));
  await new Promise((resolve) => setTimeout(resolve, 300));
};
const innerBg = (el: Themed) => getComputedStyle(el.shadowRoot!.querySelector('button')!).backgroundColor;

function mount(html: string) {
  host.innerHTML = html;
  return {
    provider: host.querySelector('gd-theme-provider') as GdThemeProvider,
    button: host.querySelector('gd-button') as Themed,
  };
}

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
});
afterEach(() => {
  host.remove();
  vi.restoreAllMocks();
});

describe('gd-theme-provider', () => {
  it('gives descendants the default theme with is-default and no per-element theme', async () => {
    const { provider, button } = mount('<gd-theme-provider is-default><gd-button>Go</gd-button></gd-theme-provider>');
    await settle(provider, button);
    expect(button.theme.name).toBe('default');
    expect(provider.activeThemeName).toBe('default');
  });

  it('re-renders descendants when setTheme switches to an added theme, like React useTheme().setTheme', async () => {
    const { provider, button } = mount('<gd-theme-provider is-default><gd-button>Go</gd-button></gd-theme-provider>');
    await settle(provider, button);
    const before = innerBg(button);

    provider.addTheme('dark', darkTheme);
    expect(provider.themeNames).toEqual(['dark', 'default']);
    expect(provider.activeThemeName).toBe('default');

    provider.setTheme('dark');
    await settle(provider, button);
    expect(button.theme.name).toBe('dark');
    expect(innerBg(button)).toBe('rgb(17, 34, 51)');
    expect(innerBg(button)).not.toBe(before);

    provider.setTheme('default');
    await settle(provider, button);
    expect(innerBg(button)).toBe(before);
  });

  it('switches declaratively through the theme-name attribute', async () => {
    const { provider, button } = mount('<gd-theme-provider is-default><gd-button>Go</gd-button></gd-theme-provider>');
    provider.addTheme('dark', darkTheme);
    await settle(provider, button);
    provider.setAttribute('theme-name', 'dark');
    await settle(provider, button);
    expect(button.theme.name).toBe('dark');
  });

  it('reverts to the initial theme and warns for an unknown name (React parity)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { provider, button } = mount('<gd-theme-provider is-default><gd-button>Go</gd-button></gd-theme-provider>');
    provider.addTheme('dark', darkTheme);
    provider.setTheme('dark');
    await settle(provider, button);

    provider.setTheme('missing');
    await settle(provider, button);
    expect(warn).toHaveBeenCalled();
    expect(button.theme.name).toBe('default');
  });

  it('skips addTheme for an existing name and never switches on add', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { provider } = mount('<gd-theme-provider is-default></gd-theme-provider>');
    provider.addTheme('default', darkTheme);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(provider.theme).toBe(defaultTheme);
  });

  it('uses initialTheme when given', async () => {
    const provider = document.createElement('gd-theme-provider') as GdThemeProvider;
    provider.initialTheme = darkTheme;
    const label = document.createElement('gd-label') as Themed;
    provider.append(label);
    host.append(provider);
    await settle(provider, label);
    expect(provider.activeThemeName).toBe('dark');
    expect(label.theme.name).toBe('dark');
  });

  it('keeps a theme assigned directly on an element, even when the provider switches', async () => {
    const provider = document.createElement('gd-theme-provider') as GdThemeProvider;
    provider.isDefault = true;
    const pinned = document.createElement('gd-label') as Themed;
    pinned.theme = darkTheme;
    const inherited = document.createElement('gd-label') as Themed;
    provider.append(pinned, inherited);
    host.append(provider);
    provider.addTheme('other', { ...defaultTheme, name: 'other' } as Record<string, unknown>);
    await settle(provider, pinned, inherited);
    expect(pinned.theme.name).toBe('dark');
    expect(inherited.theme.name).toBe('default');

    provider.setTheme('other');
    await settle(provider, pinned, inherited);
    expect(pinned.theme.name).toBe('dark');
    expect(inherited.theme.name).toBe('other');
  });

  it('nested providers: the nearest one wins', async () => {
    host.innerHTML = `<gd-theme-provider is-default>
      <gd-label id="outer"></gd-label>
      <gd-theme-provider id="inner"><gd-label id="inside"></gd-label></gd-theme-provider>
    </gd-theme-provider>`;
    const inner = host.querySelector('#inner') as GdThemeProvider;
    inner.initialTheme = darkTheme;
    const outerLabel = host.querySelector('#outer') as Themed;
    const insideLabel = host.querySelector('#inside') as Themed;
    await settle(inner, outerLabel, insideLabel);
    expect(outerLabel.theme.name).toBe('default');
    expect(insideLabel.theme.name).toBe('dark');
  });

  it('reaches elements inside another element’s shadow root', async () => {
    const provider = document.createElement('gd-theme-provider') as GdThemeProvider;
    provider.isDefault = true;
    const shell = document.createElement('div');
    const root = shell.attachShadow({ mode: 'open' });
    const label = document.createElement('gd-label') as Themed;
    root.append(label);
    provider.append(shell);
    host.append(provider);
    provider.addTheme('dark', darkTheme);
    await settle(provider, label);
    expect(label.theme.name).toBe('default');
    provider.setTheme('dark');
    await settle(provider, label);
    expect(label.theme.name).toBe('dark');
  });

  it('resolves descendants that connected before the provider element was defined', async () => {
    class LateProvider extends GdThemeProvider {}
    host.innerHTML = '<gd-late-provider is-default><gd-label></gd-label></gd-late-provider>';
    const label = host.querySelector('gd-label') as Themed;
    await settle(label);
    expect(label.theme.name).toBeUndefined();

    customElements.define('gd-late-provider', LateProvider);
    await settle(label);
    expect(label.theme.name).toBe('default');
  });

  it('announces gd-theme-change with the new theme', async () => {
    const { provider } = mount('<gd-theme-provider is-default></gd-theme-provider>');
    await provider.updateComplete;
    provider.addTheme('dark', darkTheme);
    const seen: string[] = [];
    provider.addEventListener('gd-theme-change', (event) => seen.push((event as CustomEvent).detail.name));
    provider.setTheme('dark');
    await provider.updateComplete;
    expect(seen).toEqual(['dark']);
  });
});
