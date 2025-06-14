import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AgendaItem } from '@/domain/Schedule';

interface DayComponentProps {
  date: { dateString: string; day: number };
  state: string;
  schedules: AgendaItem[];
  currentSelected: string;
  onPress: (dateString: string) => void;
}

export const DayView: React.FC<DayComponentProps> = React.memo(
  ({ date, state, schedules, currentSelected, onPress }) => {
    const dateKey = date?.dateString ?? '';
    const hasSchedules = schedules.length > 0;

    const handlePress = () => {
      if (dateKey) {
        onPress(dateKey);
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        style={styles.dayTouchable}
      >
        <View style={styles.dayContainer}>
          <Text
            style={[
              styles.dayNumber,
              state === 'disabled' && styles.disabledDayNumber,
              dateKey === currentSelected && styles.selectedDayNumber,
            ]}
          >
            {date.day}
          </Text>

          {hasSchedules &&
            schedules.map((schedule, idx) => (
              <View
                key={idx}
                style={[styles.scheduleBox, idx === 1 && { marginTop: 1 }]}
              >
                <Text
                  style={styles.scheduleText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {schedule.title}
                </Text>
              </View>
            ))}
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  dayTouchable: {
    flex: 1,
    width: '100%',
  },
  dayContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 1,
  },
  dayNumber: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  disabledDayNumber: {
    color: '#c1c1c1',
  },
  selectedDayNumber: {
    color: '#4395E6',
    fontWeight: 'bold',
  },
  scheduleBox: {
    marginTop: 2,
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'stretch',
  },
  scheduleText: {
    fontSize: 10,
    color: '#4395E6',
  },
});