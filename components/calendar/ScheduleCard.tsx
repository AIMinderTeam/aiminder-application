import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Card, Button, Text, Appbar} from 'react-native-paper';
import {Schedule} from '@/domain/schedule';

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

export const ScheduleCard = React.memo<ScheduleCardProps>(({
                                                             schedule,
                                                             onEdit,
                                                             onDelete
                                                           }) => (
  <Card style={styles.card}>
    <Card.Title
      title={schedule.title}
      subtitle={schedule.time}
      left={(props) => <Appbar.Action {...props} icon="calendar-clock"/>}
    />
    <Card.Content>
      <Text variant="bodyMedium">{schedule.description}</Text>
    </Card.Content>
    <Card.Actions>
      <Button icon="pencil" onPress={() => onEdit(schedule)}>편집</Button>
      <Button icon="delete" onPress={() => onDelete(schedule.id)}>삭제</Button>
    </Card.Actions>
  </Card>
));

const styles = StyleSheet.create({
  card: {
    margin: 8
  }
});
