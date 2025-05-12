import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import VocabularyItem from '../component/VocabularyItem';

// Import trực tiếp từ file JSON
const defaultCards = require('../data/defaultCards.json');

const LibraryScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [vocabularyList, setVocabularyList] = useState([]);

  useEffect(() => {
    console.log('Attempting to load vocabulary...');
    loadVocabulary();
  }, []);

  const loadVocabulary = () => {
    try {
      if (defaultCards && defaultCards.cards) {
        console.log('Loaded cards:', defaultCards.cards); // Debug log
        setVocabularyList(defaultCards.cards);
      } else {
        console.log('No cards found in defaultCards'); // Debug log
        setVocabularyList([]);
      }
    } catch (error) {
      console.error('Error loading vocabulary:', error);
      setVocabularyList([]);
    }
  };

  const filteredList = vocabularyList?.filter(
    (item) =>
      item.word?.includes(searchText) ||
      item.pinyin?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.meaning?.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  const groupedCards = filteredList.reduce((groups, card) => {
    const category = card.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(card);
    return groups;
  }, {});

  const handleCategoryPress = (category) => {
    const categoryWords = groupedCards[category];
    if (categoryWords && categoryWords.length > 0) {
      navigation.navigate('Learn', {
        words: categoryWords,
        categoryName: category
      });
    } else {
      Alert.alert('Thông báo', 'Không có từ vựng nào trong danh mục này!');
    }
  };

  const renderCategory = ({ item: category }) => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity 
        style={styles.categoryHeader}
        onPress={() => handleCategoryPress(category)}
      >
        <Text style={styles.categoryTitle}>{category}</Text>
        <Text style={styles.wordCount}>
          {groupedCards[category].length} từ
        </Text>
      </TouchableOpacity>

      <FlatList
        data={groupedCards[category].slice(0, 3)} // Hiển thị 3 từ đầu tiên
        renderItem={({ item }) => (
          <VocabularyItem
            key={item.id}
            word={item.word}
            pinyin={item.pinyin}
            meaning={item.meaning}
          />
        )}
        ListFooterComponent={
          groupedCards[category].length > 3 ? (
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={styles.viewMoreText}>
                Xem thêm {groupedCards[category].length - 3} từ...
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📖 Thư viện từ vựng</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm từ, pinyin hoặc nghĩa..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={Object.keys(groupedCards)}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        ListEmptyComponent={
          <Text style={styles.noResult}>Không tìm thấy từ phù hợp.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  noResult: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  wordCount: {
    fontSize: 14,
    color: '#666',
  },
  viewMoreButton: {
    padding: 10,
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#4a90e2',
    fontSize: 14,
  }
});

export default LibraryScreen;
