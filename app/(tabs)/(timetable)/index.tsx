import * as React from "react";
import {View, ScrollView, StyleSheet} from "react-native";
import {Appbar, Text, Surface} from "react-native-paper";
import {useDateStore} from "@/stores/DateStore";

const HOURS = Array.from({length: 24}, (_, i) => 
  `${String(i).padStart(2, '0')}:00`
);

export default function TimetableScreen() {
  const {selectedDate} = useDateStore()

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="타임테이블"/>
        <Appbar.Action icon="calendar" onPress={() => {}}/>
        <Appbar.Action icon="bell-outline" onPress={() => {}}/>
      </Appbar.Header>

      <View style={styles.dateHeader}>
        <Text variant="titleLarge">{selectedDate}</Text>
      </View>

      <ScrollView>
        {HOURS.map((time, index) => (
          <View key={time} style={styles.timeRow}>
            <View style={styles.timeCell}>
              <Text style={styles.timeText}>{time}</Text>
            </View>
            <Surface style={[
              styles.scheduleCell,
              index % 2 === 0 ? styles.evenRow : styles.oddRow
            ]}>
              <Text> </Text>
            </Surface>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dateHeader: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  timeRow: {
    flexDirection: 'row',
    height: 60,
  },
  timeCell: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  scheduleCell: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#f9f9f9',
  },
});