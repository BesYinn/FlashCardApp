import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuizCard = ({ question, options, correctAnswer, onAnswer }) => {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option) => {
    if (!answered) {
      setSelected(option);
      setAnswered(true);
      onAnswer(option === correctAnswer);
    }
  };

  const getOptionStyle = (option) => {
    if (!answered) return styles.option;

    if (option === correctAnswer) return [styles.option, styles.correct];
    if (option === selected) return [styles.option, styles.incorrect];

    return styles.option;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.question}>{question}</Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={getOptionStyle(option)}
          onPress={() => handleSelect(option)}
          activeOpacity={0.8}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fefefe',
    padding: 20,
    borderRadius: 16,
    marginVertical: 20,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#e0e0e0',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  correct: {
    backgroundColor: '#a0e6a0',
  },
  incorrect: {
    backgroundColor: '#f7a7a7',
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default QuizCard;
