import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRoute } from '@react-navigation/native';

const LearnScreen = () => {
  // 1. Đặt tất cả hooks ở đầu component
  const route = useRoute();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = new Animated.Value(0);

  // 2. Lấy params từ route
  const { words = [], categoryName = 'Từ vựng' } = route.params || {};

  // 3. Kiểm tra điều kiện sau khi đã khai báo hooks
  if (words.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Không có từ vựng nào trong danh mục này!
        </Text>
      </View>
    );
  }

  // 4. Các hàm xử lý
  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 1;
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  const nextCard = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipAnim.setValue(0);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      flipAnim.setValue(0);
    }
  };

  // 5. Component render
  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{categoryName}</Text>
      <Text style={styles.progress}>
        {currentIndex + 1} / {words.length}
      </Text>

      <TouchableOpacity onPress={handleFlip} activeOpacity={0.8}>
        <View style={styles.cardContainer}>
          <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
            <Text style={styles.cardWord}>{words[currentIndex].word}</Text>
            <Text style={styles.cardPinyin}>{words[currentIndex].pinyin}</Text>
          </Animated.View>

          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
            <Text style={styles.cardMeaning}>{words[currentIndex].meaning}</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, currentIndex === 0 && styles.buttonDisabled]}
          onPress={prevCard}
          disabled={currentIndex === 0}
        >
          <Text style={styles.buttonText}>← Trước</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, currentIndex === words.length - 1 && styles.buttonDisabled]}
          onPress={nextCard}
          disabled={currentIndex === words.length - 1}
        >
          <Text style={styles.buttonText}>Tiếp →</Text>
        </TouchableOpacity>
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
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  progress: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  cardContainer: {
    height: 300,
    marginVertical: 20,
    perspective: 1000,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardFront: {
    backgroundColor: '#fff',
  },
  cardBack: {
    backgroundColor: '#4a90e2',
  },
  cardWord: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardPinyin: {
    fontSize: 24,
    color: '#666',
  },
  cardMeaning: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    width: '45%',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LearnScreen;
