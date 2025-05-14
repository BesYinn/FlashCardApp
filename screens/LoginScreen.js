import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
        return;
      }

      const response = await axios.post('/auth/login', {
        email,
        password
      });

      if (response.data && response.data.token) {
        await login(response.data.token, response.data.user);
        Alert.alert('Thành công', 'Đăng nhập thành công!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('MainApp')
          }
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Đăng nhập thất bại',
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      );
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
      {/* Thêm nút quên mật khẩu */}
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {/* Thêm nút đăng ký */}
      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Email: test@example.com | Mật khẩu: 123456
      </Text>
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
  forgotPassword: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#4a90e2',
    fontSize: 16,
  },
});

export default LoginScreen;
