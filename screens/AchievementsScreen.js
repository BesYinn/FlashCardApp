import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const achievements = [
  { id: '1', title: 'Học được 50 từ', reward: '🎖️ Huy hiệu Chăm chỉ', points: 50 },
  { id: '2', title: 'Chơi 5 trò chơi', reward: '🏆 Huy hiệu Game thủ', points: 30 },
  { id: '3', title: 'Đăng nhập 7 ngày liên tiếp', reward: '🔥 Huy hiệu Siêng năng', points: 20 },
];

export default function AchievementsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thành tích & Phần thưởng</Text>
      <FlatList
        data={achievements}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.achievement}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.reward}>{item.reward}</Text>
            <Text style={styles.points}>+{item.points} điểm</Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.exitButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.exitButtonText}>Thoát</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  achievement: { 
    backgroundColor: '#f0f4ff', 
    borderRadius: 10, 
    padding: 16, 
    marginBottom: 16, 
    alignItems: 'center' 
  },
  title: { fontSize: 16, fontWeight: '600' },
  reward: { fontSize: 20, marginVertical: 4 },
  points: { fontSize: 14, color: '#007bff' },
  exitButton: {
    marginTop: 24,
    backgroundColor: '#eee',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});