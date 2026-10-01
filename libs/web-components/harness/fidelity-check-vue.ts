// Vue peer harness. It deliberately renders the registered custom elements directly.
// eslint-disable-next-line @nx/enforce-module-boundaries
import '../../../dist/libs/ui/styles.css';
import { createApp, h, onMounted, ref } from 'vue';
import { defaultTheme } from 'gd-design-library/tokens';
import '../src/index';

type Item = { name: string; value: string };
const items: Item[] = [
  { name: 'Alpha', value: 'a' },
  { name: 'Beta', value: 'b' },
  { name: 'Gamma', value: 'c' },
];
const portrait =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%2391b8d8"/%3E%3Ccircle cx="32" cy="24" r="13" fill="%23f1c7a5"/%3E%3Cpath d="M8 64c3-18 14-27 24-27s21 9 24 27" fill="%233e6184"/%3E%3C/svg%3E';
const section = (title: string, children: ReturnType<typeof h>[]) =>
  h('section', [h('h3', title), h('div', { class: 'row' }, children)]);

const App = {
  setup() {
    const inputValue = ref('Default Input'),
      checked = ref(true),
      selectedItem = ref<Item | null>(null),
      menuValue = ref('None'),
      counterValue = ref(1);
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
      h('main', [
        section('Input — controlled value', [
          h('gd-input', {
            id: 'input-repro',
            label: 'Label',
            'helper-text': 'Helper text',
            color: 'primary',
            theme: defaultTheme,
            value: inputValue.value,
          }),
        ]),
        section('Button — primary / secondary / outlined / disabled / loading', [
          h('gd-button', { variant: 'primary', theme: defaultTheme }, 'Primary'),
          h('gd-button', { variant: 'secondary', theme: defaultTheme }, 'Secondary'),
          h('gd-button', { variant: 'outlined', theme: defaultTheme }, 'Outlined'),
          h('gd-button', { variant: 'primary', theme: defaultTheme, disabled: true }, 'Disabled'),
          h('gd-button', { variant: 'primary', theme: defaultTheme, isLoading: true }, 'Loading'),
        ]),
        section('Checkbox — default / checked / indeterminate / disabled', [
          h('gd-checkbox', { theme: defaultTheme }),
          h('gd-checkbox', { theme: defaultTheme, checked: checked.value }, 'Checked'),
          h('gd-checkbox', { theme: defaultTheme, indeterminate: true }, 'Indeterminate'),
          h('gd-checkbox', { theme: defaultTheme, disabled: true, checked: true }, 'Disabled'),
        ]),
        section('Typography — h1 / h2 / p', [
          h('div', [
            h('gd-typography', { variant: 'h1', as: 'h1', theme: defaultTheme }, 'Heading 1'),
            h('gd-typography', { variant: 'h2', as: 'h2', theme: defaultTheme }, 'Heading 2'),
            h('gd-typography', { variant: 'p', as: 'p', theme: defaultTheme }, 'Body paragraph text for comparison.'),
          ]),
        ]),
        section('Select — trigger + dropdown', [
          h('gd-select', { items, value: selectedItem.value, theme: defaultTheme }),
        ]),
        section('Avatar — image / fallback / badge / sizes', [
          h('gd-avatar', { src: portrait, alt: 'Ada Lovelace', size: 'md', theme: defaultTheme }),
          h('gd-avatar', { fallback: 'AL', alt: 'Ada Lovelace', size: 'lg', theme: defaultTheme }),
          h('gd-avatar', {
            fallback: 'GD',
            alt: 'GridKit',
            size: 'xl',
            withBadge: true,
            badgeColor: 'bg.fill.success.primary.default',
            backgroundColor: 'bg.fill.info.primary.default',
            theme: defaultTheme,
          }),
          h('gd-avatar', { alt: 'Custom fallback', size: 'sm', theme: defaultTheme }, [
            h('span', { slot: 'fallback' }, '★'),
          ]),
        ]),
        section('Menu — popover, selection, and light dismiss', [
          h('gd-menu', { theme: defaultTheme }, [
            h('span', { slot: 'trigger' }, 'Actions ▾'),
            h('div', { slot: 'content' }, [
              h('button', { 'data-gd-menu-name': 'Edit', 'data-gd-menu-value': 'edit' }, 'Edit'),
              h('button', { 'data-gd-menu-name': 'Archive', 'data-gd-menu-value': 'archive' }, 'Archive'),
            ]),
          ]),
          h('output', `Selected: ${menuValue.value}`),
        ]),
        section('Counter — quantity control', [
          h('gd-counter', { min: 1, max: 5, initial: 1, theme: defaultTheme }),
          h('output', `Value: ${counterValue.value}`),
        ]),
        section('Box — vertical / horizontal / bordered / highlighted', [
          h('gd-box', { variant: 'vertical', theme: defaultTheme }, 'Vertical box'),
          h('gd-box', { variant: 'horizontal', isBordered: true, theme: defaultTheme }, 'Bordered horizontal box'),
          h(
            'gd-box',
            { isBordered: true, isHighlighted: true, withShadowHover: true, theme: defaultTheme },
            'Interactive box'
          ),
        ]),
        section('Badge — variants / sizes / icons / disabled', [
          h('gd-badge', { variant: 'primary', appearance: 'filled', size: 'xs', theme: defaultTheme }, 'Primary'),
          h('gd-badge', { variant: 'secondary', appearance: 'outline', size: 'md', theme: defaultTheme }, [
            h('span', { slot: 'icon-start' }, '★'),
            'With icon',
          ]),
          h(
            'gd-badge',
            { variant: 'tertiary', appearance: 'filledLight', size: 'lg', disabled: true, theme: defaultTheme },
            'Disabled'
          ),
        ]),
        section('Image — image / caption / fallback', [
          h('gd-image', {
            src: portrait,
            alt: 'Ada Lovelace',
            width: 96,
            height: 96,
            caption: 'Portrait',
            theme: defaultTheme,
          }),
          h(
            'gd-image',
            { src: '/missing-image.png', alt: 'Unavailable image', width: 96, height: 96, theme: defaultTheme },
            [h('span', { slot: 'fallback' }, 'Image unavailable')]
          ),
        ]),
        section('Icon — shared React/Web Components catalog', [
          h('gd-icon', { name: 'star', size: 'xs', theme: defaultTheme }),
          h('gd-icon', { name: 'search', size: 'md', theme: defaultTheme }),
          h('gd-icon', { name: 'edit', size: 'xl', 'aria-label': 'Edit', theme: defaultTheme }),
        ]),
        section('InputFile — default / multiple / accept / icon', [
          h('gd-input-file', { theme: defaultTheme }, 'Browse Files'),
          h('gd-input-file', { multiple: true, accept: 'image/*', theme: defaultTheme }, 'Choose images'),
          h('gd-input-file', { isIcon: true, 'aria-label': 'Upload file', theme: defaultTheme }, [
            h('gd-icon', { name: 'upload' }),
          ]),
          h('gd-input-file', { disabled: true, theme: defaultTheme }, 'Disabled'),
        ]),
        section('Label — text / icon / association', [
          h('gd-label', { for: 'vue-labelled-input', theme: defaultTheme }, 'Account name'),
          h('input', { id: 'vue-labelled-input' }),
          h('gd-label', { theme: defaultTheme }, [h('gd-icon', { name: 'star' }), ' Required label']),
        ]),
        section('Link — variants / underline / size / disabled', [
          h('gd-link', { href: '#vue-link', variant: 'primary', size: 'sm', theme: defaultTheme }, 'Primary'),
          h(
            'gd-link',
            { href: '#vue-link', variant: 'inherit', underline: 'highlight', size: 'md', theme: defaultTheme },
            'Highlighted'
          ),
          h('gd-link', { variant: 'inverted', size: 'lg', disabled: true, theme: defaultTheme }, 'Disabled'),
        ]),
        section('Loader — circle / dots / sizes / wrapper variants', [
          h('gd-loader', { name: 'circle', size: 'xs', theme: defaultTheme }),
          h('gd-loader', { name: 'dots', size: 'md', rounded: 'round', theme: defaultTheme }),
          h('gd-loader', { name: 'circle', size: 'lg', variant: 'section', theme: defaultTheme }),
          h('gd-loader', { name: 'circle', size: 'sm', withWrapper: false, theme: defaultTheme }),
        ]),
        section('Separator — horizontal / vertical / labels / variants', [
          h('gd-separator', { length: '180px', theme: defaultTheme }),
          h('gd-separator', {
            length: '180px',
            label: 'OR',
            labelPosition: 'center',
            size: 'md',
            variant: 'dashed',
            theme: defaultTheme,
          }),
          h('gd-separator', { length: '80px', orientation: 'vertical', label: 'Or', size: 'md', theme: defaultTheme }),
        ]),
        section('Skeleton — rounded / circular / rectangular / children', [
          h('gd-skeleton', { width: '180px', height: '15px', theme: defaultTheme }),
          h('gd-skeleton', { width: '60px', height: '60px', variant: 'circular', theme: defaultTheme }),
          h(
            'gd-skeleton',
            {
              width: '180px',
              height: '50px',
              variant: 'rectangular',
              backgroundColor: 'theme.palette.success.main',
              theme: defaultTheme,
            },
            'Loading Content...'
          ),
        ]),
        section('Slider / dots — range and carousel navigation', [
          h('gd-slider', { min: 0, max: 100, value: 45, 'aria-label': 'Volume', theme: defaultTheme }),
          h('gd-slider-dots', { count: 5, activeIndex: 1, theme: defaultTheme }),
        ]),
        section('Switch — default / checked / loading', [
          h('gd-switch', { theme: defaultTheme }, 'Notifications'),
          h('gd-switch', { checked: true, label: 'left', theme: defaultTheme }, 'Enabled'),
          h('gd-switch', { isLoading: true, theme: defaultTheme }, 'Saving'),
        ]),
        section('Textarea — colors / counter / resize', [
          h('gd-textarea', { placeholder: 'Comment', theme: defaultTheme }),
          h('gd-textarea', { color: 'success', maxCharacters: 100, defaultValue: 'Looks good', theme: defaultTheme }),
          h('gd-textarea', { resize: 'both', rows: 3, theme: defaultTheme }),
        ]),
        section('Toggle — selected / disabled', [
          h('gd-toggle', { items: ['Option 1', 'Option 2', 'Option 3'], value: 'Option 1', theme: defaultTheme }),
          h('gd-toggle', {
            items: ['Option 1', 'Option 2', 'Option 3'],
            value: 'Option 2',
            disabled: true,
            theme: defaultTheme,
          }),
        ]),
        section('Truncate — single / multiple lines', [
          h(
            'gd-truncate',
            { style: 'width: 180px', theme: defaultTheme },
            'A long single-line value that must be truncated.'
          ),
          h(
            'gd-truncate',
            { style: 'width: 180px', lines: 2, theme: defaultTheme },
            'A longer block of content constrained to two lines for the Vue integration harness.'
          ),
        ]),
        section('Wrapper — inline / section', [
          h('gd-wrapper', { variant: 'inline', theme: defaultTheme }, 'Inline content'),
          h('gd-wrapper', { variant: 'section', as: 'section', theme: defaultTheme }, 'Section content'),
        ]),
      ]);
  },
};

createApp(App).mount('#app');
