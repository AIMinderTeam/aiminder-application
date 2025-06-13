export interface Schedule {
  id: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  title: string;
  description: string;
}

export interface AgendaItem extends Schedule {
  height: number;
}