// The real gd-design-library/styles.css — imported from dist/libs/ui (build output), not
// libs/ui/src (source). `libs/ui/styles.css` doesn't exist at the package root at all — only
// the built dist/libs/ui/styles.css does (postbuild copies it there) — so the package's own
// export map (`"./styles.css": "./styles.css"`) only resolves once built, even for local
// monorepo consumption via the node_modules/gd-design-library symlink (which points at source).
// Run `npm run build:ui` first if this import 404s. Deliberate test-harness-only asset import
// (font/reset CSS for visual-fidelity comparison), not a source-code dependency on
// gd-design-library internals — the boundary rule exists to stop internal path coupling in shipped
// code, which this isn't.

// eslint-disable-next-line @nx/enforce-module-boundaries
import '../../../dist/libs/ui/styles.css';
import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { defaultTheme } from 'gd-design-library/tokens';
import { GdButton } from './GdButtonReact';
import { GdCheckbox } from './GdCheckboxReact';
import { GdTypography } from './GdTypographyReact';
import { GdInput } from './GdInputReact';
import { GdSelect } from './GdSelectReact';
import { GdAvatar } from './GdAvatarReact';
import { GdMenu } from './GdMenuReact';
import { GdCounter } from './GdCounterReact';

/**
 * Visual-fidelity verification harness — renders each of the 6 ported atoms with
 * props matching the real Storybook stories being compared against.
 *
 * All 5 components now resolve their REAL `libs/ui/src/tokens/*.ts` object directly (see each
 * `gd-*.ts` file) instead of a hand-mirrored `gd-design-core` resolver with real hardcoded
 * fallback constants. Every real token file's own `get(theme, path, fallback)` fallback is a
 * placeholder string like `'theme.colors.bg.fill.primary'` meant only as a Storybook-time debug
 * aid — the real components always render inside a `ThemeProvider` supplying a full theme, so
 * those fallbacks are never meant to render anything visually correct on their own. Every
 * component below therefore gets an explicit `theme={defaultTheme}` (the same object the real
 * components get from `ThemeProvider` by default) so the comparison stays meaningful — this is
 * not a bug in any of them, it's the real components' own themeless behavior, now faithfully
 * reproduced instead of papered over by a resolver-level fallback that never matched production.
 *
 * `InputColorVariantName` now matches the real `InputColorVariant` (`primary | success |
 * warning | error`) member-for-member, so `color="primary"` below is the same value the
 * reported story used, not a translated one.
 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h3 style={{ fontFamily: 'sans-serif' }}>{title}</h3>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
    </section>
  );
}

function InputSection() {
  const [value, setValue] = useState('Default Input');
  return (
    <Section title="Input — matches atoms-input--primary-default-with-label-and-helper-text">
      <GdInput
        id="input-repro"
        label="Label"
        helperText="Helper text"
        color="primary"
        theme={defaultTheme}
        value={value}
        onGdInput={(e: Event) => setValue((e as CustomEvent<{ value: string }>).detail.value)}
      />
    </Section>
  );
}

function ButtonSection() {
  return (
    <Section title="Button — primary / secondary / outlined / disabled / loading">
      <GdButton variant="primary" theme={defaultTheme}>
        Primary
      </GdButton>
      <GdButton variant="secondary" theme={defaultTheme}>
        Secondary
      </GdButton>
      <GdButton variant="outlined" theme={defaultTheme}>
        Outlined
      </GdButton>
      <GdButton variant="primary" theme={defaultTheme} disabled>
        Disabled
      </GdButton>
      <GdButton variant="primary" theme={defaultTheme} isLoading>
        Loading
      </GdButton>
    </Section>
  );
}

function CheckboxSection() {
  const [checked, setChecked] = useState(true);
  return (
    <Section title="Checkbox — default / checked / indeterminate / disabled">
      <GdCheckbox id="cb-default" theme={defaultTheme} />
      <GdCheckbox
        id="cb-checked"
        theme={defaultTheme}
        checked={checked}
        onGdChange={(e: Event) => setChecked((e as CustomEvent<{ checked: boolean }>).detail.checked)}
      >
        Checked
      </GdCheckbox>
      <GdCheckbox id="cb-indeterminate" theme={defaultTheme} indeterminate>
        Indeterminate
      </GdCheckbox>
      <GdCheckbox id="cb-disabled" theme={defaultTheme} disabled checked>
        Disabled
      </GdCheckbox>
    </Section>
  );
}

function TypographySection() {
  return (
    <Section title="Typography — h1 / h2 / p">
      <div>
        <GdTypography variant="h1" as="h1" theme={defaultTheme}>
          Heading 1
        </GdTypography>
        <GdTypography variant="h2" as="h2" theme={defaultTheme}>
          Heading 2
        </GdTypography>
        <GdTypography variant="p" as="p" theme={defaultTheme}>
          Body paragraph text for comparison.
        </GdTypography>
      </div>
    </Section>
  );
}

function SelectSection() {
  const items = [
    { name: 'Alpha', value: 'a' },
    { name: 'Beta', value: 'b' },
    { name: 'Gamma', value: 'c' },
  ];
  const [value, setValue] = useState<{ name: string; value: string } | null>(null);
  return (
    <Section title="Select — trigger + dropdown">
      <GdSelect
        id="select-repro"
        items={items}
        value={value}
        theme={defaultTheme}
        onGdChange={(e: Event) =>
          setValue((e as CustomEvent<{ value: { name: string; value: string } | null }>).detail.value)
        }
      />
    </Section>
  );
}

function AvatarSection() {
  const portrait =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%2391b8d8"/%3E%3Ccircle cx="32" cy="24" r="13" fill="%23f1c7a5"/%3E%3Cpath d="M8 64c3-18 14-27 24-27s21 9 24 27" fill="%233e6184"/%3E%3C/svg%3E';
  return (
    <Section title="Avatar — image / fallback / badge / sizes">
      <GdAvatar src={portrait} alt="Ada Lovelace" size="md" theme={defaultTheme} />
      <GdAvatar fallback="AL" alt="Ada Lovelace" size="lg" theme={defaultTheme} />
      <GdAvatar
        fallback="GD"
        alt="GridKit"
        size="xl"
        withBadge
        badgeColor="bg.fill.success.primary.default"
        backgroundColor="bg.fill.info.primary.default"
        theme={defaultTheme}
      />
      <GdAvatar alt="Custom fallback" size="sm" theme={defaultTheme}>
        <span slot="fallback">★</span>
      </GdAvatar>
    </Section>
  );
}

function MenuSection() {
  const [value, setValue] = useState('None');
  return (
    <Section title="Menu — popover, selection, and light dismiss">
      <GdMenu
        theme={defaultTheme}
        onGdChange={(event: Event) => {
          const { data } = (event as CustomEvent<{ data: { name?: string; value: string } }>).detail;
          setValue(`${data.name ?? data.value} (${data.value})`);
        }}
      >
        <span slot="trigger">Actions ▾</span>
        <div slot="content">
          <button data-gd-menu-name="Edit" data-gd-menu-value="edit">
            Edit
          </button>
          <button data-gd-menu-name="Archive" data-gd-menu-value="archive">
            Archive
          </button>
        </div>
      </GdMenu>
      <output>Selected: {value}</output>
    </Section>
  );
}

function CounterSection() {
  const [value, setValue] = useState(1);
  return (
    <Section title="Counter — quantity control">
      <GdCounter
        min={1}
        max={5}
        initial={1}
        theme={defaultTheme}
        onGdChange={(event: Event) => setValue((event as CustomEvent<{ value: number }>).detail.value)}
      />
      <output>Value: {value}</output>
    </Section>
  );
}

function App() {
  return (
    <div style={{ padding: 24 }}>
      <InputSection />
      <ButtonSection />
      <CheckboxSection />
      <TypographySection />
      <SelectSection />
      <AvatarSection />
      <MenuSection />
      <CounterSection />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
