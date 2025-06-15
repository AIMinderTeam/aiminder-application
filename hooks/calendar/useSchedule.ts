import * as React from 'react';
import {AgendaItem} from '@/domain/Schedule';
import {useScheduleStore} from '@/stores/ScheduleStore';
import {useDateStore} from "@/stores/DateStore";
import {useScheduleFormStore} from "@/stores/ScheduleFormStore";

export const useSchedules = () => {
  const {
    schedules,
    selectedSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    setSelectedSchedule
  } = useScheduleStore();

  const {selectedDate, setSelectedDate} = useDateStore();

  const {
    formData,
    setFormData,
    resetFormData,
    initFormData
  } = useScheduleFormStore();

  React.useEffect(() => {
    initFormData(selectedSchedule);
  }, [selectedSchedule]);

  const clearFormData = React.useCallback(() => {
    setSelectedSchedule(null);
    resetFormData();
  }, [resetFormData]);

  const handleSaveSchedule = React.useCallback(() => {
    if (!selectedDate || !formData.title) return;

    if (selectedSchedule) {
      updateSchedule(selectedSchedule.id, formData);
    } else {
      createSchedule(formData);
    }
    clearFormData();
  }, [selectedDate, formData, createSchedule, updateSchedule, clearFormData]);

  const handleEditSchedule = React.useCallback(() => {
    initFormData(selectedSchedule);
  }, [initFormData, selectedSchedule]);

  const handleDeleteSchedule = React.useCallback((id: string) => {
    deleteSchedule(id);
  }, [deleteSchedule]);

  const getAgendaItems = React.useCallback(() => {
    const items: { [key: string]: AgendaItem[] } = {};

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 3, 0);

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      items[d.toISOString().split('T')[0]] = [];
    }

    schedules.forEach(sch => {
      const startDateTime = `${sch.startDate}T${sch.startTime || '00:00'}`;
      const endDateTime = `${sch.endDate}T${sch.endTime || '23:59'}`;
      const cur = new Date(startDateTime);
      const end = new Date(endDateTime);
      while (cur <= end) {
        const key = cur.toISOString().split('T')[0];
        if (!items[key]) items[key] = [];
        items[key].push({...sch, height: 80});
        cur.setDate(cur.getDate() + 1);
      }
    });
    return items;
  }, [schedules]);

  return {
    schedules,
    selectedDate,
    formData,
    setSelectedDate,
    setFormData,
    initFormData,
    resetFormData: clearFormData,
    handleSaveSchedule,
    handleEditSchedule,
    handleDeleteSchedule,
    getAgendaItems,
    selectedSchedule,
    setSelectedSchedule,
  };
};