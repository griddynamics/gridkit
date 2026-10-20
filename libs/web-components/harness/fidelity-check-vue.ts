// Vue peer harness. It deliberately renders the registered custom elements directly.
// eslint-disable-next-line @nx/enforce-module-boundaries
import '../../../dist/libs/ui/styles.css';
import { createApp, h, onMounted, ref } from 'vue';
import type { defaultTheme } from 'gd-design-library/tokens';
import '../src/index';
import { darkTheme } from './dark-theme';

type Item = { name: string; value: string };
const items: Item[] = [
  { name: 'Alpha', value: 'a' },
  { name: 'Beta', value: 'b' },
  { name: 'Gamma', value: 'c' },
];
const portrait =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%2391b8d8"/%3E%3Ccircle cx="32" cy="24" r="13" fill="%23f1c7a5"/%3E%3Cpath d="M8 64c3-18 14-27 24-27s21 9 24 27" fill="%233e6184"/%3E%3C/svg%3E';
interface ThemeSwitcher extends HTMLElement {
  themeNames: string[];
  addTheme(name: string, theme: unknown): void;
  setTheme(name: string): void;
}

const section = (title: string, children: ReturnType<typeof h>[]) =>
  h('section', [h('h3', title), h('div', { class: 'row' }, children)]);

