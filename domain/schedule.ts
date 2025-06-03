export interface Schedule {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  time: string;
  description: string;
}

export interface AgendaItem extends Schedule {
  height: number;
}