import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GdButton } from './GdButtonReact';
import { GdCheckbox } from './GdCheckboxReact';
import { GdTypography } from './GdTypographyReact';
import { GdInput } from './GdInputReact';
import { GdSelect } from './GdSelectReact';

/**
 * CTORNDSD-581 visual-fidelity verification harness — renders each of the 5 ported atoms
 * with NO explicit `theme` prop (relying entirely on gd-design-core's corrected resolver
 * defaults) alongside props matching the real Storybook stories being compared against, so
 * a themeless Lit render should now visually match Storybook's default theme.
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
        value={value}
        onGdInput={(e: Event) => setValue((e as CustomEvent<{ value: string }>).detail.value)}
      />
    </Section>
  );
}

function ButtonSection() {
  return (
    <Section title="Button — primary / secondary / outlined / disabled / loading">
      <GdButton variant="primary">Primary</GdButton>
      <GdButton variant="secondary">Secondary</GdButton>
      <GdButton variant="outlined">Outlined</GdButton>
      <GdButton variant="primary" disabled>
        Disabled
      </GdButton>
      <GdButton variant="primary" isLoading>
        Loading
      </GdButton>
    </Section>
  );
}

function CheckboxSection() {
  const [checked, setChecked] = useState(true);
  return (
    <Section title="Checkbox — default / checked / indeterminate / disabled">
      <GdCheckbox id="cb-default" />
      <GdCheckbox
        id="cb-checked"
        checked={checked}
        onGdChange={(e: Event) => setChecked((e as CustomEvent<{ checked: boolean }>).detail.checked)}
      >
        Checked
      </GdCheckbox>
      <GdCheckbox id="cb-indeterminate" indeterminate>
        Indeterminate
      </GdCheckbox>
      <GdCheckbox id="cb-disabled" disabled checked>
        Disabled
      </GdCheckbox>
    </Section>
  );
}

function TypographySection() {
  return (
    <Section title="Typography — h1 / h2 / p">
      <div>
        <GdTypography variant="h1" as="h1">
          Heading 1
        </GdTypography>
        <GdTypography variant="h2" as="h2">
          Heading 2
        </GdTypography>
        <GdTypography variant="p" as="p">
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
        onGdChange={(e: Event) =>
          setValue((e as CustomEvent<{ value: { name: string; value: string } | null }>).detail.value)
        }
      />
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
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
