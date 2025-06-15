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

    const today = React.useMemo(() => {
      const now = new Date();
      return now.toISOString().split('T')[0];
    }, []);

    const isToday = dateKey === today;
    const isSelected = dateKey === currentSelected;

    const handlePress = () => {
      if (dateKey) {
        onPress(dateKey);
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        style={[
          styles.dayTouchable,
          isToday && styles.todayTouchable,
          isSelected && styles.selectedTouchable
        ]}
      >
        <View style={[
          styles.dayContainer,
          isToday && styles.todayContainer,
          isSelected && styles.selectedContainer
        ]}>
          <Text
            style={[
              styles.dayNumber,
              state === 'disabled' && styles.disabledDayNumber,
              isToday && styles.todayDayNumber,
              isSelected && styles.selectedDayNumber,
            ]}
          >
            {date.day}
          </Text>

          {hasSchedules &&
            schedules.map((schedule, idx) => (
              <View
                key={idx}
                style={[
                  styles.scheduleBox, 
                  idx === 1 && { marginTop: 1 },
                  isToday && styles.todayScheduleBox,
                  isSelected && styles.selectedScheduleBox
                ]}
              >
                <Text
                  style={[
                    styles.scheduleText,
                    isToday && styles.todayScheduleText,
                    isSelected && styles.selectedScheduleText
                  ]}
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
  todayTouchable: {
    borderRadius: 8,
  },
  selectedTouchable: {
    borderRadius: 8,
  },
  dayContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 1,
    borderRadius: 8,
  },
  todayContainer: {
    backgroundColor: '#E3F2FD', // 연한 파란색 배경
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  selectedContainer: {
    backgroundColor: '#2196F3', // 파란색 배경
  },
  dayNumber: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    fontWeight: '400',
  },
  disabledDayNumber: {
    color: '#c1c1c1',
  },
  todayDayNumber: {
    color: '#2196F3',
    fontWeight: '600',
  },
  selectedDayNumber: {
    color: '#FFFFFF',
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
  todayScheduleBox: {
    backgroundColor: '#BBDEFB', // 오늘 날짜의 스케줄 박스 색상
  },
  selectedScheduleBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 선택된 날짜의 스케줄 박스 색상
  },
  scheduleText: {
    fontSize: 10,
    color: '#4395E6',
  },
  todayScheduleText: {
    color: '#1976D2', // 오늘 날짜의 스케줄 텍스트 색상
    fontWeight: '500',
  },
  selectedScheduleText: {
    color: '#1976D2', // 선택된 날짜의 스케줄 텍스트 색상
    fontWeight: '500',
  },
});