import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const handleChangePassword = () => {
    Alert.alert('Đổi mật khẩu', 'Chức năng này sẽ được cập nhật sau.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Xóa tài khoản',
      'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const handleNotificationSettings = () => {
    Alert.alert('Cài đặt thông báo', 'Chức năng này sẽ được cập nhật sau.');
    // Hoặc điều hướng sang màn hình cài đặt thông báo nếu có:
    // navigation.navigate('NotificationSettings');
  };
  const handleLanguageSettings = () => {
    Alert.alert('Cài đặt ngôn ngữ', 'Chức năng này sẽ được cập nhật sau.');
    // Nếu sau này có màn hình cài đặt ngôn ngữ, bỏ comment dòng dưới:
    // navigation.navigate('LanguageSettings');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cài đặt ứng dụng</Text>

      <TouchableOpacity style={styles.item} onPress={handleNotificationSettings}>
        <Ionicons name="notifications-outline" size={22} color="#007bff" />
        <Text style={styles.itemText}>Cài đặt thông báo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleLanguageSettings}>
        <Ionicons name="language-outline" size={22} color="#007bff" />
        <Text style={styles.itemText}>Cài đặt ngôn ngữ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleChangePassword}>
        <Ionicons name="key-outline" size={22} color="#007bff" />
        <Text style={styles.itemText}>Đổi mật khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('ReminderSettings')}
      >
        <Ionicons name="alarm-outline" size={22} color="#007bff" />
        <Text style={styles.itemText}>Cài đặt nhắc nhở học</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={handleDeleteAccount}>
        <Ionicons name="trash-outline" size={22} color="#ff3b30" />
        <Text style={[styles.itemText, { color: '#ff3b30' }]}>Xóa tài khoản</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: { marginLeft: 12, fontSize: 16, color: '#333' },
});

// import SettingsScreen from '../screens/SettingsScreen';

// {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}