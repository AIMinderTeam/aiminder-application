import {create} from 'zustand';
import {Schedule} from '@/domain/Schedule';
import * as Crypto from 'expo-crypto';
import {useDateStore} from "@/stores/DateStore";

interface ScheduleFormState {
  formData: Schedule;
  createInitSchedule: () => Schedule;
  setFormData: (data: Partial<Schedule>) => void;
  resetFormData: () => void;
  initFormData: (selectedSchedule: Schedule | null) => void;
}

export const useScheduleFormStore = create<ScheduleFormState>((set, get) => ({
  formData: {
    id: Crypto.randomUUID(),
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  },

  createInitSchedule: () => {
    const selectedDate = useDateStore.getState().selectedDate;
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let times = `${hours}:${minutes}`;

    return {
      id: Crypto.randomUUID(),
      title: '',
      description: '',
      startDate: selectedDate || '',
      startTime: times,
      endDate: selectedDate || '',
      endTime: times,
    };
  },

  setFormData: (data) => set((state) => ({
    formData: {...state.formData, ...data}
  })),

  resetFormData: () => {
    const initData = get().createInitSchedule();
    set({formData: initData});
  },

  initFormData: (selectedSchedule) => {
    if (selectedSchedule) {
      set({
        formData: {
          id: selectedSchedule.id,
          startDate: selectedSchedule.startDate,
          startTime: selectedSchedule.startTime,
          endDate: selectedSchedule.endDate,
          endTime: selectedSchedule.endTime,
          title: selectedSchedule.title,
          description: selectedSchedule.description,
        }
      });
    } else {
      get().resetFormData();
    }
  }
}));
