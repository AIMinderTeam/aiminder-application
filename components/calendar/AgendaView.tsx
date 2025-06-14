import * as React from 'react';
import {Agenda} from 'react-native-calendars';
import {View} from "react-native";
import {ScheduleCard} from './ScheduleCard';
import {EmptySchedule} from './EmptySchedule';
import {DayView} from "@/components/calendar/DayView";
import {ScheduleDetailModal} from './ScheduleDetailModal';
import {useDateStore} from "@/stores/DateStore";
import {AgendaItem, Schedule} from "@/domain/Schedule";
import {useAgendaItems} from "@/hooks/calendar/useAgendaItems";
import {ScheduleHeader} from "@/components/calendar/ScheduleHeader";
import {AGENDA_THEME} from "@/constant/AgendaTheme";

interface AgendaViewProps {
  items: { [key: string]: AgendaItem[] };
  selected?: string;
  onDayPress: (day: { dateString: string }) => void;
  onEditSchedule: (schedule: Schedule) => void;
  onDeleteSchedule: (id: string) => void;
  selectedSchedule: Schedule | null;
  setSelectedSchedule: (schedule: Schedule | null) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const AgendaView = React.memo<AgendaViewProps>(({
  items,
  onDayPress,
  onEditSchedule,
  onDeleteSchedule,
  selectedSchedule,
  setSelectedSchedule,
  selectedDate,
  setSelectedDate,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState<boolean>(true);
  const agendaRef = React.useRef<any>(null);
  
  const displayedItems = useAgendaItems(items, isCalendarOpen, selectedDate);

  const handleSchedulePress = React.useCallback((schedule: Schedule) => {
    setSelectedSchedule(schedule);
  }, [setSelectedSchedule]);

  const handleCloseDetail = React.useCallback(() => {
    setSelectedSchedule(null);
  }, [setSelectedSchedule]);

  const handleCalendarToggle = React.useCallback((opened: boolean) => {
    setIsCalendarOpen(opened);
  }, [setIsCalendarOpen]);

  const handleDayPress = React.useCallback(
    (day: { dateString: string }) => {
      onDayPress(day);
      requestAnimationFrame(() => {
        agendaRef.current?.toggleCalendarPosition?.(false);
      });
      setSelectedDate(day.dateString);
    },
    [onDayPress, setSelectedDate, agendaRef.current]
  );

  const renderDayComponent = React.useCallback(
    ({date, state}: { date: { dateString: string; day: number }; state: string }) => (
      <DayView
        date={date}
        state={state}
        schedules={displayedItems[date?.dateString ?? ''] ?? []}
        currentSelected={selectedDate}
        onPress={(d) => handleDayPress({dateString: d})}
      />
    ),
    [displayedItems, handleDayPress, selectedDate]
  );

  const renderItem = React.useCallback(
    (item: AgendaItem, firstItemInDay: boolean) => (
      <View>
        {firstItemInDay && <ScheduleHeader />}
        <ScheduleCard
          schedule={item}
          onPress={handleSchedulePress}
        />
      </View>
    ),
    [handleSchedulePress]
  );

  return (
    <>
      <Agenda
        ref={agendaRef}
        items={displayedItems}
        onCalendarToggled={handleCalendarToggle}
        selected={selectedDate}
        onDayPress={handleDayPress}
        renderItem={renderItem}
        renderEmptyDate={() => (
          <View>
            <ScheduleHeader />
            <EmptySchedule />
          </View>
        )}
        dayComponent={renderDayComponent}
        theme={AGENDA_THEME}
        monthFormat={"yyyy년 MM월"}
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