import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CreateCardScreen = () => {
  const navigation = useNavigation();
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');

  const handleSaveCard = () => {
    if (!term || !definition) {
      Alert.alert('⚠️ Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    // Tạo flashcard mới
    const newCard = {
      id: Date.now().toString(),
      term,
      definition,
      createdAt: new Date().toISOString(),
    };

    // Lưu vào storage (sẽ thêm sau)
    Alert.alert(
      '✅ Thành công',
      'Đã thêm flashcard vào thư viện!',
      [
        {
          text: 'Tạo thêm',
          onPress: () => {
            setTerm('');
            setDefinition('');
          },
        },
        {
          text: 'Xem thư viện',
          onPress: () => navigation.navigate('Library'),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✏️ Tạo Flashcard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Thuật ngữ:</Text>
        <TextInput
          style={styles.input}
          value={term}
          onChangeText={setTerm}
          placeholder="Nhập thuật ngữ cần học"
          multiline
        />

        <Text style={styles.label}>Định nghĩa:</Text>
        <TextInput
          style={[styles.input, styles.definitionInput]}
          value={definition}
          onChangeText={setDefinition}
          placeholder="Nhập định nghĩa/giải thích"
          multiline
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSaveCard}>
        <Text style={styles.buttonText}>Lưu Flashcard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f0fe',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4a90e2',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 50,
  },
  definitionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateCardScreen;
