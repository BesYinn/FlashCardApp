import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import GameScreen from './screens/GameScreen';
import LibraryScreen from './screens/LibraryScreen';
import CreateCardScreen from './screens/CreateCardScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* Màn hình đăng nhập */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false  }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        {/* Màn hình chính sau khi đăng nhập thành công */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />

        {/* Các màn hình chức năng */}
        <Stack.Screen name="Learn" component={LearnScreen} options={{ title: 'Học từ vựng' }} />
        <Stack.Screen name="Game" component={GameScreen} options={{ title: 'Chơi trò chơi' }} />
        <Stack.Screen name="Library" component={LibraryScreen} options={{ title: 'Thư viện từ vựng' }} />
        <Stack.Screen name="CreateCard" component={CreateCardScreen} options={{ title: 'Tạo flashcard' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
