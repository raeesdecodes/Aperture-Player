// Root component, navigation container.
import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Aperture Player</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#F5F5F7',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
