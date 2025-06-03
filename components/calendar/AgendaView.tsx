import * as React from 'react';
import {Agenda} from 'react-native-calendars';
import {View, Text, StyleSheet} from 'react-native';
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
  /* ------------------------------------------------------------------
   * 날짜 셀(dayComponent) 커스터마이즈
   * 1. 전체 날짜 셀에 일(day) 숫자를 표시
   * 2. 해당 날짜에 일정이 존재하면 첫 번째 일정의 이름을 함께 출력
   * ------------------------------------------------------------------ */
  const DayComponent = React.useCallback(
    ({date, state}: {date: {dateString: string; day: number}; state: string}) => {
      const dateKey = date?.dateString ?? '';
      const schedules = items[dateKey] ?? [];
      const hasSchedules = schedules.length > 0;

      return (
        <View style={styles.dayContainer}>
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
              numberOfLines={1}              // 한 줄만 표기, 길면 말줄임표
              ellipsizeMode="tail">
              {schedules[0].title}
            </Text>
          )}
        </View>
      );
    },
    [items, selected]
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
      dayComponent={DayComponent}   // ← 커스텀 날짜 셀 지정
      theme={theme}
      showClosingKnob={true}
      hideExtraDays={true}
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
  scheduleText: {
    marginTop: 2,
    fontSize: 10,
    color: '#4395E6'
  }
});