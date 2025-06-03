import * as React from 'react';
import {Agenda} from 'react-native-calendars';
import {AgendaItem, Schedule} from '@/domain/schedule';
import {CalendarTheme} from '@/domain/theme';
import {ScheduleCard} from './ScheduleCard';
import {EmptySchedule} from './EmptySchedule';
import {DayView} from "@/components/calendar/DayView";
import {View} from "react-native";
import {ScheduleHeader} from "@/components/calendar/ScheduleHeader";
import {ScheduleDetailModal} from './ScheduleDetailModal';
import {useDateStore} from "@/stores/DateStore";

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
  const [selectedSchedule, setSelectedSchedule] = React.useState<Schedule | null>(null);
  
  const handleSchedulePress = React.useCallback((schedule: Schedule) => {
    setSelectedSchedule(schedule);
  }, [setSelectedSchedule]);

  const handleCloseDetail = React.useCallback(() => {
    setSelectedSchedule(null);
  }, [setSelectedSchedule]);
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

  const {selectedDate, setSelectedDate: setGlobalSelectedDate} = useDateStore()

  const currentSelected = selectedDate;

  const handleDateSelection = (day: string) => {
    setGlobalSelectedDate(day)
  }

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
  }, [items, isCalendarOpen, getWeekRange, currentSelected]);

  const agendaRef = React.useRef<any>(null);
  const handleDayPress = React.useCallback(
    (day: { dateString: string }) => {
      onDayPress(day);
      requestAnimationFrame(() => {
        agendaRef.current?.toggleCalendarPosition?.(false);
      });
      handleDateSelection(day.dateString)
    },
    [onDayPress, agendaRef.current]
  );

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
    [displayedItems, handleDayPress, currentSelected],
  );

  const renderItem = React.useCallback(
    (item: AgendaItem, firstItemInDay: boolean) => {
      return (
        <View>
          {firstItemInDay && <ScheduleHeader />}
          <ScheduleCard
            schedule={item}
            onPress={handleSchedulePress}
          />
        </View>
      );
    },
    [handleSchedulePress],
  );

  return (
    <>
      <Agenda
        ref={agendaRef}
        items={displayedItems}
        onCalendarToggled={handleCalendarToggle}
        selected={currentSelected}
        onDayPress={handleDayPress}
        renderItem={(item: AgendaItem, firstItemInDay: boolean) =>
          renderItem(item, firstItemInDay)
        }
        renderEmptyDate={() => (
          <View>
            <ScheduleHeader />
            <EmptySchedule />
          </View>
        )}
        dayComponent={renderDayComponent}
        theme={theme}
        showClosingKnob
        hideExtraDays
      />
      <ScheduleDetailModal
        visible={!!selectedSchedule}
        schedule={selectedSchedule}
        onDismiss={handleCloseDetail}
        onEdit={onEditSchedule}
        onDelete={onDeleteSchedule}
      />
    </>
  );
});