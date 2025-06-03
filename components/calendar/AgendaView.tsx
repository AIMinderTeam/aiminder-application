import * as React from 'react';
import {Agenda} from 'react-native-calendars';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated          // ← 추가
} from 'react-native';
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
  agendaDayTextColor: '#4395E6',
  agendaDayNumColor: '#4395E6',
  agendaTodayColor: '#4395E6',
  agendaKnobColor: '#4395E6'
};

export const AgendaView = React.memo<AgendaViewProps>(({
  items,
  selected,
  onDayPress,
  onEditSchedule,
  onDeleteSchedule
}) => {
  /* -------------------------------------------------
   * 1. 캘린더가 열리고 닫힐 때 사용할 애니메이션 값
   * -------------------------------------------------*/
  const calendarOpenAnim = React.useRef(new Animated.Value(0)).current;

  /* -------------------------------------------------
   * 2. 날짜 셀 컴포넌트
   * -------------------------------------------------*/
  const DayComponent = React.useCallback(
    ({date, state}: {date: {dateString: string; day: number}; state: string}) => {
      const dateKey = date?.dateString ?? '';
      const schedules = items[dateKey] ?? [];
      const hasSchedules = schedules.length > 0;

      const handlePress = () => {
        if (dateKey) {
          onDayPress({dateString: dateKey});
        }
      };

      /* 셀이 펼쳐짐/접힘 상태에 따라 padding 을 보간 */
      const animatedStyle = React.useMemo(
        () => ({
          paddingVertical: calendarOpenAnim.interpolate({
            inputRange: [0, 1],          // 0: 접힘, 1: 펼쳐짐
            outputRange: [4, 12]         // 원하는 패딩 값
          })
        }),
        [calendarOpenAnim]
      );

      return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
          {/* Animated.View 로 감싸서 패딩 애니메이션 적용 */}
          <Animated.View style={[styles.dayContainer, animatedStyle]}>
            <Text
              style={[
                styles.dayNumber,
                state === 'disabled' && styles.disabledDayNumber,
                dateKey === selected && styles.selectedDayNumber
              ]}>
              {date.day}
            </Text>

            {hasSchedules && (
              <Text
                style={styles.scheduleText}
                numberOfLines={1}
                ellipsizeMode="tail">
                {schedules[0].title}
              </Text>
            )}
          </Animated.View>
        </TouchableOpacity>
      );
    },
    [items, selected, onDayPress, calendarOpenAnim]
  );

  /* -------------------------------------------------
   * 3. Agenda 컴포넌트
   *    onCalendarToggled 콜백으로 열림/닫힘 감지
   * -------------------------------------------------*/
  return (
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
      renderEmptyDate={() => <EmptySchedule />}
      dayComponent={DayComponent}
      theme={theme}
      showClosingKnob
      hideExtraDays={false}
      /* 캘린더 토글 시 애니메이션 트리거 */
      onCalendarToggled={(opened: boolean) =>
        Animated.timing(calendarOpenAnim, {
          toValue: opened ? 1 : 0,
          duration: 0,
          useNativeDriver: false   // height/padding 은 레이아웃 프로퍼티이므로 false
        }).start()
      }
    />
  );
});

const styles = StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 14,
    color: '#000'
  },
  disabledDayNumber: {
    color: '#c1c1c1'
  },
  selectedDayNumber: {
    color: '#4395E6',
    fontWeight: 'bold'
  },
  scheduleText: {
    marginTop: 2,
    fontSize: 10,
    color: '#4395E6'
  }
});