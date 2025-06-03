import * as React from 'react';
import {AgendaItem, Schedule} from '@/domain/schedule';
import {scheduleMockData} from "@/mock/schedule";

export const useSchedules = () => {
  const [schedules, setSchedules] = React.useState<Schedule[]>(scheduleMockData);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [editingSchedule, setEditingSchedule] = React.useState<Schedule | null>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    time: '',
    description: '',
    startDate: '',
    endDate: '',
  });


  const showModal = React.useCallback(() => setVisible(true), []);

  const hideModal = React.useCallback(() => {
    setVisible(false);
    setEditingSchedule(null);
    setFormData({
      title: '',
      time: '',
      description: '',
      startDate: '',
      endDate: '',
    });
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
      description: schedule.description,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
    });
    showModal();
  }, []);

  const handleDeleteSchedule = React.useCallback((id: string) => {
    setSchedules(prevSchedules =>
      prevSchedules.filter(schedule => schedule.id !== id)
    );
  }, []);

  const getAgendaItems = React.useCallback(() => {
    const items: {[key: string]: AgendaItem[]} = {};

    /* 이번 달 모든 날짜 미리 생성 */
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
      items[d.toISOString().split('T')[0]] = [];
    }

    /* 일정 범위 만큼 push */
    schedules.forEach(sch => {
      const cur = new Date(sch.startDate);
      const end = new Date(sch.endDate);
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
