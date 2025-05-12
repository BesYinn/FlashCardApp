import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import FlashCard from '../component/FlashCard';

const sampleCards = [
  { id: '1', word: '你好', pinyin: 'nǐ hǎo', meaning: 'Xin chào' },
  { id: '2', word: '谢谢', pinyin: 'xiè xie', meaning: 'Cảm ơn' },
  { id: '3', word: '再见', pinyin: 'zài jiàn', meaning: 'Tạm biệt' },
  { id: '4', word: '对不起', pinyin: 'duì bu qǐ', meaning: 'Xin lỗi' },
];

const LearnScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    if (currentIndex < sampleCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentCard = sampleCards[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Học từ vựng</Text>
      
      <FlashCard
        word={currentCard.word}
        pinyin={currentCard.pinyin}
        meaning={currentCard.meaning}
      />

      <View style={styles.navButtons}>
        <TouchableOpacity
          onPress={prevCard}
          disabled={currentIndex === 0}
          style={[
            styles.navButton,
            currentIndex === 0 && styles.navButtonDisabled,
          ]}
        >
          <Text style={styles.navText}>⬅️ Trước</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={nextCard}
          disabled={currentIndex === sampleCards.length - 1}
          style={[
            styles.navButton,
            currentIndex === sampleCards.length - 1 && styles.navButtonDisabled,
          ]}
        >
          <Text style={styles.navText}>Tiếp ➡️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.progress}>
        {currentIndex + 1} / {sampleCards.length}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f5f9ff',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  navButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  navButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  navText: {
    color: '#fff',
    fontSize: 16,
  },
  progress: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default LearnScreen;
