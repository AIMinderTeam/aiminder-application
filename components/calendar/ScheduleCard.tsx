import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text, useTheme} from 'react-native-paper';
import {Schedule} from '@/domain/Schedule';

interface ScheduleCardProps {
  schedule: Schedule;
  onPress: (schedule: Schedule) => void;
}

export const ScheduleCard = React.memo<ScheduleCardProps>(
  ({schedule, onPress}) => {
    const theme = useTheme();

    return (
      <TouchableOpacity
        onPress={() => onPress(schedule)}
        activeOpacity={0.7}
      >
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.content}>
            <View style={styles.container}>
              <Text variant="bodyLarge" style={styles.title}>
                {schedule.title}
              </Text>
              <Text
                variant="labelMedium"
                style={[styles.time, {color: theme.colors.primary}]}
              >
                {schedule.startTime} - {schedule.endTime}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  content: {
    padding: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
  },
});