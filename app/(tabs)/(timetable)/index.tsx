import * as React from "react";
import {View, ScrollView, StyleSheet, Modal} from "react-native";
import {Appbar, Text, Surface, IconButton} from "react-native-paper";
import {useDateStore} from "@/stores/DateStore";
import {Calendar} from 'react-native-calendars';

const HOURS = Array.from({length: 24}, (_, i) => 
  `${String(i).padStart(2, '0')}:00`
);

export default function TimetableScreen() {
  const {selectedDate, setSelectedDate} = useDateStore();
  const [isCalendarVisible, setIsCalendarVisible] = React.useState(false);

  const handleDateSelect = (date: any) => {
    setSelectedDate(date.dateString);
    setIsCalendarVisible(false);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="타임테이블"/>
        <Appbar.Action icon="bell-outline" onPress={() => {}}/>
      </Appbar.Header>

      <View style={styles.dateHeader}>
        <View style={styles.dateContainer}>
          <Text variant="titleLarge">{selectedDate}</Text>
          <IconButton
            icon="calendar"
            size={24}
            onPress={() => setIsCalendarVisible(true)}
          />
        </View>
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

      <Modal
        visible={isCalendarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCalendarVisible(false)}
      >
        <View 
          style={styles.modalContainer}
          onTouchStart={() => setIsCalendarVisible(false)}
        >
          <View 
            style={styles.calendarContainer}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <Calendar
              onDayPress={handleDateSelect}
              current={selectedDate}
              markedDates={{
                [selectedDate]: {selected: true}
              }}
              theme={{
                selectedDayBackgroundColor: '#6200ee',
                todayTextColor: '#6200ee',
                arrowColor: '#6200ee',
              }}
            />
          </View>
        </View>
      </Modal>
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
    marginRight: '-7%'
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '90%',
  },
});