import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function MyFlashcardsScreen() {
  const { userToken } = useContext(AuthContext);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/flashcards', {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setFlashcards(res.data.flashcards || []);
    } catch (err) {
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchFlashcards);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#007bff" />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Flashcard của tôi</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateCard')}
      >
        <Ionicons name="add-circle-outline" size={24} color="#007bff" />
        <Text style={styles.addText}>Tạo flashcard mới</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={flashcards}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.meaning}>{item.meaning}</Text>
              {item.example ? <Text style={styles.example}>{item.example}</Text> : null}
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888' }}>Chưa có flashcard nào.</Text>}
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  addText: { marginLeft: 6, color: '#007bff', fontWeight: 'bold', fontSize: 16 },
  card: {
    backgroundColor: '#eaf1ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  word: { fontSize: 18, fontWeight: 'bold' },
  meaning: { fontSize: 16, color: '#333', marginTop: 4 },
  example: { fontStyle: 'italic', color: '#555', marginTop: 4 },
});