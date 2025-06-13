import * as React from 'react';
import {AgendaItem, Schedule} from '@/domain/Schedule';
import {useScheduleStore} from '@/stores/ScheduleStore';

export const useSchedules = () => {
  const {schedules, createSchedule, updateSchedule, deleteSchedule} = useScheduleStore();
  
  const [selectedDate, setSelectedDate] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [editingSchedule, setEditingSchedule] = React.useState<Schedule | null>(null);
  const [formData, setFormData] = React.useState<Schedule>({
    id: '',
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const showModal = React.useCallback(() => setVisible(true), []);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    setEditingSchedule(null);
    setFormData({
      id: '',
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    });
  }, []);

  const handleSaveSchedule = React.useCallback(() => {
    if (!selectedDate || !formData.title) return;

    if (editingSchedule) {
      updateSchedule(editingSchedule.id, formData);
    } else {
      createSchedule(formData);
    }
    hideModal();
  }, [selectedDate, formData, editingSchedule, createSchedule, updateSchedule]);

  const handleEditSchedule = React.useCallback((schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      id: schedule.id,
      title: schedule.title,
      description: schedule.description,
      startDate: schedule.startDate,
      startTime: schedule.startTime,
      endDate: schedule.endDate,
      endTime: schedule.endTime,
    });
    showModal();
  }, []);

  const handleDeleteSchedule = React.useCallback((id: string) => {
    deleteSchedule(id);
  }, [deleteSchedule]);

  const getAgendaItems = React.useCallback(() => {
    const items: {[key: string]: AgendaItem[]} = {};

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
  };
};