import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext.js"; // điều chỉnh path nếu cần

const { width, height } = Dimensions.get("window");

const StudyScreen = () => {
  const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { words = [], categoryName = "Từ vựng" } = route.params || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [savedWords, setSavedWords] = useState([]);
  const [learnedWords, setLearnedWords] = useState([]);

  const flipAnim = useRef(new Animated.Value(0)).current;

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

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipAnim.setValue(0);
    } else {
      // Hiển thị thông báo hoàn thành
      Alert.alert("Hoàn thành!", "Bạn đã học xong bộ từ vựng này.", [
        { text: "Học lại", onPress: () => resetStudy() },
        { text: "Quay lại", onPress: () => navigation.goBack() },
      ]);
    }
  };

  const handleSave = () => {
    const currentWord = words[currentIndex];
    if (!savedWords.includes(currentWord.id)) {
      setSavedWords([...savedWords, currentWord.id]);
    }
    handleNext();
  };

  const handleMarkLearned = async () => {
    const currentWord = words[currentIndex];
    const wordId = currentWord._id || currentWord.id;

    if (learnedWords.includes(wordId)) {
      Alert.alert(
        "Từ đã học trước đó",
        `🔤 Từ: ${currentWord.word}\n📚 Pinyin: ${currentWord.pinyin}\n📖 Nghĩa: ${currentWord.meaning}`,
        [
          { text: "Ở lại", style: "cancel" },
          { text: "Tiếp tục", onPress: () => handleNext() },
        ]
      );
      return;
    }

    // Nếu chưa học thì xử lý bình thường
    setLearnedWords([...learnedWords, wordId]);

    if (userToken) {
      await markWordAsLearned(wordId, userToken);
    } else {
      console.warn("Chưa có token đăng nhập, không thể lưu từ đã học");
    }

    Alert.alert(
      "Đã học từ thành công 🎉",
      `Bạn đã hoàn thành từ này!\n\n🔤 Từ: ${currentWord.word}\n📚 Pinyin: ${currentWord.pinyin}\n📖 Nghĩa: ${currentWord.meaning}`,
      [{ text: "Tiếp tục", onPress: () => handleNext() }]
    );
  };

  const resetStudy = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    flipAnim.setValue(0);
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  if (words.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Không có từ vựng nào trong danh mục này!
        </Text>
      </View>
    );
  }

  const currentWord = words[currentIndex];

  const markWordAsLearned = async (wordId, token) => {
    try {
      console.log("Đang gửi từ đã học:", wordId);
      const res = await fetch("http://192.168.1.132:5000/api/learned", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ wordId }),
      });

      const data = await res.json();
      console.log("Kết quả lưu:", data);

      if (!res.ok) {
        console.error("Lỗi server:", data);
      }
    } catch (error) {
      console.log("Lỗi khi lưu từ đã học:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <Text style={styles.progress}>
          {currentIndex + 1}/{words.length}
        </Text>
      </View>

      {/* Flashcard */}
      <View style={styles.cardContainer}>
        <Animated.View
          style={[styles.card, styles.frontCard, frontAnimatedStyle]}
        >
          <Text style={styles.chineseText}>{currentWord.word}</Text>
          <Text style={styles.pinyinText}>{currentWord.pinyin}</Text>
        </Animated.View>

        <Animated.View
          style={[styles.card, styles.backCard, backAnimatedStyle]}
        >
          <Text style={styles.meaningText}>{currentWord.meaning}</Text>
        </Animated.View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.flipButton]}
          onPress={handleFlip}
        >
          <Ionicons name="reload" size={24} color="#fff" />
          <Text style={styles.actionText}>Lật thẻ</Text>
        </TouchableOpacity>

        <View style={styles.bottomActions}>
          {/* <TouchableOpacity 
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
          >
            <Ionicons name="bookmark" size={24} color="#fff" />
            <Text style={styles.actionText}>Lưu lại</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={[styles.actionButton, styles.learnedButton]}
            onPress={handleMarkLearned}
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.actionText}>Đã học</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.nextButton]}
            onPress={handleNext}
          >
            <Ionicons name="arrow-forward" size={24} color="#fff" />
            <Text style={styles.actionText}>Tiếp theo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9ff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progress: {
    fontSize: 16,
    color: "#666",
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: width - 40,
    height: height * 0.4,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backfaceVisibility: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  frontCard: {
    backgroundColor: "#fff",
  },
  backCard: {
    backgroundColor: "#4a90e2",
  },
  chineseText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pinyinText: {
    fontSize: 24,
    color: "#666",
  },
  meaningText: {
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
  },
  actions: {
    padding: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  flipButton: {
    backgroundColor: "#4a90e2",
    marginBottom: 20,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#ff9500",
    flex: 1,
    marginRight: 5,
  },
  learnedButton: {
    backgroundColor: "#34c759",
    flex: 1,
    marginHorizontal: 5,
  },
  nextButton: {
    backgroundColor: "#5856d6",
    flex: 1,
    marginLeft: 5,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default StudyScreen;
