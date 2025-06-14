import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Dialog,
  IconButton,
  Portal,
  Text,
  useTheme,
  Divider,
} from 'react-native-paper';
import {Schedule} from '@/domain/Schedule';

interface ScheduleDetailModalProps {
  visible: boolean;
  schedule: Schedule | null;
  onDismiss: () => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

export const ScheduleDetailModal: React.FC<ScheduleDetailModalProps> = ({
  visible,
  schedule,
  onDismiss,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  if (!schedule) return null;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>{schedule.title}</Dialog.Title>
        <Divider style={styles.divider} />
        <Dialog.Content>
          <View style={styles.timeContainer}>
            <IconButton
              icon="clock-outline"
              size={24}
              iconColor={theme.colors.primary}
              style={styles.clockIcon}
            />
            <View style={styles.timeTextContainer}>
              <Text variant="bodyMedium" style={styles.dateText}>
                시작: {new Date(`${schedule.startDate}T${schedule.startTime}`).toLocaleString('ko-KR')}
              </Text>
              <Text variant="bodyMedium" style={styles.dateText}>
                종료: {new Date(`${schedule.endDate}T${schedule.endTime}`).toLocaleString('ko-KR')}
              </Text>
            </View>
          </View>
          {schedule.description && (
            <View style={styles.descriptionContainer}>
              <IconButton
                icon="text-box-outline"
                size={24}
                iconColor={theme.colors.primary}
                style={styles.descriptionIcon}
              />
              <Text variant="bodyMedium" style={styles.description}>
                {schedule.description}
              </Text>
            </View>
          )}
        </Dialog.Content>
        <Divider style={styles.divider} />
        <Dialog.Actions style={styles.actions}>
          <IconButton
            icon="trash-can-outline"
            size={28}
            iconColor={theme.colors.error}
            onPress={() => onDelete(schedule.id)}
            style={styles.actionButton}
          />
          <IconButton
            icon="pencil-outline"
            size={28}
            iconColor={theme.colors.primary}
            onPress={() => onEdit(schedule)}
            style={styles.actionButton}
          />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    elevation: 5,
    margin: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 16,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 12,
  },
  clockIcon: {
    margin: 0,
    marginRight: 8,
  },
  timeTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 15,
    marginVertical: 2,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  descriptionIcon: {
    margin: 0,
    marginRight: 8,
  },
  description: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  actionButton: {
    margin: 4,
  },
});