const App = {
  setup() {
    const inputValue = ref('Default Input'),
      checked = ref(true),
      selectedItem = ref<Item | null>(null),
      menuValue = ref('None'),
      counterValue = ref(1),
      activeTheme = ref('default'),
      pageBackground = ref('transparent'),
      pageColor = ref('inherit');
    const onToggleTheme = (event: Event) => {
      // Keep the toggle's own change from reaching the root listener that drives the Checkbox demo.
      event.stopPropagation();
      const provider = document.querySelector<ThemeSwitcher>('#theme-provider')!;
      const dark = (event as CustomEvent<{ checked: boolean }>).detail.checked;
      if (!provider.themeNames.includes('dark')) provider.addTheme('dark', darkTheme);
      provider.setTheme(dark ? 'dark' : 'default');
    };
    const onThemeChange = (event: Event) => {
      const { name, theme } = (event as CustomEvent<{ name: string; theme: typeof defaultTheme }>).detail;
      activeTheme.value = name;
      // Page chrome follows the active theme's own background/text tokens (default stays unpainted
      // so the light render still matches the React baseline).
      pageBackground.value = name === 'default' ? 'transparent' : theme.colors.bg.default;
      pageColor.value = name === 'default' ? 'inherit' : theme.colors.text.default;
    };
    onMounted(() => {
      const root = document.querySelector('#app')!;
      root.addEventListener('gd-input', (event) => {
        inputValue.value = (event as CustomEvent<{ value: string }>).detail.value;
      });
      root.addEventListener('gd-change', (event) => {
        const detail = (event as CustomEvent<{ checked?: boolean; value?: Item | number | null; data?: Item }>).detail;
        if (typeof detail.checked === 'boolean') checked.value = detail.checked;
        if (typeof detail.value === 'number') counterValue.value = detail.value;
        if (detail.data) menuValue.value = `${detail.data.name} (${detail.data.value})`;
        else if (detail.value && typeof detail.value === 'object') selectedItem.value = detail.value;
      });
    });
    return () =>
      h('gd-theme-provider', { id: 'theme-provider', 'is-default': true, onGdThemeChange: onThemeChange }, [
        h(
          'main',
          {
            id: 'harness-page',
            style: {
              padding: '24px',
              minHeight: '100vh',
              background: pageBackground.value,
              color: pageColor.value,
              transition: 'background 0.2s ease-in-out, color 0.2s ease-in-out',
            },
          },
          [
            h(
              'section',
              {
                class: 'toolbar',
                style: {
                  position: 'sticky',
                  top: '0',
                  zIndex: '1',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  margin: '-24px -24px 24px',
                  padding: '12px 24px',
                  borderBottom: '1px solid currentColor',
                  background: pageBackground.value === 'transparent' ? '#fff' : pageBackground.value,
                },
              },
              [
                h(
                  'gd-switch',
                  { id: 'theme-toggle', checked: activeTheme.value === 'dark', onGdChange: onToggleTheme },
                  'Dark theme'
                ),
                h('output', { id: 'theme-active' }, `Active theme: ${activeTheme.value}`),
              ]
            ),
            section('Input — controlled value', [
              h('gd-input', {
                id: 'input-repro',
                label: 'Label',
                'helper-text': 'Helper text',
                color: 'primary',
                value: inputValue.value,
              }),
            ]),
            section('Button — primary / secondary / outlined / disabled / loading', [
              h('gd-button', { variant: 'primary' }, 'Primary'),
              h('gd-button', { variant: 'secondary' }, 'Secondary'),
              h('gd-button', { variant: 'outlined' }, 'Outlined'),
              h('gd-button', { variant: 'primary', disabled: true }, 'Disabled'),
              h('gd-button', { variant: 'primary', isLoading: true }, 'Loading'),
            ]),
            section('Checkbox — default / checked / indeterminate / disabled', [
              h('gd-checkbox', {}),
              h('gd-checkbox', { checked: checked.value }, 'Checked'),
              h('gd-checkbox', { indeterminate: true }, 'Indeterminate'),
              h('gd-checkbox', { disabled: true, checked: true }, 'Disabled'),
            ]),
            section('Typography — h1 / h2 / p', [
              h('div', [
                h('gd-typography', { variant: 'h1', as: 'h1' }, 'Heading 1'),
                h('gd-typography', { variant: 'h2', as: 'h2' }, 'Heading 2'),
                h('gd-typography', { variant: 'p', as: 'p' }, 'Body paragraph text for comparison.'),
              ]),
            ]),
            section('Select — trigger + dropdown', [h('gd-select', { items, value: selectedItem.value })]),
            section('Avatar — image / fallback / badge / sizes', [
              h('gd-avatar', { src: portrait, alt: 'Ada Lovelace', size: 'md' }),
              h('gd-avatar', { fallback: 'AL', alt: 'Ada Lovelace', size: 'lg' }),
              h('gd-avatar', {
                fallback: 'GD',
                alt: 'GridKit',
                size: 'xl',
                withBadge: true,
                badgeColor: 'bg.fill.success.primary.default',
                backgroundColor: 'bg.fill.info.primary.default',
              }),
              h('gd-avatar', { alt: 'Custom fallback', size: 'sm' }, [h('span', { slot: 'fallback' }, '★')]),
            ]),
            section('Menu — popover, selection, and light dismiss', [
              h('gd-menu', {}, [
                h('span', { slot: 'trigger' }, 'Actions ▾'),
                h('div', { slot: 'content' }, [
                  h('button', { 'data-gd-menu-name': 'Edit', 'data-gd-menu-value': 'edit' }, 'Edit'),
                  h('button', { 'data-gd-menu-name': 'Archive', 'data-gd-menu-value': 'archive' }, 'Archive'),
                ]),
              ]),
              h('output', `Selected: ${menuValue.value}`),
            ]),
            section('Counter — quantity control', [
              h('gd-counter', { min: 1, max: 5, initial: 1 }),
              h('output', `Value: ${counterValue.value}`),
            ]),
            section('Box — vertical / horizontal / bordered / highlighted', [
              h('gd-box', { variant: 'vertical' }, 'Vertical box'),
              h('gd-box', { variant: 'horizontal', isBordered: true }, 'Bordered horizontal box'),
              h('gd-box', { isBordered: true, isHighlighted: true, withShadowHover: true }, 'Interactive box'),
            ]),
            section('Badge — variants / sizes / icons / disabled', [
              h('gd-badge', { variant: 'primary', appearance: 'filled', size: 'xs' }, 'Primary'),
              h('gd-badge', { variant: 'secondary', appearance: 'outline', size: 'md' }, [
                h('span', { slot: 'icon-start' }, '★'),
                'With icon',
              ]),
              h('gd-badge', { variant: 'tertiary', appearance: 'filledLight', size: 'lg', disabled: true }, 'Disabled'),
            ]),
            section('Image — image / caption / fallback', [
              h('gd-image', {
                src: portrait,
                alt: 'Ada Lovelace',
                width: 96,
                height: 96,
                caption: 'Portrait',
              }),
              h('gd-image', { src: '/missing-image.png', alt: 'Unavailable image', width: 96, height: 96 }, [
                h('span', { slot: 'fallback' }, 'Image unavailable'),
              ]),
            ]),
            section('Icon — shared React/Web Components catalog', [
              h('gd-icon', { name: 'star', size: 'xs' }),
              h('gd-icon', { name: 'search', size: 'md' }),
              h('gd-icon', { name: 'edit', size: 'xl', 'aria-label': 'Edit' }),
            ]),
            section('InputFile — default / multiple / accept / icon', [
              h('gd-input-file', {}, 'Browse Files'),
              h('gd-input-file', { multiple: true, accept: 'image/*' }, 'Choose images'),
              h('gd-input-file', { isIcon: true, 'aria-label': 'Upload file' }, [h('gd-icon', { name: 'upload' })]),
              h('gd-input-file', { disabled: true }, 'Disabled'),
            ]),
            section('Label — text / icon / association', [
              h('gd-label', { for: 'vue-labelled-input' }, 'Account name'),
              h('input', { id: 'vue-labelled-input' }),
              h('gd-label', {}, [h('gd-icon', { name: 'star' }), ' Required label']),
            ]),
            section('Link — variants / underline / size / disabled', [
              h('gd-link', { href: '#vue-link', variant: 'primary', size: 'sm' }, 'Primary'),
              h(
                'gd-link',
                { href: '#vue-link', variant: 'inherit', underline: 'highlight', size: 'md' },
                'Highlighted'
              ),
              h('gd-link', { variant: 'inverted', size: 'lg', disabled: true }, 'Disabled'),
            ]),
            section('Loader — circle / dots / sizes / wrapper variants', [
              h('gd-loader', { name: 'circle', size: 'xs' }),
              h('gd-loader', { name: 'dots', size: 'md', rounded: 'round' }),
              h('gd-loader', { name: 'circle', size: 'lg', variant: 'inline' }),
              h('gd-loader', { name: 'circle', size: 'sm', withWrapper: false }),
            ]),
            section('Separator — horizontal / vertical / labels / variants', [
              h('gd-separator', { length: '180px' }),
              h('gd-separator', {
                length: '180px',
                label: 'OR',
                labelPosition: 'center',
                size: 'md',
                variant: 'dashed',
              }),
              h('gd-separator', { length: '80px', orientation: 'vertical', label: 'Or', size: 'md' }),
            ]),
            section('Skeleton — rounded / circular / rectangular / children', [
              h('gd-skeleton', { width: '180px', height: '15px' }),
              h('gd-skeleton', { width: '60px', height: '60px', variant: 'circular' }),
              h(
                'gd-skeleton',
                {
                  width: '180px',
                  height: '50px',
                  variant: 'rectangular',
                  backgroundColor: 'theme.palette.success.main',
                },
                'Loading Content...'
              ),
            ]),
            section('Slider / dots — range and carousel navigation', [
              h('gd-slider', { min: 0, max: 100, value: 45, 'aria-label': 'Volume' }),
              h('gd-slider-dots', { count: 5, activeIndex: 1 }),
            ]),
            section('Switch — default / checked / loading', [
              h('gd-switch', {}, 'Notifications'),
              h('gd-switch', { checked: true, label: 'left' }, 'Enabled'),
              h('gd-switch', { isLoading: true }, 'Saving'),
            ]),
            section('Textarea — colors / counter / resize', [
              h('gd-textarea', { placeholder: 'Comment' }),
              h('gd-textarea', { color: 'success', maxCharacters: 100, defaultValue: 'Looks good' }),
              h('gd-textarea', { resize: 'both', rows: 3 }),
            ]),
            section('Toggle — selected / disabled', [
              h('gd-toggle', { items: ['Option 1', 'Option 2', 'Option 3'], value: 'Option 1' }),
              h('gd-toggle', {
                items: ['Option 1', 'Option 2', 'Option 3'],
                value: 'Option 2',
                disabled: true,
              }),
            ]),
            section('Truncate — single / multiple lines', [
              h('gd-truncate', { style: 'width: 180px' }, 'A long single-line value that must be truncated.'),
              h(
                'gd-truncate',
                { style: 'width: 180px', lines: 2 },
                'A longer block of content constrained to two lines for the Vue integration harness.'
              ),
            ]),
            section('Wrapper — inline / section', [
              h('gd-wrapper', { variant: 'inline' }, 'Inline content'),
              h('gd-wrapper', { variant: 'inline', as: 'section' }, 'Section content'),
            ]),
            section('Layout — Column / Row / FlexContainer', [
              h('gd-column', { width: '180px', gutter: 8, align: 'center', isWrap: false }, [
                h('span', 'Column one'),
                h('span', 'Column two'),
              ]),
              h('gd-row', { width: '240px', gutter: 8, justify: 'between', isReversed: true }, [
                h('span', 'Row one'),
                h('span', 'Row two'),
              ]),
              h(
                'gd-flex-container',
                {
                  gap: '8px',
                  flexDirection: 'row',
                  styles: { padding: '8px', backgroundColor: '#f0f4f8' },
                },
                [h('span', 'Flex one'), h('span', 'Flex two')]
              ),
            ]),
            section('ChatContainer — slots / event / imperative state', [
              h(
                'gd-chat-container',
                {
                  style: 'width:520px;height:220px',
                  onGdToggleSidebar: (event: CustomEvent<{ open: boolean }>) =>
                    console.log('Chat sidebar open:', event.detail.open),
                },
                [
                  h('strong', { slot: 'sidebar-header' }, 'History'),
                  h('span', { slot: 'sidebar' }, 'Vue sidebar'),
                  h('span', { slot: 'sidebar-minified' }, 'Compact'),
                  h('strong', { slot: 'header' }, 'Assistant'),
                  h('span', 'Vue chat content'),
                ]
              ),
            ]),
            section('Portal — direct body target / wrapper options', [
              h(
                'gd-portal',
                {
                  container: document.body,
                  withWrapper: false,
                  blocksScroll: false,
                  WrapperView: 'main',
                },
                [h('span', 'Vue portal content')]
              ),
            ]),
            section('Scroll — vertical / horizontal / auto-hide', [
              h(
                'gd-scroll',
                {
                  vertical: 'visible',
                  horizontal: 'auto',
                  autoHide: true,
                  styles: { width: '180px', height: '120px', border: '1px solid #a0aec0' },
                },
                [h('div', { style: 'width:360px;height:240px' }, 'Vue scroll content')]
              ),
            ]),
          ]
        ),
      ]);
  },
};

createApp(App).mount('#app');
