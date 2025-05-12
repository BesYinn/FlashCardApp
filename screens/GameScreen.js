import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const vocabularyList = [
  { word: '你好', pinyin: 'nǐ hǎo', meaning: 'Xin chào' },
  { word: '谢谢', pinyin: 'xiè xie', meaning: 'Cảm ơn' },
  { word: '再见', pinyin: 'zài jiàn', meaning: 'Tạm biệt' },
  { word: '对不起', pinyin: 'duì bu qǐ', meaning: 'Xin lỗi' },
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const GameScreen = () => {
  const [index, setIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState(
    shuffleArray([
      vocabularyList[0].meaning,
      ...shuffleArray(vocabularyList)
        .filter((item) => item.meaning !== vocabularyList[0].meaning)
        .slice(0, 2)
        .map((item) => item.meaning),
    ])
  );

  const currentWord = vocabularyList[index];

  const handleAnswer = (selectedMeaning) => {
    if (selectedMeaning === currentWord.meaning) {
      Alert.alert('✅ Chính xác!', '', [
        {
          text: index < vocabularyList.length - 1 ? 'Tiếp tục' : 'Kết thúc',
          onPress: () => {
            if (index < vocabularyList.length - 1) {
              const nextIndex = index + 1;
              setIndex(nextIndex);
              const nextWord = vocabularyList[nextIndex];
              setShuffledOptions(
                shuffleArray([
                  nextWord.meaning,
                  ...shuffleArray(vocabularyList)
                    .filter((item) => item.meaning !== nextWord.meaning)
                    .slice(0, 2)
                    .map((item) => item.meaning),
                ])
              );
            } else {
              setIndex(0);
              Alert.alert('🎉 Bạn đã hoàn thành trò chơi!');
            }
          },
        },
      ]);
    } else {
      Alert.alert('❌ Sai rồi!', 'Hãy thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Trò chơi từ vựng</Text>
      <Text style={styles.word}>{currentWord.word}</Text>
      <Text style={styles.pinyin}>{currentWord.pinyin}</Text>

      {shuffledOptions.map((option, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.optionButton}
          onPress={() => handleAnswer(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.progress}>
        Câu {index + 1} / {vocabularyList.length}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  word: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  pinyin: {
    fontSize: 20,
    color: '#666',
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: '#6a9cfc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
  },
  progress: {
    marginTop: 20,
    color: '#888',
    fontSize: 16,
  },
});

export default GameScreen;
