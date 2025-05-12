import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import VocabularyItem from '../component/VocabularyItem';

const vocabularyList = [
  { id: '1', word: '你好', pinyin: 'nǐ hǎo', meaning: 'Xin chào' },
  { id: '2', word: '谢谢', pinyin: 'xiè xie', meaning: 'Cảm ơn' },
  { id: '3', word: '再见', pinyin: 'zài jiàn', meaning: 'Tạm biệt' },
  { id: '4', word: '对不起', pinyin: 'duì bu qǐ', meaning: 'Xin lỗi' },
  { id: '5', word: '请', pinyin: 'qǐng', meaning: 'Làm ơn' },
];

const LibraryScreen = () => {
  const [searchText, setSearchText] = useState('');

  const filteredList = vocabularyList.filter(
    (item) =>
      item.word.includes(searchText) ||
      item.pinyin.toLowerCase().includes(searchText.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Thư viện từ vựng</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm từ, pinyin hoặc nghĩa..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VocabularyItem
            word={item.word}
            pinyin={item.pinyin}
            meaning={item.meaning}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.noResult}>Không tìm thấy từ phù hợp.</Text>
        }
      />
    </View>
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
});

export default LibraryScreen;
