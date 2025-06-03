import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Appbar, FAB} from 'react-native-paper';
import {AgendaView} from '@/components/calendar/AgendaView';
import {OptimizedModal} from '@/components/shared/OptimizedModal';
import {useSchedules} from "@/hooks/calendar/useSchedule";
import {initializeLocale} from "@/hooks/calendar/useLocale";

export default function CalendarScreen() {
  initializeLocale()

  const {
    selectedDate,
    visible,
    editingSchedule,
    formData,
    setSelectedDate,
    setFormData,
    showModal,
    hideModal,
    handleSaveSchedule,
    handleEditSchedule,
    handleDeleteSchedule,
    getAgendaItems
  } = useSchedules();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="캘린더"/>
        <Appbar.Action icon="bell-outline" onPress={() => {
        }}/>
      </Appbar.Header>

      <AgendaView
        items={getAgendaItems()}
        selected={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        onEditSchedule={handleEditSchedule}
        onDeleteSchedule={handleDeleteSchedule}
      />

      <OptimizedModal
        visible={visible}
        onDismiss={hideModal}
        onSave={handleSaveSchedule}
        editingSchedule={editingSchedule}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        label="새 일정"
        onPress={showModal}
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