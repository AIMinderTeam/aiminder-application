import * as React from 'react';
import {Agenda} from 'react-native-calendars';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';  // ← 추가
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
  const DayComponent = React.useCallback(
    ({ date, state }: { date: { dateString: string; day: number }; state: string }) => {
    const dateKey = date?.dateString ?? '';
    const schedules = items[dateKey] ?? [];
    const hasSchedules = schedules.length > 0;

    const handlePress = () => {
      if (dateKey) {
        onDayPress({ dateString: dateKey });
      }
    };

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.dayContainer}>
          <Text
            style={[
              styles.dayNumber,
              state === 'disabled' && styles.disabledDayNumber,
              dateKey === selected && styles.selectedDayNumber
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
                  idx === 1 && { marginTop: 1 }
                ]}
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
  [items, selected, onDayPress]
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
      hideExtraDays
    />
  );
});

const styles = StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4
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
  scheduleBox: {
    marginTop: 2,
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    maxWidth: '100%',
  },
  scheduleText: {
    marginTop: 2,
    fontSize: 10,
    color: '#4395E6'
  }
});