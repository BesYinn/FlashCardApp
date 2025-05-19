import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function LearnedWordsScreen() {
  const { userToken } = useContext(AuthContext);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    axios.get('/api/learned', {
      headers: { Authorization: `Bearer ${userToken}` }
    }).then(res => {
      setWords(res.data.learnedWords || []);
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#007bff" />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Các từ đã học</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={words}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.meaning}>{item.meaning}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
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
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#eaf1ff', borderRadius: 8, padding: 16, marginBottom: 12 },
  word: { fontSize: 18, fontWeight: 'bold' },
  meaning: { fontSize: 16, color: '#333', marginTop: 4 },
});