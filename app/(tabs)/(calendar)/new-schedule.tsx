import * as React from 'react';
import {View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {Text, TextInput, Button, HelperText, Appbar, Surface, Card, Divider} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import {useSchedules} from '@/hooks/calendar/useSchedule';
import {useRouter} from 'expo-router';
import {useScheduleFormStore} from '@/stores/ScheduleFormStore';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Schedule} from "@/domain/Schedule";

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

  const {handleSaveSchedule, resetFormData} = useSchedules();
  const {formData, setFormData} = useScheduleFormStore();

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
    const {startDate, startTime, endDate, endTime} = formData;

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
      <Appbar.Header style={styles.appbar} elevated>
        <Appbar.BackAction onPress={() => router.back()}/>
        <Appbar.Content title="새 일정 추가" titleStyle={styles.appbarTitle}/>
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Card style={styles.card} elevation={2}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="format-title" size={20} color="#1976d2" />
                <Text style={styles.sectionTitle}>일정 정보</Text>
              </View>
              <TextInput
                label="제목"
                value={formData.title}
                onChangeText={(text: string) => handleChange('title', text)}
                style={styles.input}
                mode="outlined"
                dense
                placeholder="일정 제목을 입력하세요"
                right={<TextInput.Icon icon="calendar-blank"/>}
                error={errors.title}
              />
              {errors.title && (
                <HelperText type="error" style={styles.errorText}>
                  제목을 입력해주세요
                </HelperText>
              )}
            </Card.Content>
          </Card>

          <Card style={styles.card} elevation={2}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#1976d2" />
                <Text style={styles.sectionTitle}>날짜 및 시간</Text>
              </View>
              
              <View style={styles.dateTimeSection}>
                <View style={styles.dateTimeHeader}>
                  <MaterialCommunityIcons name="play" size={16} color="#4caf50" />
                  <Text style={styles.dateTimeLabel}>시작</Text>
                </View>
                <View style={styles.datePickerSurface}>
                  <DateTimePicker
                    locale={"ko"}
                    value={startDate}
                    mode="datetime"
                    display="inline"
                    onChange={(event: any, date?: Date) =>
                      handleDateTimePickerChange('start', event, date)}
                    themeVariant={"light"}
                  />
                </View>
                {errors.startDate && (
                  <HelperText type="error" style={styles.errorText}>
                    시작 날짜와 시간을 선택해주세요
                  </HelperText>
                )}
              </View>

              <Divider style={styles.divider} />

              <View style={styles.dateTimeSection}>
                <View style={styles.dateTimeHeader}>
                  <MaterialCommunityIcons name="stop" size={16} color="#f44336" />
                  <Text style={styles.dateTimeLabel}>종료</Text>
                </View>
                <View style={styles.datePickerSurface}>
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
                </View>
                {errors.endDate && (
                  <HelperText type="error" style={styles.errorText}>
                    종료 날짜와 시간을 선택해주세요
                  </HelperText>
                )}
                {errors.dateRange && (
                  <HelperText type="error" style={styles.errorText}>
                    종료 일시는 시작 일시보다 늦어야 합니다
                  </HelperText>
                )}
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card} elevation={2}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="text" size={20} color="#1976d2" />
                <Text style={styles.sectionTitle}>상세 설명</Text>
              </View>
              <TextInput
                label="상세 설명 (선택사항)"
                value={formData.description}
                onChangeText={(text: string) => handleChange('description', text)}
                multiline
                numberOfLines={4}
                style={[styles.input, styles.textArea]}
                mode="outlined"
                dense
                placeholder="일정에 대한 상세 설명을 입력하세요"
                right={<TextInput.Icon icon="text"/>}
              />
            </Card.Content>
          </Card>
        </ScrollView>

        <Surface style={styles.actionBar}>
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleCancel}
              style={[styles.button, styles.cancelButton]}
              mode="outlined"
              icon="close"
              contentStyle={styles.buttonContent}
              labelStyle={styles.cancelButtonLabel}
            >
              취소
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
              icon="check"
              contentStyle={styles.buttonContent}
              labelStyle={styles.saveButtonLabel}
            >
              저장
            </Button>
          </View>
        </Surface>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  appbar: {
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  appbarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2'
  },
  formContainer: {
    flex: 1
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  cardContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1976d2'
  },
  dateTimeSection: {
    marginBottom: 16,
  },
  dateTimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateTimeLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
    color: '#333'
  },
  datePickerSurface: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#e0e0e0',
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 4,
  },
  textArea: {
    minHeight: 120,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    elevation: 2,
  },
  cancelButton: {
    borderColor: '#757575',
    borderWidth: 1.5,
  },
  saveButton: {
    backgroundColor: '#1976d2',
    elevation: 3,
  },
  buttonContent: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cancelButtonLabel: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});