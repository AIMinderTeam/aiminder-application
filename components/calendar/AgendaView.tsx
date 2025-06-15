import * as React from 'react';
import {Agenda} from 'react-native-calendars';
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {ScheduleCard} from './ScheduleCard';
import {EmptySchedule} from './EmptySchedule';
import {DayView} from "@/components/calendar/DayView";
import {ScheduleDetailModal} from './ScheduleDetailModal';
import {AgendaItem, Schedule} from "@/domain/Schedule";
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
  const [isCalendarOpen, setIsCalendarOpen] = React.useState<boolean>(false);
  const agendaRef = React.useRef<any>(null);
  const displayedItems = items;

  const today = React.useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

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
    ({date, state}: { date: { dateString: string; day: number }; state: string }) => {
      if (!isCalendarOpen) {
        const hasSchedules = (displayedItems[date?.dateString ?? ''] ?? []).length > 0;
        const isToday = date.dateString === today;
        const isSelected = date.dateString === selectedDate;
        
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleDayPress({dateString: date.dateString})}
            style={[
              styles.dayContainer,
              isToday && styles.todayContainer,
              isSelected && styles.selectedDayContainer
            ]}
          >
            <Text style={[
              styles.dayText,
              state === 'disabled' && styles.disabledText,
              isToday && styles.todayText,
              isSelected && styles.selectedDayText
            ]}>
              {date.day}
            </Text>
            {hasSchedules && (
              <View style={[
                styles.scheduleIndicator,
                isToday && styles.todayScheduleIndicator,
                isSelected && styles.selectedScheduleIndicator
              ]} />
            )}
          </TouchableOpacity>
        );
      }

      return (
        <DayView
          date={date}
          state={state}
          schedules={displayedItems[date?.dateString ?? ''] ?? []}
          currentSelected={selectedDate}
          onPress={(d) => handleDayPress({dateString: d})}
        />
      );
    },
    [displayedItems, handleDayPress, selectedDate, isCalendarOpen, today]
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
        setSelectedSchedule={setSelectedSchedule}
      />
    </>
  );
});

const styles = StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    padding: 5,
    borderRadius: 16,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
  },
  todayContainer: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  selectedDayContainer: {
    backgroundColor: '#2196F3',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  todayText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#ccc',
  },
  scheduleIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2196F3',
    marginTop: 4,
  },
  todayScheduleIndicator: {
    backgroundColor: '#2196F3',
  },
  selectedScheduleIndicator: {
    backgroundColor: '#FFFFFF',
  },
});