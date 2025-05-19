import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
  const { userData } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>FlashCardApp</Text>
      <Text style={styles.greeting}>
        {userData?.fullName
          ? `Xin chào, ${userData.fullName}!`
          : 'Chào mừng bạn đến với ứng dụng học từ vựng tiếng Trung!'}
      </Text>
      <Text style={styles.tip}>
        Sử dụng thanh tab bên dưới để bắt đầu học, xem thư viện, thành tích hoặc cài đặt ứng dụng.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8fb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
    letterSpacing: 1,
  },
  greeting: {
    fontSize: 18,
    color: '#333',
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  tip: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginHorizontal: 10,
  },
});

export default HomeScreen;
