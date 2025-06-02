import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

export const EmptySchedule = React.memo(() => (
  <View style={styles.container}>
    <Text>일정이 없습니다</Text>
  </View>
));

const styles = StyleSheet.create({
  container: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});
