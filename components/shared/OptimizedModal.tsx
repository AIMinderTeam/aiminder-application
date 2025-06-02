import * as React from 'react';
import {Modal as RNModal, StyleSheet, View} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {Schedule} from "@/domain/schedule";

interface OptimizedModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (data: { title: string; time: string; description: string }) => void;
  editingSchedule: Schedule | null;
}

export const OptimizedModal: React.FC<OptimizedModalProps> = React.memo(({
                                                                           visible,
                                                                           onDismiss,
                                                                           onSave,
                                                                           editingSchedule,
                                                                         }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    time: '',
    description: ''
  });

  // 입력 값 변경을 위한 메모이제이션된 핸들러
  const handleChange = React.useCallback((field: string) => (
    (text: string) => setFormData(prev => ({...prev, [field]: text}))
  ), []);

  // 컴포넌트 마운트/editingSchedule 변경 시에만 실행
  React.useEffect(() => {
    if (editingSchedule) {
      setFormData({
        title: editingSchedule.title,
        time: editingSchedule.time,
        description: editingSchedule.description
      });
    } else {
      setFormData({title: '', time: '', description: ''});
    }
  }, [editingSchedule]);

  const handleSave = React.useCallback(() => {
    onSave(formData);
  }, [formData, onSave]);

  return (
    <RNModal
      visible={visible}
      onRequestClose={onDismiss}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text variant="titleLarge" style={styles.modalTitle}>
            {editingSchedule ? '일정 수정' : '새 일정'}
          </Text>

          <TextInput
            label="제목"
            value={formData.title}
            onChangeText={handleChange('title')}
            style={styles.input}
            mode="outlined"
            dense
          />

          <TextInput
            label="시간"
            value={formData.time}
            onChangeText={handleChange('time')}
            placeholder="HH:MM"
            style={styles.input}
            mode="outlined"
            dense
          />

          <TextInput
            label="설명"
            value={formData.description}
            onChangeText={handleChange('description')}
            multiline
            numberOfLines={3}
            style={styles.input}
            mode="outlined"
            dense
          />

          <View style={styles.buttonContainer}>
            <Button onPress={onDismiss} style={styles.button}>
              취소
            </Button>
            <Button mode="contained" onPress={handleSave}>
              저장
            </Button>
          </View>
        </View>
      </View>
    </RNModal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 500
  },
  modalTitle: {
    marginBottom: 16
  },
  input: {
    marginBottom: 12
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16
  },
  button: {
    marginHorizontal: 8
  }
});

export default OptimizedModal;