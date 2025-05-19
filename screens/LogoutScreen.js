import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function LogoutScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Bạn có chắc chắn muốn đăng xuất?</Text>
      <View style={styles.buttonRow}>
        <Button title="Đăng xuất" onPress={handleLogout} color="#d9534f" />
        <Button title="Hủy" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  question: { fontSize: 18, marginBottom: 32, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: 16 },
});