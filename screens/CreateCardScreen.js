import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { AuthContext } from "../context/AuthContext"; // Cập nhật path nếu cần

const CreateCardScreen = () => {
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);

  // State cho form input
  const [word, setWord] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [exampleMeaning, setExampleMeaning] = useState("");
  const [image, setImage] = useState(null);

  // State cho dropdown
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openLevel, setOpenLevel] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Categories và levels cho dropdown
  const [categories] = useState([
    { label: "Chào hỏi", value: "greeting" },
    { label: "Số đếm", value: "numbers" },
    { label: "Màu sắc", value: "colors" },
    { label: "Thời gian", value: "time" },
  ]);

  const [levels] = useState([
    { label: "Cơ bản", value: "basic" },
    { label: "Trung bình", value: "intermediate" },
    { label: "Nâng cao", value: "advanced" },
  ]);

  // Xử lý chọn ảnh
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần cấp quyền truy cập thư viện ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Xử lý lưu flashcard
  const handleSave = async () => {
    if (!word || !pinyin || !meaning) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      const newCard = {
        word,
        pinyin,
        meaning,
        example,
        exampleMeaning,
        image,
        category: selectedCategory,
        level: selectedLevel,
      };

      const response = await fetch("http://192.168.1.122:5000/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`, // ✅ Dùng token từ context
        },
        body: JSON.stringify(newCard),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Thành công", "Đã lưu flashcard");
        navigation.goBack();
      } else {
        Alert.alert("Lỗi", data.message || "Không thể lưu flashcard");
      }
    } catch (error) {
      console.error("Lỗi khi lưu flashcard:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi lưu flashcard");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tạo Flashcard mới</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Lưu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Từ vựng */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Từ vựng (tiếng Trung) *</Text>
            <TextInput
              style={styles.input}
              value={word}
              onChangeText={setWord}
              placeholder="Nhập từ vựng"
            />
          </View>

          {/* Phiên âm */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phiên âm (pinyin) *</Text>
            <TextInput
              style={styles.input}
              value={pinyin}
              onChangeText={setPinyin}
              placeholder="Nhập phiên âm"
            />
          </View>

          {/* Nghĩa */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nghĩa (tiếng Việt) *</Text>
            <TextInput
              style={styles.input}
              value={meaning}
              onChangeText={setMeaning}
              placeholder="Nhập nghĩa"
            />
          </View>

          {/* Ví dụ */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Câu ví dụ (tiếng Trung)</Text>
            <TextInput
              style={styles.input}
              value={example}
              onChangeText={setExample}
              placeholder="Nhập câu ví dụ"
            />
          </View>

          {/* Nghĩa ví dụ */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nghĩa câu ví dụ</Text>
            <TextInput
              style={styles.input}
              value={exampleMeaning}
              onChangeText={setExampleMeaning}
              placeholder="Nhập nghĩa câu ví dụ"
            />
          </View>

          {/* Chọn chủ đề */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chủ đề</Text>
            <DropDownPicker
              open={openCategory}
              value={selectedCategory}
              items={categories}
              setOpen={setOpenCategory}
              setValue={setSelectedCategory}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              listMode="SCROLLVIEW"
            />
          </View>

          {/* Chọn cấp độ */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cấp độ</Text>
            <DropDownPicker
              open={openLevel}
              value={selectedLevel}
              items={levels}
              setOpen={setOpenLevel}
              setValue={setSelectedLevel}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              listMode="SCROLLVIEW"
            />
          </View>

          {/* Thêm hình ảnh */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hình ảnh minh họa</Text>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={24} color="#666" />
                  <Text style={styles.imagePlaceholderText}>Chọn hình ảnh</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  saveButton: {
    color: "#4a90e2",
    fontSize: 16,
    fontWeight: "bold",
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderRadius: 8,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderRadius: 8,
  },
  imageButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: "#666",
  },
});

export default CreateCardScreen;
