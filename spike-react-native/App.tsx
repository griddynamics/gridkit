import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GdButton } from './src/components/GdButton/GdButton';

/**
 * Smoke-test harness proving spike-react-native's platform works end-to-end: renders `GdButton`
 * (ported per CTORNDSD-590's Migration Example) driven by gd-design-core's `resolveButtonVariantStyle`.
 * The remaining 4 atoms and the full spike Ordered Work are this ticket's own execution, not seeded here.
 */
export default function App() {
  return (
    <View style={styles.container}>
      <GdButton variant="primary" onPress={() => console.log('pressed')}>
        Submit
      </GdButton>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
