import * as React from 'react';
import {Modal, StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {Text, TextInput, Button, useTheme, HelperText} from 'react-native-paper';
import {Schedule} from "@/domain/Schedule";
import {Calendar} from 'react-native-calendars';

interface ScheduleFormModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: () => void;
  selectedDate: string;
  selectedSchedule: Schedule | null;
  setFormData: (data: Schedule) => void;
  formData: Schedule;
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
  selectedSchedule,
  setFormData,
  formData,
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
    const { startDate, startTime, endDate, endTime } = formData;

    const newErrors: FormErrors = {
      title: !formData.title.trim(),
      startDate: !validateDateFormat(startDate),
      endDate: !validateDateFormat(endDate),
      startTime: !validateTimeFormat(startTime),
      endTime: !validateTimeFormat(endTime),
      dateRange: false
    };

    if (!newErrors.startDate && !newErrors.endDate && !newErrors.startTime && !newErrors.endTime) {
      const startDateTime = `${startDate}T${startTime}`;
      const endDateTime = `${endDate}T${endTime}`;
      newErrors.dateRange = !isStartDateTimeValid(startDateTime, endDateTime);
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSave = React.useCallback(() => {
    if (validateForm()) {
      onSave();
      onDismiss();
    }
  }, [onSave, onDismiss]);

  const handleDateTimeChange = (type: 'start' | 'end', date?: string, time?: string) => {
    if (date) {
      handleChange(`${type}Date`, date);
    }
    if (time) {
      handleChange(`${type}Time`, time);
    }
    if (type === 'start' && date) {
      setShowStartCalendar(false);
    } else if (type === 'end' && date) {
      setShowEndCalendar(false);
    }
  };


  return (
      <Modal
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
          <View style={[styles.modalWrapper, { backgroundColor: theme.colors.surface }]}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.modalContent}>
                <Text variant="headlineMedium" style={[styles.modalTitle, { color: theme.colors.primary }]}>
                  {selectedSchedule ? '일정 수정' : '새 일정 추가'}
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
                    onChangeText={(text: string) => 
                      handleDateTimeChange('start', text)}
                    style={styles.input}
                    mode="outlined"
                    dense
                    placeholder="YYYY-MM-DD"
                    right={<TextInput.Icon icon="calendar-start" onPress={() => setShowStartCalendar(true)} />}
                    error={errors.startDate}
                  />
                  {showStartCalendar && (
                    <Calendar
                      onDayPress={(day: any) =>
                        handleDateTimeChange('start', day.dateString)}
                      markedDates={{
                        [formData.startDate]: {selected: true, marked: true}
                      }}
                      style={styles.calendar}
                    />
                  )}
                  {errors.startDate && (
                    <HelperText type="error">올바른 날짜 형식을 입력해주세요 (YYYY-MM-DD)</HelperText>
                  )}
                  <TextInput
                    label="시작 시간"
                    value={formData.startTime}
                    onChangeText={(text: string) => 
                      handleDateTimeChange('start', undefined, text)}
                    style={styles.input}
                    mode="outlined"
                    dense
                    placeholder="HH:mm"
                    right={<TextInput.Icon icon="clock-outline" />}
                    error={errors.startTime}
                  />

                {errors.startTime && (
                  <HelperText type="error">올바른 시간 형식을 입력해주세요 (HH:mm)</HelperText>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  label="종료 날짜 *"
                  value={formData.endDate}
                  onChangeText={(text: string) => 
                    handleDateTimeChange('end', text)}
                  style={styles.input}
                  mode="outlined"
                  dense
                  placeholder="YYYY-MM-DD"
                  right={<TextInput.Icon icon="calendar-end" onPress={() => setShowEndCalendar(true)} />}
                  error={errors.endDate}
                />
                {showEndCalendar && (
                  <Calendar
                    onDayPress={(day: any) =>
                      handleDateTimeChange('end', day.dateString)}
                    markedDates={{
                      [formData.endDate]: {selected: true, marked: true}
                    }}
                    minDate={formData.startDate}
                    style={styles.calendar}
                  />
                )}
                {errors.endDate && (
                  <HelperText type="error">올바른 날짜 형식을 입력해주세요 (YYYY-MM-DD)</HelperText>
                )}
                <TextInput
                  label="종료 시간"
                  value={formData.endTime}
                  onChangeText={(text: string) => 
                    handleDateTimeChange('end', undefined, text)}
                  style={styles.input}
                  mode="outlined"
                  dense
                  placeholder="HH:mm"
                  right={<TextInput.Icon icon="clock-outline" />}
                  error={errors.endTime}
                />
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
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
);
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  modalWrapper: {
    borderRadius: 20,
    width: '100%',
    maxWidth: 520,
    maxHeight: '80%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  scrollView: {
    width: '100%',
  },
  modalContent: {
    padding: 28,
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