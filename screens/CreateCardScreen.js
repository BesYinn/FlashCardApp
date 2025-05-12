import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const CreateCardScreen = () => {
  const [word, setWord] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [meaning, setMeaning] = useState('');

  const handleCreateCard = () => {
    if (!word || !pinyin || !meaning) {
      Alert.alert('⚠️ Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    // TODO: Gửi dữ liệu lên server hoặc lưu local storage
    Alert.alert('✅ Thành công', 'Flashcard đã được tạo!');
    setWord('');
    setPinyin('');
    setMeaning('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Tạo flashcard mới</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập từ tiếng Trung"
        value={word}
        onChangeText={setWord}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập phiên âm (pinyin)"
        value={pinyin}
        onChangeText={setPinyin}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập nghĩa tiếng Việt"
        value={meaning}
        onChangeText={setMeaning}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateCard}>
        <Text style={styles.buttonText}>Tạo thẻ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6ff',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    fontSize: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#5b9dfc',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CreateCardScreen;
