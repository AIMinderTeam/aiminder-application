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

interface FormErrors {
  title: boolean;
  startDate: boolean;
  endDate: boolean;
  startTime: boolean;
  endTime: boolean;
  dateRange: boolean;
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
  const [showStartCalendar, setShowStartCalendar] = React.useState(false);
  const [showEndCalendar, setShowEndCalendar] = React.useState(false);

  const validateDateFormat = (date: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
  };

  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  };

  const isStartDateTimeValid = (startDateTime: string, endDateTime: string): boolean => {
    if (!startDateTime || !endDateTime) return true;

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    return start <= end;
  };

  const [errors, setErrors] = React.useState<FormErrors>({
    title: false,
    startDate: false,
    endDate: false,
    startTime: false,
    endTime: false,
    dateRange: false
  });

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
    const { startDate: startDateTime, endDate: endDateTime } = formData;
    const startDate = formatDateTime(startDateTime).date;
    const startTime = formatDateTime(startDateTime).time;
    const endDate = formatDateTime(endDateTime).date;
    const endTime = formatDateTime(endDateTime).time;

    const newErrors: FormErrors = {
      title: !formData.title.trim(),
      startDate: !validateDateFormat(startDate),
      endDate: !validateDateFormat(endDate),
      startTime: !validateTimeFormat(startTime),
      endTime: !validateTimeFormat(endTime),
      dateRange: false
    };

    if (!newErrors.startDate && !newErrors.endDate && !newErrors.startTime && !newErrors.endTime) {
      newErrors.dateRange = !isStartDateTimeValid(startDateTime, endDateTime);
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSave = React.useCallback(() => {
    if (validateForm()) {
      onSave(formData);
      onDismiss();
    }
  }, [formData, onSave, onDismiss]);

  const handleDateTimeChange = (name: 'startDate' | 'endDate', date: string, time: string) => {
    const dateTime = `${date}T${time}`;
    handleChange(name, dateTime);
    if (name === 'startDate') {
      setShowStartCalendar(false);
    } else {
      setShowEndCalendar(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return { date: '', time: '' };
    const [date, time] = dateTime.split('T');
    return { date, time: time || '' };
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
                value={formatDateTime(formData.startDate).date}
                onChangeText={(text: string) => 
                  handleDateTimeChange('startDate', text, formatDateTime(formData.startDate).time)}
                style={styles.input}
                mode="outlined"
                dense
                placeholder="YYYY-MM-DD"
                right={<TextInput.Icon icon="calendar-start" onPress={() => setShowStartCalendar(true)} />}
                error={errors.startDate}
              />
              <TextInput
                label="시작 시간"
                value={formatDateTime(formData.startDate).time}
                onChangeText={(text: string) => 
                  handleDateTimeChange('startDate', formatDateTime(formData.startDate).date, text)}
                style={styles.input}
                mode="outlined"
                dense
                placeholder="HH:mm"
                right={<TextInput.Icon icon="clock-outline" />}
                error={errors.startTime}
              />
              {showStartCalendar && (
                <Calendar
                  onDayPress={(day: any) => 
                    handleDateTimeChange('startDate', day.dateString, formatDateTime(formData.startDate).time)}
                markedDates={{
                  [formatDateTime(formData.startDate).date]: {selected: true, marked: true}
                }}
                style={styles.calendar}
              />
            )}
            {errors.startDate && (
              <HelperText type="error">올바른 날짜 형식을 입력해주세요 (YYYY-MM-DD)</HelperText>
            )}
            {errors.startTime && (
              <HelperText type="error">올바른 시간 형식을 입력해주세요 (HH:mm)</HelperText>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="종료 날짜 *"
              value={formatDateTime(formData.endDate).date}
              onChangeText={(text: string) => 
                handleDateTimeChange('endDate', text, formatDateTime(formData.endDate).time)}
              style={styles.input}
              mode="outlined"
              dense
              placeholder="YYYY-MM-DD"
              right={<TextInput.Icon icon="calendar-end" onPress={() => setShowEndCalendar(true)} />}
              error={errors.endDate}
            />
            <TextInput
              label="종료 시간"
              value={formatDateTime(formData.endDate).time}
              onChangeText={(text: string) => 
                handleDateTimeChange('endDate', formatDateTime(formData.endDate).date, text)}
              style={styles.input}
              mode="outlined"
              dense
              placeholder="HH:mm"
              right={<TextInput.Icon icon="clock-outline" />}
              error={errors.endTime}
            />
            {showEndCalendar && (
              <Calendar
                onDayPress={(day: any) => 
                  handleDateTimeChange('endDate', day.dateString, formatDateTime(formData.endDate).time)}
                markedDates={{
                  [formatDateTime(formData.endDate).date]: {selected: true, marked: true}
                }}
                minDate={formatDateTime(formData.startDate).date}
                style={styles.calendar}
              />
            )}
            {errors.endDate && (
              <HelperText type="error">올바른 날짜 형식을 입력해주세요 (YYYY-MM-DD)</HelperText>
            )}
            {errors.endTime && (
              <HelperText type="error">올바른 시간 형식을 입력해주세요 (HH:mm)</HelperText>
            )}
            {errors.dateRange && (
              <HelperText type="error">종료 일시는 시작 일시보다 늦어야 합니다</HelperText>
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