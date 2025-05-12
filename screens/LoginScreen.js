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

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('⚠️ Lỗi', 'Vui lòng nhập email và mật khẩu!');
      return;
    }

    // Giả lập xác thực thành công
    if (email === 'test@example.com' && password === '123456') {
      Alert.alert('✅ Đăng nhập thành công!');
      navigation.replace('Home');
    } else {
      Alert.alert('❌ Đăng nhập thất bại', 'Sai email hoặc mật khẩu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
      {/* Thêm nút đăng ký */}
      <TouchableOpacity 
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>
          Chưa có tài khoản? Đăng ký ngay
        </Text>
      </TouchableOpacity>

      <Text style={styles.hint}>Email: test@example.com | Mật khẩu: 123456</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
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
  hint: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#4a90e2',
    fontSize: 16,
  },
});

export default LoginScreen;
