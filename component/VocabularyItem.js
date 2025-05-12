import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VocabularyItem = ({ word, pinyin, meaning }) => {
  return (
    <View style={styles.container}>
      <View style={styles.wordContainer}>
        <Text style={styles.word}>{word}</Text>
        <Text style={styles.pinyin}>{pinyin}</Text>
      </View>
      <Text style={styles.meaning}>{meaning}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  wordContainer: {
    flexDirection: 'column',
  },
  word: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  pinyin: {
    fontSize: 16,
    color: '#666',
  },
  meaning: {
    fontSize: 18,
    color: '#555',
  },
});

export default VocabularyItem;
