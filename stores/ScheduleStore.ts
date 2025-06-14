import {create} from 'zustand';
import {Schedule} from '@/domain/Schedule';
import {scheduleMockData} from '@/mock/ScheduleMockData';

interface ScheduleState {
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  createSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  setSelectedSchedule: (schedule: Schedule | null) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: scheduleMockData,
  selectedSchedule: null,
  createSchedule: (schedule) => set((state) => ({
    schedules: [...state.schedules, { ...schedule, id: Date.now().toString() }]
  })),
  updateSchedule: (id, schedule) => set((state) => ({
    schedules: state.schedules.map((item) =>
      item.id === id ? { ...item, ...schedule } : item
    )
  })),
  deleteSchedule: (id) => set((state) => ({
    schedules: state.schedules.filter((schedule) => schedule.id !== id)
  })),
  setSelectedSchedule: (schedule) => set({ selectedSchedule: schedule })
}));