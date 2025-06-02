export interface Schedule {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
}

export interface AgendaItem extends Schedule {
  height: number;
}
