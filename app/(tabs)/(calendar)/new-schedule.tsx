import * as React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, Appbar } from 'react-native-paper';
import { Schedule } from '@/domain/Schedule';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useSchedules } from '@/hooks/calendar/useSchedule';
import { useRouter } from 'expo-router';
import { useScheduleFormStore } from '@/stores/ScheduleFormStore';

interface FormErrors {
  title: boolean;
  startDate: boolean;
  endDate: boolean;
  startTime: boolean;
  endTime: boolean;
  dateRange: boolean;
}

export default function NewScheduleScreen() {
  const router = useRouter();

  const { handleSaveSchedule, resetFormData } = useSchedules();
  const { formData, setFormData } = useScheduleFormStore();

  const [errors, setErrors] = React.useState<FormErrors>({
    title: false,
    startDate: false,
    endDate: false,
    startTime: false,
    endTime: false,
    dateRange: false
  });

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

  const handleChange = (name: keyof Schedule, value: string) => {
    setFormData({
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
      handleSaveSchedule();
      router.back();
    }
  }, [handleSaveSchedule, router]);

  const handleCancel = React.useCallback(() => {
    resetFormData();
    router.back();
  }, [resetFormData, router]);

  const handleDateTimePickerChange = (
    type: 'start' | 'end',
    event: any,
    selectedDate?: Date
  ) => {
    if (event.type === 'set' && selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const formattedTime = format(selectedDate, 'HH:mm');

      if (type === 'start') {
        setFormData({
          ...formData,
          startDate: formattedDate,
          startTime: formattedTime,
        });
      } else {
        setFormData({
          ...formData,
          endDate: formattedDate,
          endTime: formattedTime,
        });
      }
    }
  };

  let startDate = new Date(formData.startDate + 'T' + formData.startTime);
  let endDate = new Date(formData.endDate + 'T' + formData.endTime);
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="새 일정 추가" />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
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
              <Text>시작 날짜 및 시간</Text>
              <DateTimePicker
                locale={"ko"}
                value={startDate}
                mode="datetime"
                display="inline"
                onChange={(event: any, date?: Date) =>
                  handleDateTimePickerChange('start', event, date)}
                themeVariant={"light"}
              />
              {errors.startDate && (
                <HelperText type="error">시작 날짜와 시간을 선택해주세요</HelperText>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text>종료 날짜 및 시간</Text>
              <DateTimePicker
                locale={"ko"}
                value={endDate}
                mode="datetime"
                display="inline"
                onChange={(event: any, date?: Date) =>
                  handleDateTimePickerChange('end', event, date)}
                minimumDate={startDate}
                themeVariant={"light"}
              />
              {errors.endDate && (
                <HelperText type="error">종료 날짜와 시간을 선택해주세요</HelperText>
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
                onPress={handleCancel}
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
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  formContainer: {
    flex: 1
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
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
  }
});