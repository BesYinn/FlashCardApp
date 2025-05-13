import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const games = [
  {
    id: '1',
    title: 'Trắc nghiệm',
    description: 'Chọn nghĩa đúng cho từ vựng',
    icon: '🎯',
    screen: 'QuizGame',
    difficulty: ['Dễ', 'Trung bình', 'Khó'],
  },
  {
    id: '2',
    title: 'Ghép từ vựng',
    description: 'Ghép từ vựng với nghĩa phù hợp',
    icon: '🔤',
    screen: 'MatchingGame',
    difficulty: ['Dễ', 'Trung bình'],
  },
];

const GamesScreen = () => {
  const navigation = useNavigation();
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setSelectedDifficulty(null);
  };

  const handleStartGame = () => {
    if (!selectedGame || !selectedDifficulty) return;
    
    navigation.navigate(selectedGame.screen, {
      difficulty: selectedDifficulty,
      gameTitle: selectedGame.title,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎮 Trò chơi học tập</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Game Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn trò chơi</Text>
          <View style={styles.gamesList}>
            {games.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={[
                  styles.gameCard,
                  selectedGame?.id === game.id && styles.selectedGame,
                ]}
                onPress={() => handleGameSelect(game)}
              >
                <Text style={styles.gameIcon}>{game.icon}</Text>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameTitle}>{game.title}</Text>
                  <Text style={styles.gameDescription}>
                    {game.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty Selection */}
        {selectedGame && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chọn độ khó</Text>
            <View style={styles.difficultyList}>
              {selectedGame.difficulty.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    selectedDifficulty === level && styles.selectedDifficulty,
                  ]}
                  onPress={() => setSelectedDifficulty(level)}
                >
                  <Text style={[
                    styles.difficultyText,
                    selectedDifficulty === level && styles.selectedDifficultyText,
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Start Button */}
        <TouchableOpacity
          style={[
            styles.startButton,
            (!selectedGame || !selectedDifficulty) && styles.startButtonDisabled,
          ]}
          onPress={handleStartGame}
          disabled={!selectedGame || !selectedDifficulty}
        >
          <Text style={styles.startButtonText}>Bắt đầu</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  gamesList: {
    gap: 12,
  },
  gameCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
  },
  selectedGame: {
    borderColor: '#4a90e2',
    backgroundColor: '#f0f8ff',
  },
  gameIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 14,
    color: '#666',
  },
  difficultyList: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    alignItems: 'center',
  },
  selectedDifficulty: {
    borderColor: '#4a90e2',
    backgroundColor: '#4a90e2',
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedDifficultyText: {
    color: '#fff',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  startButtonDisabled: {
    backgroundColor: '#ccc',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GamesScreen;