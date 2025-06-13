export interface Schedule {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
}

export interface AgendaItem extends Schedule {
  height: number;
}