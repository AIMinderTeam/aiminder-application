import * as React from 'react';
import {Modal as RNModal, StyleSheet, View, KeyboardAvoidingView, Platform} from 'react-native';
import {Text, TextInput, Button, useTheme, Portal, HelperText} from 'react-native-paper';
import {Schedule} from "@/domain/Schedule";
import {Calendar} from 'react-native-calendars';

interface ScheduleFormModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (data: { title: string; time: string; description: string }) => void;
  editingSchedule: Schedule | null;
  formData: Schedule;
  setFormData: (data: Schedule) => void;
}

export const ScheduleFormModal: React.FC<ScheduleFormModalProps> = React.memo(({
  visible,
  onDismiss,
  onSave,
  editingSchedule,
  formData,
  setFormData
}) => {
  const theme = useTheme();
  const [errors, setErrors] = React.useState({
    title: false,
    startDate: false,
    endDate: false
  });
  const [showStartCalendar, setShowStartCalendar] = React.useState(false);
  const [showEndCalendar, setShowEndCalendar] = React.useState(false);

  React.useEffect(() => {
    if (editingSchedule) {
      setFormData({
        id: editingSchedule.id,
        startDate: editingSchedule.startDate,
        endDate: editingSchedule.endDate,
        title: editingSchedule.title,
        time: editingSchedule.time,
        description: editingSchedule.description,
      });
    } else {
      setFormData({
        id: '',
        startDate: '',
        endDate: '',
        title: '',
        time: '',
        description: '',
      });
    }
  }, [editingSchedule]);

  const handleChange = (name: keyof Schedule, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      title: !formData.title.trim(),
      startDate: !formData.startDate.trim(),
      endDate: !formData.endDate.trim()
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSave = React.useCallback(() => {
    if (validateForm()) {
      onSave(formData);
      onDismiss();
    }
  }, [formData, onSave, onDismiss]);

  const handleDatePress = (name: 'startDate' | 'endDate', date: string) => {
    handleChange(name, date);
    if (name === 'startDate') {
      setShowStartCalendar(false);
    } else {
      setShowEndCalendar(false);
    }
  };

  return (
    <Portal>
      <RNModal
        visible={visible}
        onRequestClose={onDismiss}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text variant="headlineMedium" style={[styles.modalTitle, { color: theme.colors.primary }]}>
              {editingSchedule ? '일정 수정' : '새 일정 추가'}
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                label="제목 *"
                value={formData.title}
                onChangeText={(text: string) => handleChange('title', text)}
                style={styles.input}
                mode="outlined"
                dense
                placeholder="일정 제목을 입력하세요"
                right={<TextInput.Icon icon="calendar" />}
                error={errors.title}
              />
              {errors.title && (
                <HelperText type="error">제목을 입력해주세요</HelperText>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="시작 날짜 *"
                value={formData.startDate}
                onChangeText={(text: string) => handleChange('startDate', text)}
                style={styles.input}
                mode="outlined"
                dense
                placeholder="YYYY-MM-DD"
                right={<TextInput.Icon icon="calendar-start" onPress={() => setShowStartCalendar(true)} />}
                error={errors.startDate}
              />
              {showStartCalendar && (
                <Calendar
                  onDayPress={(day: any) => handleDatePress('startDate', day.dateString)}
                  markedDates={{
                    [formData.startDate]: {selected: true, marked: true}
                  }}
                  style={styles.calendar}
                />
              )}
              {errors.startDate && (
                <HelperText type="error">시작 날짜를 입력해주세요</HelperText>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="종료 날짜 *"
                value={formData.endDate}
                onChangeText={(text: string) => handleChange('endDate', text)}
                style={styles.input}
                mode="outlined"
                dense
                placeholder="YYYY-MM-DD"
                right={<TextInput.Icon icon="calendar-end" onPress={() => setShowEndCalendar(true)} />}
                error={errors.endDate}
              />
              {showEndCalendar && (
                <Calendar
                  onDayPress={(day: any) => handleDatePress('endDate', day.dateString)}
                  markedDates={{
                    [formData.endDate]: {selected: true, marked: true}
                  }}
                  minDate={formData.startDate}
                  style={styles.calendar}
                />
              )}
              {errors.endDate && (
                <HelperText type="error">종료 날짜를 입력해주세요</HelperText>
              )}
            </View>

            <TextInput
              label="상세 설명"
              value={formData.description}
              onChangeText={(text: string) => handleChange('description', text)}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
              mode="outlined"
              dense
              placeholder="일정에 대한 상세 설명을 입력하세요"
            />

            <View style={styles.buttonContainer}>
              <Button 
                onPress={onDismiss} 
                style={styles.button}
                mode="outlined"
                icon="close"
              >
                취소
              </Button>
              <Button 
                mode="contained" 
                onPress={handleSave}
                style={styles.button}
                icon="check"
              >
                저장
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </RNModal>
    </Portal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  modalContent: {
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  modalTitle: {
    marginBottom: 24,
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 4,
  },
  textArea: {
    minHeight: 100
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24
  },
  button: {
    flex: 1,
    marginHorizontal: 8
  },
  calendar: {
    marginTop: 8,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  }
});