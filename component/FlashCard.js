import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const FlashCard = ({ word, pinyin, meaning }) => {
  const [flipped, setFlipped] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));

  const flipCard = () => {
    const toValue = flipped ? 0 : 180;
    Animated.spring(rotateAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const frontInterpolate = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    position: 'absolute',
    top: 0,
  };

  return (
    <TouchableOpacity onPress={flipCard} activeOpacity={0.9}>
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <Text style={styles.word}>{word}</Text>
          <Text style={styles.pinyin}>{pinyin}</Text>
        </Animated.View>

        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <Text style={styles.meaning}>{meaning}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 300,
    height: 180,
    marginVertical: 20,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff8dc',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
    padding: 16,
  },
  cardBack: {
    backgroundColor: '#cde6d0',
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  pinyin: {
    fontSize: 20,
    color: '#666',
    marginTop: 8,
  },
  meaning: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
  },
});

export default FlashCard;
