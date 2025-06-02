import * as React from 'react';
import {AgendaItem, Schedule} from '@/domain/schedule';

export const useSchedules = () => {
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [editingSchedule, setEditingSchedule] = React.useState<Schedule | null>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    time: '',
    description: ''
  });

  const showModal = React.useCallback(() => setVisible(true), []);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    setEditingSchedule(null);
    setFormData({title: '', time: '', description: ''});
  }, []);

  const handleSaveSchedule = React.useCallback(() => {
    if (!selectedDate || !formData.title) return;

    if (editingSchedule) {
      setSchedules(prevSchedules =>
        prevSchedules.map(schedule =>
          schedule.id === editingSchedule.id
            ? {...schedule, ...formData}
            : schedule
        )
      );
    } else {
      const newSchedule: Schedule = {
        id: Date.now().toString(),
        date: selectedDate,
        ...formData
      };
      setSchedules(prevSchedules => [...prevSchedules, newSchedule]);
    }
    hideModal();
  }, [selectedDate, formData, editingSchedule]);

  const handleEditSchedule = React.useCallback((schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      title: schedule.title,
      time: schedule.time,
      description: schedule.description
    });
    showModal();
  }, []);

  const handleDeleteSchedule = React.useCallback((id: string) => {
    setSchedules(prevSchedules =>
      prevSchedules.filter(schedule => schedule.id !== id)
    );
  }, []);

  const getAgendaItems = React.useCallback(() => {
    const items: { [key: string]: AgendaItem[] } = {};
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      items[dateString] = [];
    }

    schedules.forEach((schedule) => {
      if (!items[schedule.date]) {
        items[schedule.date] = [];
      }
      items[schedule.date].push({
        ...schedule,
        height: 80
      });
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
