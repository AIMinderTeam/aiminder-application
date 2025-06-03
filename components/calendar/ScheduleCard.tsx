import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text, IconButton, Surface, useTheme} from 'react-native-paper';
import {Schedule} from '@/domain/schedule';

const formatTime = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

export const ScheduleCard = React.memo<ScheduleCardProps>(
  ({schedule, onEdit, onDelete}) => {
    const theme = useTheme();

    return (
      <Surface style={styles.surface} elevation={1}>
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.content}>
            <View style={styles.timeContainer}>
              <IconButton
                icon="clock-outline"
                iconColor={theme.colors.primary}
                size={18}
                style={styles.clockIcon}
              />
              <Text
                variant="labelLarge"
                style={[styles.time, {color: theme.colors.primary}]}
              >
                {`${formatTime(schedule.startDate)} — ${formatTime(
                  schedule.endDate,
                )}`}
              </Text>
            </View>
            <View style={styles.mainContent}>
              <Text variant="bodyLarge" style={styles.title}>
                {schedule.title}
              </Text>
              <View style={styles.actionButtons}>
                <IconButton
                  icon="pencil-outline"
                  accessibilityLabel="일정 편집"
                  onPress={() => onEdit(schedule)}
                  size={16}
                  mode="contained"
                  style={styles.actionButton}
                  containerColor={theme.colors.primaryContainer}
                  iconColor={theme.colors.onPrimaryContainer}
                />
                <IconButton
                  icon="delete-outline"
                  accessibilityLabel="일정 삭제"
                  onPress={() => onDelete(schedule.id)}
                  size={16}
                  mode="contained"
                  style={styles.actionButton}
                  containerColor={theme.colors.errorContainer}
                  iconColor={theme.colors.error}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
      </Surface>
    );
  },
);

const styles = StyleSheet.create({
  surface: {
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  card: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  content: {
    padding: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 24,
  },
  clockIcon: {
    margin: 0,
    padding: 0,
  },
  time: {
    fontWeight: '600',
    fontSize: 13,
    marginLeft: -4,
  },
  title: {
    flex: 1,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    margin: 0,
    padding: 0,
    marginLeft: 4,
  },
});