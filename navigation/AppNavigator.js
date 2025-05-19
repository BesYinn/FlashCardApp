import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabNavigator from './TabNavigator';
import CreateCardScreen from '../screens/CreateCardScreen';
import StudyScreen from '../screens/StudyScreen';
import GamesScreen from '../screens/GamesScreen';
import QuizGame from '../screens/games/QuizGame';
import MatchingGame from '../screens/games/MatchingGame';
import LogoutScreen from '../screens/LogoutScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainApp" component={TabNavigator} />
      <Stack.Screen name="CreateCard" component={CreateCardScreen} />
      <Stack.Screen name="Study" component={StudyScreen} />
      <Stack.Screen name="Games" component={GamesScreen} />
      <Stack.Screen name="QuizGame" component={QuizGame} />
      <Stack.Screen name="MatchingGame" component={MatchingGame} />
      <Stack.Screen name="Logout" component={LogoutScreen} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;