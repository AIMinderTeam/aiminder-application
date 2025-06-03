import * as React from 'react';
import {Agenda} from 'react-native-calendars';
import {AgendaItem, Schedule} from '@/domain/schedule';
import {CalendarTheme} from '@/domain/theme';
import {ScheduleCard} from './ScheduleCard';
import {EmptySchedule} from './EmptySchedule';
import {DayView} from "@/components/calendar/DayView";

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
  const [isCalendarOpen, setIsCalendarOpen] = React.useState<boolean>(true);
  const handleCalendarToggle = React.useCallback(
    (opened: boolean) => {
      setIsCalendarOpen(opened);
    },
    [setIsCalendarOpen],
  );

  const getWeekRange = React.useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const start = new Date(date);
    start.setDate(date.getDate() - day);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const toISO = (d: Date) => d.toISOString().split('T')[0];

    return {start: toISO(start), end: toISO(end)};
  }, []);

  const displayedItems = React.useMemo(() => {
    if (isCalendarOpen) {
      return items;
    }

    const {start, end} = getWeekRange(currentSelected);
    const filtered: { [key: string]: AgendaItem[] } = {};

    Object.entries(items).forEach(([key, value]) => {
      if (key >= start && key <= end) {
        filtered[key] = value;
      }
    });

    const cursor = new Date(start);
    while (cursor.toISOString().split('T')[0] <= end) {
      const k = cursor.toISOString().split('T')[0];
      if (!filtered[k]) filtered[k] = [];
      cursor.setDate(cursor.getDate() + 1);
    }
    return filtered;
  }, [items, isCalendarOpen, getWeekRange]);

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
  /** react-native-calendars 에 전달될 Day Cell 컴포넌트 */
  const renderDayComponent = React.useCallback(
    ({date, state}: { date: { dateString: string; day: number }; state: string }) => {
      const dateKey = date?.dateString ?? '';
      const schedules = displayedItems[dateKey] ?? [];

      return (
        <DayView
          date={date}
          state={state}
          schedules={schedules}
          currentSelected={currentSelected}
          onPress={(d) => handleDayPress({dateString: d})}
        />
      );
    },
    [displayedItems, handleDayPress],
  );

  return (
    <Agenda
      ref={agendaRef}
      items={displayedItems}
      onCalendarToggled={handleCalendarToggle}
      selected={currentSelected}
      onDayPress={handleDayPress}
      renderItem={(item: AgendaItem) => (
        <ScheduleCard
          schedule={item}
          onEdit={onEditSchedule}
          onDelete={onDeleteSchedule}
        />
      )}
      renderEmptyDate={() => <EmptySchedule/>}
      dayComponent={renderDayComponent}
      theme={theme}
      showClosingKnob
      hideExtraDays
    />
  );
});