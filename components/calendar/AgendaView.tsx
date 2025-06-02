import * as React from 'react';
import {Agenda} from 'react-native-calendars';
import {Schedule, AgendaItem} from '@/domain/schedule';
import {CalendarTheme} from '@/domain/theme';
import {ScheduleCard} from './ScheduleCard';
import {EmptySchedule} from './EmptySchedule';

interface AgendaViewProps {
  items: { [key: string]: AgendaItem[] };
  selected: string;
  onDayPress: (day: { dateString: string }) => void;
  onEditSchedule: (schedule: Schedule) => void;
  onDeleteSchedule: (id: string) => void;
}

const theme: CalendarTheme = {
  agendaDayTextColor: '#6200ee',
  agendaDayNumColor: '#6200ee',
  agendaTodayColor: '#6200ee',
  agendaKnobColor: '#6200ee'
};

export const AgendaView = React.memo<AgendaViewProps>(({
                                                         items,
                                                         selected,
                                                         onDayPress,
                                                         onEditSchedule,
                                                         onDeleteSchedule
                                                       }) => (
  <Agenda
    items={items}
    selected={selected}
    onDayPress={onDayPress}
    renderItem={(item: AgendaItem) => (
      <ScheduleCard
        schedule={item}
        onEdit={onEditSchedule}
        onDelete={onDeleteSchedule}
      />
    )}
    renderEmptyDate={() => <EmptySchedule/>}
    theme={theme}
    showClosingKnob={true}
    hideExtraDays={true}
  />
));
