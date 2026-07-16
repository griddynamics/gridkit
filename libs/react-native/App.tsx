import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { GdButton } from './src/components/GdButton/GdButton';
import { GdCheckbox } from './src/components/GdCheckbox/GdCheckbox';
import { GdTypography } from './src/components/GdTypography/GdTypography';
import { GdInput } from './src/components/GdInput/GdInput';
import { GdSelect } from './src/components/GdSelect/GdSelect';

const SELECT_ITEMS = [{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }];

/**
 * Visual-fidelity verification harness for all 5 ported atoms (Task 7) — the RN analog of
 * `libs/web-components/harness/fidelity-check.tsx`. Renders every atom with NO `theme` prop
 * (i.e. each resolver's own hardcoded fallback), which is deliberate, not an oversight: per
 * `libs/web-components/FINDINGS.md` Section 9, every one of these fallback values was already
 * corrected to match the REAL `gd-design-library` token defaults. A themeless render here is
 * therefore already the correct visual-fidelity baseline — hand-authoring a separate "RN-safe
 * default theme" constant (Open Question 3 in the implementation plan) would just be a second,
 * manually-kept-in-sync copy of the same values, the exact duplication risk Decision 1 already
 * accepts once for the resolvers themselves; it should not be paid twice.
 *
 * IMPORTANT — what this harness does NOT do: no iOS Simulator / Android Emulator was available
 * in the environment this was authored in (`xcrun simctl list devices` hangs indefinitely with
 * no responding device), so no on-device/simulator screenshots were captured and no visual
 * comparison against Storybook/the Lit atoms was performed. This file makes that comparison
 * possible for a human running `npm run start` with Expo Go — it does not itself constitute a
 * completed verification pass. See `react-native/FINDINGS.md`.
 */
export default function App() {
  const [checked, setChecked] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selected, setSelected] = useState<{ name: string } | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GdTypography variant="h3">GdButton</GdTypography>
      <GdButton variant="primary" onPress={() => console.log('pressed')}>
        Submit
      </GdButton>

      <GdTypography variant="h3">GdCheckbox</GdTypography>
      <GdCheckbox checked={checked} onValueChange={setChecked}>
        Accept terms
      </GdCheckbox>

      <GdTypography variant="h3">GdTypography</GdTypography>
      <GdTypography variant="p">The quick brown fox jumps over the lazy dog.</GdTypography>
      <GdTypography variant="small" styleVariant="italic">
        Small italic caption text
      </GdTypography>

      <GdTypography variant="h3">GdInput</GdTypography>
      <GdInput
        value={inputValue}
        onValueChange={setInputValue}
        placeholder="Type something"
        label="Label"
        helperText="Helper text"
      />

      <GdTypography variant="h3">GdSelect</GdTypography>
      <GdSelect items={SELECT_ITEMS} value={selected} onValueChange={setSelected} placeholder="Choose an option" />

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 12,
  },
});
