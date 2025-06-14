import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text, useTheme} from 'react-native-paper';
import {Schedule} from '@/domain/Schedule';
import {format, isBefore, isWithinInterval, parseISO} from 'date-fns';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { useEffect, useState } from 'react';

interface ScheduleCardProps {
  schedule: Schedule;
  onPress: (schedule: Schedule) => void;
}

export const ScheduleCard = React.memo<ScheduleCardProps>(
  ({schedule, onPress}) => {
    const theme = useTheme();
    const [statusColors, setStatusColors] = useState({ 
      color: theme.colors.secondary, 
      backgroundColor: theme.colors.background 
    });

    const formatTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours));
      date.setMinutes(parseInt(minutes));
      return format(date, 'hh:mm a');
    };

    const isScheduleToday = () => {
      const now = new Date();
      const startDate = new Date(parseISO(schedule.startDate).setHours(0, 0, 0, 0));
      const endDate = new Date(parseISO(schedule.endDate).setHours(23, 59, 59, 999));

      return isWithinInterval(now, {start: startDate, end: endDate});
    };

    const getScheduleStatus = () => {
      const now = new Date();
      const today = new Date();
      const [startHour, startMinute] = schedule.startTime.split(':');
      const [endHour, endMinute] = schedule.endTime.split(':');

      const startDate = new Date(today.setHours(parseInt(startHour), parseInt(startMinute)));
      const endDate = new Date(today.setHours(parseInt(endHour), parseInt(endMinute)));

      if (isBefore(endDate, now)) {
        return 'past';
      } else if (isWithinInterval(now, { start: startDate, end: endDate })) {
        return 'current';
      } else {
        return 'future';
      }
    };

    const getStatusColor = () => {
      const status = getScheduleStatus();
      switch (status) {
        case 'past':
          return { color: theme.colors.outline, backgroundColor: 'rgba(0, 0, 0, 0.05)'};
        case 'current':
          return { color: 'white', backgroundColor: theme.colors.primary };
        case 'future':
          return { color: theme.colors.shadow, backgroundColor: theme.colors.onPrimary };
        default:
          return { color: theme.colors.secondary, backgroundColor: theme.colors.background };
      }
    };

    useEffect(() => {
      setStatusColors(getStatusColor());

      if (isScheduleToday()) {
        const interval = setInterval(() => {
          setStatusColors(getStatusColor());
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [schedule]);

    return (
      <TouchableOpacity
        onPress={() => onPress(schedule)}
        activeOpacity={0.7}
      >
        <Card
          style={[
            styles.card,
            { elevation: 2, backgroundColor: statusColors.backgroundColor }
          ]}
          mode="elevated"
        >
          <Card.Content style={styles.content}>
            <View style={styles.leftContent}>
              <View style={styles.textContainer}>
                <View style={styles.timeContainer}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color={statusColors.color}
                  />
                  <Text
                    variant="bodySmall"
                    style={[styles.time, {color: statusColors.color}]}
                  >
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                  </Text>
                </View>
                <Text
                  variant="titleMedium"
                  style={[styles.title, {color: statusColors.color}]}
                >
                  {schedule.title}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  content: {
    padding: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 13,
    marginLeft: 4,
  },
});