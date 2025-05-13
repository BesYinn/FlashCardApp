import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  SectionList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import VocabularyItem from '../component/VocabularyItem';

// Import trực tiếp từ file JSON
const defaultCards = require('../data/defaultCards.json');

const LibraryScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [vocabularyList, setVocabularyList] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

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

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Transform grouped cards into sections format
  const sections = Object.entries(groupedCards).map(([category, words]) => ({
    title: category,
    data: words,
    expanded: expandedCategories[category] || false
  }));

  const toggleSection = (sectionTitle) => {
    setExpandedCategories(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const renderSectionHeader = ({ section }) => (
    <TouchableOpacity 
      style={styles.categoryHeader}
      onPress={() => handleStudy(section)}
    >
      <View style={styles.categoryTitleContainer}>
        <Text style={styles.categoryTitle}>{section.title}</Text>
        <Text style={styles.wordCount}>({section.data.length} từ)</Text>
      </View>
      
      {/* Thêm nút Học ngay */}
      <TouchableOpacity 
        style={styles.studyButton}
        onPress={() => handleStudy({
          title: section.title,
          words: section.data
        })}
      >
        <Text style={styles.studyButtonText}>Học ngay</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderItem = ({ item, section }) => {
    if (!expandedCategories[section.title]) return null;
    
    return (
      <View style={styles.wordItem}>
        <Text style={styles.chineseText}>{item.word}</Text>
        <Text style={styles.pinyinText}>{item.pinyin}</Text>
        <Text style={styles.meaningText}>{item.meaning}</Text>
      </View>
    );
  };

  const handleStudy = (category) => {
    if (!category?.words?.length) {
      Alert.alert(
        'Thông báo', 
        'Không có từ vựng trong danh mục này',
        [
          {
            text: 'Đóng',
            style: 'cancel'
          }
        ]
      );
      return;
    }

    navigation.navigate('Study', {
      words: category.words,
      categoryName: category.title
    });
  };

  const handleCreateCard = () => {
    navigation.navigate('CreateCard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📖 Thư viện từ vựng</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateCard')}
        >
          <Ionicons name="add-circle" size={24} color="#4a90e2" />
          <Text style={styles.addButtonText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm từ vựng..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <Text style={styles.noResult}>Không tìm thấy từ phù hợp.</Text>
        }
        contentContainerStyle={styles.list}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    marginLeft: 4,
    color: '#4a90e2',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  noResult: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  categoryContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginRight: 8,
  },
  wordCount: {
    fontSize: 14,
    color: '#666',
  },
  wordsList: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  wordItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chineseText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pinyinText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  meaningText: {
    fontSize: 16,
    color: '#333',
  },
  viewMoreButton: {
    padding: 10,
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#4a90e2',
    fontSize: 14,
  },
  wordsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  studyButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  studyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default LibraryScreen;
