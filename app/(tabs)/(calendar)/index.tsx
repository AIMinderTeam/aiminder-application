import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Appbar, FAB} from 'react-native-paper';
import {AgendaView} from '@/components/calendar/AgendaView';
import {useSchedules} from "@/hooks/calendar/useSchedule";
import {initializeLocale} from "@/hooks/calendar/useLocale";
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function CalendarScreen() {
  initializeLocale()
  const router = useRouter();

  const {
    selectedDate,
    setSelectedDate,
    selectedSchedule,
    setSelectedSchedule,
    getAgendaItems,
    handleEditSchedule,
    handleDeleteSchedule,
  } = useSchedules();

  const getSelectedMonthTitle = () => {
    if (!selectedDate) return "캘린더";
    
    try {
      const date = new Date(selectedDate);
      return format(date, 'yyyy년 M월', { locale: ko });
    } catch {
      return "캘린더";
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={getSelectedMonthTitle()}/>
        <Appbar.Action icon="bell-outline" onPress={() => {
        }}/>
      </Appbar.Header>

      <AgendaView
        items={getAgendaItems()}
        selected={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        onEditSchedule={handleEditSchedule}
        onDeleteSchedule={handleDeleteSchedule}
        selectedSchedule={selectedSchedule}
        setSelectedSchedule={setSelectedSchedule}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        label="새 일정"
        onPress={() => router.push('/(tabs)/(calendar)/new-schedule')}
        mode="elevated"
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#4395E6'
  }
});