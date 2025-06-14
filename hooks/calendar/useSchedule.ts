import * as React from 'react';
import {AgendaItem, Schedule} from '@/domain/Schedule';
import {useScheduleStore} from '@/stores/ScheduleStore';
import {useDateStore} from "@/stores/DateStore";
import * as Crypto from 'expo-crypto';

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
  const [visible, setVisible] = React.useState(false);

  const createInitSchedule = () => ({
    id: Crypto.randomUUID(),
    title: '',
    description: '',
    startDate: selectedDate || '',
    startTime: '09:00',
    endDate: selectedDate || '',
    endTime: '09:00',
  });

  const [formData, setFormData] = React.useState<Schedule>(createInitSchedule());

  const showModal = React.useCallback(() => {
      if (selectedSchedule) {
        setFormData({
          id: selectedSchedule.id,
          startDate: selectedSchedule.startDate,
          startTime: selectedSchedule.startTime,
          endDate: selectedSchedule.endDate,
          endTime: selectedSchedule.endTime,
          title: selectedSchedule.title,
          description: selectedSchedule.description,
        });
      } else {
        setFormData(createInitSchedule());
      }
      setVisible(true)
    }, [selectedSchedule, selectedDate]
  );

  const hideModal = React.useCallback(() => {
    setVisible(false);
    setSelectedSchedule(null);
    setFormData(createInitSchedule());
  }, []);

  const handleSaveSchedule = React.useCallback(() => {
    if (!selectedDate || !formData.title) return;

    if (selectedSchedule) {
      updateSchedule(selectedSchedule.id, formData);
    } else {
      createSchedule(formData);
    }
    hideModal();
  }, [selectedDate, formData, createSchedule, updateSchedule]);

  const handleEditSchedule = React.useCallback(() => {
    showModal();
  }, [showModal]);

  const handleDeleteSchedule = React.useCallback((id: string) => {
    deleteSchedule(id);
  }, [deleteSchedule]);

  const getAgendaItems = React.useCallback(() => {
    const items: { [key: string]: AgendaItem[] } = {};

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
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
    visible,
    formData,
    setSelectedDate,
    setFormData,
    showModal,
    hideModal,
    handleSaveSchedule,
    handleEditSchedule,
    handleDeleteSchedule,
    getAgendaItems,
    selectedSchedule,
    setSelectedSchedule,
  };
};