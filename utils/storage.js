import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'FLASHCARDS_USER';

export const saveFlashcard = async (card) => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const cards = json ? JSON.parse(json) : [];

    // Gán ID tự động nếu chưa có
    if (!card.id) {
      card.id = Date.now().toString();
    }

    cards.push(card);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error('Lỗi khi lưu flashcard:', error);
  }
};

export const getFlashcards = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Lỗi khi đọc flashcard:', error);
    return [];
  }
};

export const clearFlashcards = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Lỗi khi xoá dữ liệu:', error);
  }
};
