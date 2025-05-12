import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const defaultCards = require('../data/defaultCards.json');

const GameScreen = () => {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    if (!defaultCards?.cards || defaultCards.cards.length < 4) {
      Alert.alert('Lỗi', 'Không đủ từ vựng để tạo câu hỏi');
      return;
    }

    // Lấy ngẫu nhiên 1 từ làm câu hỏi
    const allWords = defaultCards.cards;
    const questionIndex = Math.floor(Math.random() * allWords.length);
    const question = allWords[questionIndex];

    // Tạo mảng đáp án với 1 đáp án đúng và 3 đáp án sai
    let answerOptions = [question];
    while (answerOptions.length < 4) {
      const randomIndex = Math.floor(Math.random() * allWords.length);
      const randomWord = allWords[randomIndex];
      if (!answerOptions.find(option => option.id === randomWord.id)) {
        answerOptions.push(randomWord);
      }
    }

    // Xáo trộn các đáp án
    answerOptions = answerOptions.sort(() => Math.random() - 0.5);

    setCurrentQuestion(question);
    setOptions(answerOptions);
  };

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer.id === currentQuestion.id) {
      setScore(score + 1);
      Alert.alert('🎉 Chính xác!', 'Bạn đã trả lời đúng!');
    } else {
      Alert.alert('❌ Sai rồi!', `Đáp án đúng là: ${currentQuestion.meaning}`);
    }

    setQuestionCount(questionCount + 1);
    if (questionCount < 9) { // Giới hạn 10 câu hỏi
      generateQuestion();
    } else {
      // Kết thúc game sau 10 câu
      Alert.alert(
        '🏆 Kết thúc!',
        `Điểm của bạn: ${score}/10`,
        [
          {
            text: 'Chơi lại',
            onPress: () => {
              setScore(0);
              setQuestionCount(0);
              generateQuestion();
            }
          },
          {
            text: 'Về trang chủ',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    }
  };

  if (!currentQuestion) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <View style={styles.scoreBoard}>
        <Text style={styles.scoreText}>Điểm: {score}/10</Text>
        <Text style={styles.questionCount}>Câu {questionCount + 1}/10</Text>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.word}>{currentQuestion.word}</Text>
        <Text style={styles.pinyin}>{currentQuestion.pinyin}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionButton}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>
              {String.fromCharCode(65 + index)}. {option.meaning}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
    padding: 20,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  questionCount: {
    fontSize: 18,
    color: '#666',
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  word: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pinyin: {
    fontSize: 20,
    color: '#666',
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
});

export default GameScreen;
