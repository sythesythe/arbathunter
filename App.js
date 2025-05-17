import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { LogBox, View } from 'react-native';
import MainMenu from './screens/MainMenu';
import GameScreen from './screens/GameScreen';
import SettingsScreen from './screens/SettingsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import EndScreen from './screens/EndScreen';
import LogoIntro from './components/LogoIntro';

// Ignore specific warnings that are coming from libraries we can't fix
LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified', // React Navigation warning
  'expo-av', // Video component warnings
  'Unable to resolve module', // Only for development
]);

const Stack = createStackNavigator();

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar style="light" />
        <LogoIntro onComplete={() => setShowIntro(false)} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
        <Stack.Screen name="EndScreen" component={EndScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
