// 기존 date → startDate / endDate 로 변경
export interface Schedule {
  id: string;
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  title: string;
  time: string;
  description: string;
}

/** AgendaItem 도 그대로 height 필드만 추가 */
export interface AgendaItem extends Schedule {
  height: number;
}