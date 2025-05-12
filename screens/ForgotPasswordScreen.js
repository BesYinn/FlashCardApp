import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('⚠️ Lỗi', 'Vui lòng nhập email!');
      return;
    }

    // Giả lập gửi email khôi phục mật khẩu
    Alert.alert(
      '✅ Thành công',
      'Link khôi phục mật khẩu đã được gửi vào email của bạn!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Quên mật khẩu</Text>
      
      <Text style={styles.description}>
        Nhập email của bạn để nhận link khôi phục mật khẩu
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Gửi yêu cầu</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backLink}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>
          ← Quay lại đăng nhập
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  backLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  backText: {
    color: '#4a90e2',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;