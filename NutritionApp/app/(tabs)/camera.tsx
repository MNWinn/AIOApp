import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

export default function Camera() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.onBackground }]}>
        Camera
      </Text>
      <Button
        mode="contained"
        onPress={() => console.log('Button pressed')}
        style={{ backgroundColor: colors.primary }}
      >
        Get Started
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
