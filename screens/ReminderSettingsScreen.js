import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ReminderSettingsScreen() {
  const navigation = useNavigation();
  const [reminderType, setReminderType] = useState('daily'); // 'daily' hoặc 'weekly'
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = () => {
    Alert.alert('Lưu thành công', 'Cài đặt nhắc nhở đã được lưu!');
    // Thực tế bạn sẽ lưu vào AsyncStorage hoặc gửi lên server
  };

  const onChangeTime = (event, selectedTime) => {
    setShowPicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#007bff" />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Cài đặt nhắc nhở học</Text>

      <Text style={styles.label}>Chọn kiểu nhắc nhở:</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            reminderType === 'daily' && styles.optionButtonActive,
          ]}
          onPress={() => setReminderType('daily')}
        >
          <Text style={reminderType === 'daily' ? styles.optionTextActive : styles.optionText}>
            Hàng ngày
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            reminderType === 'weekly' && styles.optionButtonActive,
          ]}
          onPress={() => setReminderType('weekly')}
        >
          <Text style={reminderType === 'weekly' ? styles.optionTextActive : styles.optionText}>
            Hàng tuần
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Chọn thời gian nhắc nhở:</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.timeText}>
          {time.getHours().toString().padStart(2, '0')}:
          {time.getMinutes().toString().padStart(2, '0')}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeTime}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu cài đặt</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 16, marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row', marginBottom: 16 },
  optionButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#007bff',
  },
  optionText: { color: '#333', fontWeight: '600' },
  optionTextActive: { color: '#fff', fontWeight: '600' },
  timeButton: {
    padding: 12,
    backgroundColor: '#eaf1ff',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  timeText: { fontSize: 18, color: '#007bff', fontWeight: 'bold' },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});