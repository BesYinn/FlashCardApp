import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("⚠️ Lỗi", "Vui lòng nhập email!");
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.175.118:5000/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("✅ Thành công", data.message, [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("❌ Thất bại", data.message);
      }
    } catch (error) {
      Alert.alert("❌ Lỗi kết nối", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Quên mật khẩu</Text>

      <Text style={styles.description}>
        Nhập email của bạn để nhận link khôi phục mật khẩu
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Gửi yêu cầu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backLink}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f0fe",
    justifyContent: "center",
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  backLink: {
    marginTop: 20,
    alignItems: "center",
  },
  backText: {
    color: "#4a90e2",
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
