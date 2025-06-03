import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

export const DayHeader = (() => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.divider, {backgroundColor: theme.colors.outlineVariant}]} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    flex: 1,
  },
});