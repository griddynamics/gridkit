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
      ]);
  },
};

createApp(App).mount('#app');
