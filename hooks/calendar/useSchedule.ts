import * as React from 'react';
import {AgendaItem, Schedule} from '@/domain/schedule';

// CalendarScreen 컴포넌트 내부에서 초기 일정 데이터 설정
let scheduleExample = [
  {
    id: '1',
    title: '팀 미팅',
    date: '2025-06-03',
    time: '10:00',
    description: '프로젝트 진행 상황 공유'
  },
  {
    id: '2',
    title: '점심 약속',
    date: '2025-06-03',
    time: '12:30',
    description: '팀원들과 맛집 탐방'
  },
  {
    id: '3',
    title: '병원 예약',
    date: '2025-06-05',
    time: '14:00',
    description: '정기 건강 검진'
  },
  {
    id: '4',
    title: '운동',
    date: '2025-06-07',
    time: '18:00',
    description: '헬스장 PT 세션'
  },
  {
    id: '5',
    title: '가족 모임',
    date: '2025-06-09',
    time: '19:00',
    description: '부모님 댁 저녁 식사'
  }
];

export const useSchedules = () => {
  const [schedules, setSchedules] = React.useState<Schedule[]>(scheduleExample);
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
