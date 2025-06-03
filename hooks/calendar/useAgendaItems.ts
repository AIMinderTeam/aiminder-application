import {AgendaItem} from "@/domain/Schedule";
import React from "react";

export const useAgendaItems = (items: {
  [key: string]: AgendaItem[]
}, isCalendarOpen: boolean, currentSelected: string) => {
  const getWeekRange = React.useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const start = new Date(date);
    start.setDate(date.getDate() - day);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const toISO = (d: Date) => d.toISOString().split('T')[0];
    return {start: toISO(start), end: toISO(end)};
  }, []);

  return React.useMemo(() => {
    if (isCalendarOpen) {
      return items;
    }

    const {start, end} = getWeekRange(currentSelected);
    const filtered: { [key: string]: AgendaItem[] } = {};

    Object.entries(items).forEach(([key, value]) => {
      if (key >= start && key <= end) {
        filtered[key] = value;
      }
    });

    const cursor = new Date(start);
    while (cursor.toISOString().split('T')[0] <= end) {
      const k = cursor.toISOString().split('T')[0];
      if (!filtered[k]) filtered[k] = [];
      cursor.setDate(cursor.getDate() + 1);
    }
    return filtered;
  }, [items, isCalendarOpen, getWeekRange, currentSelected]);
};