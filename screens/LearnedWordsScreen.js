import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "../utils/axiosConfig"; // dùng instance thay vì axios mặc định

export default function LearnedWordsScreen() {
  const { userToken } = useContext(AuthContext);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLearnedWords = async () => {
      try {
        const res = await axios.get("/api/learned", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        console.log("Dữ liệu từ API:", res.data);

        // Kiểm tra và lưu từ đã học vào state
        if (res.data.learnedWords) {
          const validWords = res.data.learnedWords.filter(
            (word) => word && word.word && word.meaning
          );
          console.log("Từ đã học hợp lệ:", validWords);
          setWords(validWords);
        }
      } catch (error) {
        console.error("Lỗi khi lấy từ đã học:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userToken) {
      fetchLearnedWords();
    }
  }, [userToken]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#007bff" />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Các từ đã học</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={words}
          keyExtractor={(item) => item._id.toString()} // Sửa lại keyExtractor
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.meaning}>{item.meaning}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#eaf1ff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  word: { fontSize: 18, fontWeight: "bold" },
  meaning: { fontSize: 16, color: "#333", marginTop: 4 },
});
