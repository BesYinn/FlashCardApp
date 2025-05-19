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
import axios from "../utils/axiosConfig"; // Dùng instance đã cấu hình

export default function LearnedWordsScreen() {
  const { userToken } = useContext(AuthContext);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLearnedWords = async () => {
      try {
        const res = await axios.get("/api/learnedd", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        console.log("Dữ liệu từ API:", res.data);

        // Không kiểm tra, gán thẳng dữ liệu
        setWords(res.data.learnedWords || []); // đảm bảo không undefined
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
          keyExtractor={(item, index) => item._id?.toString() || index.toString()}
          renderItem={({ item }) => {
            const word = item.wordId?.word || "Không xác định";
            const meaning = item.wordId?.meaning || "";
            return (
              <View style={styles.card}>
                <Text style={styles.word}>{word}</Text>
                <Text style={styles.meaning}>{meaning}</Text>
              </View>
            );
          }}
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
