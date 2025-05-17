import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ImageBackground, 
  Dimensions,
  Image,
  Animated
} from 'react-native';
import { GAME_CONFIG } from '../utils/gameConfig';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';

// Get the dimensions of the screen - in landscape mode, width is the longer dimension
const { width, height } = Dimensions.get('window');

export default function MainMenu({ navigation }) {
  const [showBats, setShowBats] = useState(true);
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const videoRef = React.useRef(null);

  useEffect(() => {
    // Create a floating animation for buttons
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Play the background video when component mounts
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Background Video */}
      <Video
        ref={videoRef}
        source={require('../assets/images/GameMenuBackground.mp4')}
        style={styles.backgroundVideo}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted={false}
      />
      
      {/* Content Container - centered layout like in the image */}
      <View style={styles.contentContainer}>
        {/* Game Title */}
        <View style={styles.titleContainer}>
          <Image
            source={require('../assets/images/TitleGame.png')}
            style={styles.titleImage}
            resizeMode="contain"
          />
        </View>

        {/* Menu Buttons - stacked in the center */}
        <View style={styles.menuContainer}>
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => navigation.navigate('GameScreen', { difficulty: 'MEDIUM' })}
            >
              <Image
                source={require('../assets/images/StartBtn On Click.png')}
                style={styles.buttonImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ translateY: floatAnim }], marginTop: 15 }}>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => navigation.navigate('SettingsScreen')}
            >
              <Image
                source={require('../assets/images/SettingsBtn On Click.png')}
                style={styles.buttonImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ translateY: floatAnim }], marginTop: 15 }}>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => navigation.navigate('LeaderboardScreen')}
            >
              <Image
                source={require('../assets/images/LeaderboardsBtn On Click.png')}
                style={styles.buttonImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleImage: {
    width: width * 0.6,
    height: height * 0.7,
    position: 'absolute',
    top: -70,
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    marginTop: 100,
    width: width * 0.4,
    height: height * 0.5,
    margin: -25,
  },
}); 
