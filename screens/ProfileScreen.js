import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  ScrollView, // Thêm import này
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout, userData } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const handleAchievements = () => {
    navigation.navigate('Achievements');
  };

  const handleEditProfile = () => {
    Alert.alert('Chỉnh sửa thông tin', 'Chức năng này sẽ được cập nhật sau.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tài khoản</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {userData?.avatar ? (
              <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Ionicons name="person" size={40} color="#666" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{userData?.fullName || 'N/A'}</Text>
          <Text style={styles.userEmail}>{userData?.email || 'N/A'}</Text>
          {/* Nút chỉnh sửa thông tin */}
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={20} color="#007bff" />
            <Text style={styles.editText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>

          {/* Nút đăng xuất ngay dưới thông tin cá nhân */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        {/* Nút điều hướng đến màn hình Cài đặt
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#007bff" />
          <Text style={styles.settingText}>Cài đặt ứng dụng</Text>
        </TouchableOpacity> */}

        {/* Nút điều hướng đến màn hình Thành tích */}
        <TouchableOpacity
          style={styles.achievementButton}
          onPress={handleAchievements}
        >
          <Ionicons name="trophy-outline" size={24} color="#f7b731" />
          <Text style={styles.achievementText}>Xem thành tích</Text>
        </TouchableOpacity>

        {/* Nút điều hướng đến màn hình Flashcard của tôi */}
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => navigation.navigate('MyFlashcards')}
        >
          <Ionicons name="albums-outline" size={24} color="#007bff" />
          <Text style={styles.settingText}>Flashcard của tôi</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderAvatar: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#eaf1ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editText: {
    marginLeft: 6,
    color: '#007bff',
    fontWeight: '600',
    fontSize: 15,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
  },
  settingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  achievementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
  },
  achievementText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#f7b731',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#ff3b30',
    fontWeight: '600',
  },
});

export default ProfileScreen;