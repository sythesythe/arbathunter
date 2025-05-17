import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import AnimatedGif from '../components/AnimatedGif';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function EndScreen({ navigation, route }) {
  // Get game results from route params
  const { score, batsKilled, timeLeft, difficulty } = route.params || {
    score: 0,
    batsKilled: 0,
    timeLeft: 0,
    difficulty: 'MEDIUM'
  };

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  // Calculate rotation interpolation for the bat image
  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  // Reference to the background video
  const videoRef = React.useRef(null);

  // Play the background video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  }, []);

  // Get encouraging message based on performance
  const getMessage = () => {
    const killsPerMinute = batsKilled / 2; // 2 minutes total game time
    if (killsPerMinute >= 10) return "Amazing hunting skills!";
    if (killsPerMinute >= 7) return "Great job, hunter!";
    if (killsPerMinute >= 5) return "Not bad, keep practicing!";
    return "The bats were tricky today!";
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Background Video - same as MainMenu */}
      <Video
        ref={videoRef}
        source={require('../assets/images/GameMenuBackground.mp4')}
        style={styles.backgroundVideo}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted={false}
      />
      
      {/* Main content */}
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }] 
          }
        ]}
      >
        {/* Title */}
        <Text style={styles.title}>Time's Up!</Text>
        
        {/* Animated bat */}
        <Animated.View style={{ transform: [{ rotate }] }}>
          <AnimatedGif
            source={require('../assets/images/pixel_bats.gif')}
            style={styles.batImage}
          />
        </Animated.View>
        
        {/* Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.scoreText}>Final Score: {score}</Text>
          <Text style={styles.statsText}>
            Bats Eliminated: {batsKilled}
          </Text>
          <Text style={styles.messageText}>
            {getMessage()}
          </Text>
        </View>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.retryButton]}
            onPress={() => navigation.replace('GameScreen', { difficulty })}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.menuButton]}
            onPress={() => navigation.navigate('MainMenu')}
          >
            <Text style={styles.buttonText}>Main Menu</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.7,
  },
  content: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,   
    height: '70%',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: -20,
    textAlign: 'center',
    textShadowRadius: 10,
    textShadowOffset: { width: 2, height: 2 },
  },
  batImage: {
    width: 120,
    height: 120,
    marginVertical: 10,
  },
  resultsContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  scoreText: {
    fontSize: 32,
    color: '#FFC107',
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowRadius: 5,
    textShadowOffset: { width: 1, height: 1 },
  },
  statsText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 20,
    color: '#FF9800',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 0,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff4500',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
  },
  menuButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
