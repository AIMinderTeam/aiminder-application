import * as React from 'react';
import {Agenda} from 'react-native-calendars';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated          // ← 추가
} from 'react-native';
import {Schedule, AgendaItem} from '@/domain/schedule';
import {CalendarTheme} from '@/domain/theme';
import {ScheduleCard} from './ScheduleCard';
import {EmptySchedule} from './EmptySchedule';

interface AgendaViewProps {
  items: { [key: string]: AgendaItem[] };
  selected: string;
  onDayPress: (day: { dateString: string }) => void;
  onEditSchedule: (schedule: Schedule) => void;
  onDeleteSchedule: (id: string) => void;
}

const theme: CalendarTheme = {
  agendaDayTextColor: '#4395E6',
  agendaDayNumColor: '#4395E6',
  agendaTodayColor: '#4395E6',
  agendaKnobColor: '#4395E6'
};

export const AgendaView = React.memo<AgendaViewProps>(({
  items,
  selected,
  onDayPress,
  onEditSchedule,
  onDeleteSchedule
}) => {
  const calendarOpenAnim = React.useRef(new Animated.Value(0)).current;

  const DayComponent = React.useCallback(
    ({date, state}: {date: {dateString: string; day: number}; state: string}) => {
      const dateKey = date?.dateString ?? '';
      const schedules = items[dateKey] ?? [];
      const hasSchedules = schedules.length > 0;

      const handlePress = () => {
        if (dateKey) {
          onDayPress({dateString: dateKey});
        }
      };

      const animatedStyle = React.useMemo(
        () => ({
          paddingVertical: calendarOpenAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [4, 12]
          })
        }),
        [calendarOpenAnim]
      );

      return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
          <Animated.View style={[styles.dayContainer, animatedStyle]}>
            <Text
              style={[
                styles.dayNumber,
                state === 'disabled' && styles.disabledDayNumber,
                dateKey === selected && styles.selectedDayNumber
              ]}>
              {date.day}
            </Text>

            {hasSchedules && (
              <Text
                style={styles.scheduleText}
                numberOfLines={1}
                ellipsizeMode="tail">
                {schedules[0].title}
              </Text>
            )}
          </Animated.View>
        </TouchableOpacity>
      );
    },
    [items, selected, onDayPress, calendarOpenAnim]
  );

  return (
    <Agenda
      items={items}
      selected={selected}
      onDayPress={onDayPress}
      renderItem={(item: AgendaItem) => (
        <ScheduleCard
          schedule={item}
          onEdit={onEditSchedule}
          onDelete={onDeleteSchedule}
        />
      )}
      renderEmptyDate={() => <EmptySchedule />}
      dayComponent={DayComponent}
      theme={theme}
      showClosingKnob
      hideExtraDays={false}
      onCalendarToggled={(opened: boolean) =>
        Animated.timing(calendarOpenAnim, {
          toValue: opened ? 1 : 0,
          duration: 0,
          useNativeDriver: false
        }).start()
      }
    />
  );
});

const styles = StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 14,
    color: '#000'
  },
  disabledDayNumber: {
    color: '#c1c1c1'
  },
  selectedDayNumber: {
    color: '#4395E6',
    fontWeight: 'bold'
  },
  scheduleText: {
    marginTop: 2,
    fontSize: 10,
    color: '#4395E6'
  }
});