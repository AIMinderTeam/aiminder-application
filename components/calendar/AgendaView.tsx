import * as React from 'react';
import {Agenda} from 'react-native-calendars';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Schedule, AgendaItem} from '@/domain/schedule';
import {CalendarTheme} from '@/domain/theme';
import {ScheduleCard} from './ScheduleCard';
import {EmptySchedule} from './EmptySchedule';

interface AgendaViewProps {
  items: { [key: string]: AgendaItem[] };
  selected?: string;
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
  const today = React.useMemo(
    () => new Date().toISOString().split('T')[0],
    []
  );
  const currentSelected = selected || today;
  const agendaRef = React.useRef<any>(null);
  const handleDayPress = React.useCallback(
    (day: { dateString: string }) => {
      onDayPress(day);
      requestAnimationFrame(() => {
        agendaRef.current?.toggleCalendarPosition?.(false);
      });
    },
    [onDayPress, agendaRef.current]
  );
  const DayComponent = React.useCallback(
    ({ date, state }: { date: { dateString: string; day: number }; state: string }) => {
    const dateKey = date?.dateString ?? '';
    const schedules = items[dateKey] ?? [];
    const hasSchedules = schedules.length > 0;
      const handlePress = () => {
        if (dateKey) {
          handleDayPress({ dateString: dateKey });
        }
      };

    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.dayTouchable}
      >
        <View style={styles.dayContainer}>
          <Text
            style={[
              styles.dayNumber,
              state === 'disabled' && styles.disabledDayNumber,
              dateKey === currentSelected && styles.selectedDayNumber
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
  [items, handleDayPress]
);

  return (
    <Agenda
      ref={agendaRef}
      items={items}
      selected={currentSelected}
      onDayPress={handleDayPress}
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
  dayTouchable: {
    flex: 1,
    width: '100%',
  },

  dayContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingVertical: 4,
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