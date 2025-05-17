import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  Vibration,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import CameraView from '../components/CameraView';
import ARScene from '../components/ARScene';
import BatSpawner from '../components/BatSpawner';

import StaminaBar from '../components/game/StaminaBar';
import StatsDisplay from '../components/game/StatsDisplay';
import { GAME_CONFIG } from '../utils/gameConfig';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

export default function GameScreen({ navigation, route }) {
  // Get difficulty from settings or use default
  const difficulty = route.params?.difficulty || GAME_CONFIG.CURRENT_DIFFICULTY;
  
  // Game state
  const [gameActive, setGameActive] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute
  const [score, setScore] = useState(0);
  const [batsKilled, setBatsKilled] = useState(0);
  const [stamina, setStamina] = useState(100);
  const [lastShotTime, setLastShotTime] = useState(0);
  const [consecutiveHits, setConsecutiveHits] = useState(0);
  
  const [lastTapPosition, setLastTapPosition] = useState({ x: 0, y: 0 });
  const [lastMissPosition, setLastMissPosition] = useState(null);
  const missIndicatorTimeoutRef = useRef(null);
  const missTextOpacity = useRef(new Animated.Value(0)).current;
  const missTextScale = useRef(new Animated.Value(0.5)).current;

  // Function to animate the miss indicator
  const animateMissIndicator = useCallback((position) => {
    // Reset animation values
    missTextOpacity.setValue(0);
    missTextScale.setValue(0.5);

    // Set the miss position
    setLastMissPosition(position);

    // Animate the miss text
    Animated.parallel([
      Animated.sequence([
        Animated.timing(missTextOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(missTextOpacity, {
          toValue: 0,
          duration: 300,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(missTextScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Clear previous timeout if exists
    if (missIndicatorTimeoutRef.current) {
      clearTimeout(missIndicatorTimeoutRef.current);
    }

    // Set timeout to hide miss indicator
    missIndicatorTimeoutRef.current = setTimeout(() => {
      setLastMissPosition(null);
    }, 500);
  }, [missTextOpacity, missTextScale]);

  // Handle screen tap
  const handleScreenTap = useCallback((event) => {
    if (!gameActive || gameOver) return;
    
    const tapX = event.nativeEvent.locationX;
    const tapY = event.nativeEvent.locationY;
    
    setLastTapPosition({ x: tapX, y: tapY });
    animateMissIndicator({ x: tapX, y: tapY });
    
    // Reset consecutive hits on miss
    setConsecutiveHits(0);
    
    // Reduce stamina and score on miss
    const staminaReduction = consecutiveHits === 0 ? 12 : 8;
    const scoreReduction = Math.floor(10 * GAME_CONFIG.DIFFICULTY_LEVELS[difficulty].POINTS_MULTIPLIER);
    
    setStamina(prev => {
      const newValue = Math.max(0, prev - staminaReduction);
      if (newValue <= 0) {
        endGame(false);
      }
      return newValue;
    });

    // Reduce score on miss
    setScore(prev => Math.max(0, prev - scoreReduction));

    // Play miss sound if enabled
    if (GAME_CONFIG.SOUND_ENABLED && missSound) {
      missSound.replayAsync();
    }
  }, [gameActive, gameOver, consecutiveHits, missSound, difficulty, endGame, animateMissIndicator]);

  // Sound effects
  const [shootSound, setShootSound] = useState();
  const [hitSound, setHitSound] = useState();
  const [missSound, setMissSound] = useState();
  
  const cameraRef = useRef(null);
  const arSceneRef = useRef(null);
  const gameTimerRef = useRef(null);

  // Load sound effects - commented out until sound files are added
  useEffect(() => {
    // Sound loading is disabled until sound files are added
    /*
    async function loadSounds() {
      try {
        // These are placeholder paths - you'll need to add actual sound files
        const shootSoundObject = new Audio.Sound();
        await shootSoundObject.loadAsync(require('../assets/sounds/shoot.mp3'));
        setShootSound(shootSoundObject);
        
        const hitSoundObject = new Audio.Sound();
        await hitSoundObject.loadAsync(require('../assets/sounds/hit.mp3'));
        setHitSound(hitSoundObject);
        
        const missSoundObject = new Audio.Sound();
        await missSoundObject.loadAsync(require('../assets/sounds/miss.mp3'));
        setMissSound(missSoundObject);
      } catch (error) {
        console.log('Error loading sounds:', error);
      }
    }
    
    if (GAME_CONFIG.SOUND_ENABLED) {
      loadSounds();
    }
    
    return () => {
      // Unload sounds when component unmounts
      if (shootSound) shootSound.unloadAsync();
      if (hitSound) hitSound.unloadAsync();
      if (missSound) missSound.unloadAsync();
    };
    */
  }, [GAME_CONFIG.SOUND_ENABLED]);
  
  // End game function
  const endGame = useCallback((isWin) => {
    setGameActive(false);
    setGameOver(true);
    
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    
    // Navigate to end screen with results
    navigation.navigate('EndScreen', {
      win: true, // Always true since it's time-based
      score,
      batsKilled,
      timeLeft,
      difficulty
    });
  }, [navigation, score, batsKilled, timeLeft, difficulty]);

  // Game timer and stamina drain
  useEffect(() => {
    if (gameActive && !gameOver) {
      gameTimerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame(true); // Game ends when time runs out
            return 0;
          }
          return prev - 1;
        });

        // Get difficulty-specific stamina drain rate
        const difficultyDrain = GAME_CONFIG.DIFFICULTY_LEVELS[difficulty].STAMINA_DRAIN;
        
        setStamina(prev => {
          // Base drain rate adjusted by difficulty
          let drainRate = 1.5 * difficultyDrain;

          // Dynamic adjustments based on game state
          if (prev > 75) {
            drainRate *= 1.5;
          } else if (prev < 25) {
            drainRate *= 0.7;
          }

          // Time pressure - increased drain in final stretch
          const timeLeftPercentage = timeLeft / 60;
          if (timeLeftPercentage < 0.3) {
            drainRate *= 1.3;
          }

          // Combo factor
          if (consecutiveHits > 3) {
            drainRate *= (1 + (consecutiveHits * 0.1));
          }

          const newStamina = Math.max(0, prev - drainRate);
          
          if (newStamina <= 25 && prev > 25) {
            Vibration.vibrate(200);
          }

          if (newStamina <= 0) {
            endGame(false);
          }
          return newStamina;
        });
      }, 500);
    }
    
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, [gameActive, gameOver, difficulty, timeLeft, consecutiveHits, endGame]);

  // Handle bat kill
  const handleBatKill = () => {
    // Update score with time bonus
    const timeBonus = Math.floor(timeLeft / 10); // More points for killing bats earlier
    const difficultyMultiplier = GAME_CONFIG.DIFFICULTY_LEVELS[difficulty].POINTS_MULTIPLIER;
    const basePoints = 10;
    const totalPoints = (basePoints + timeBonus) * difficultyMultiplier;
    
    setScore(prev => prev + totalPoints);
    setBatsKilled(prev => prev + 1);

    // Calculate combo bonus
    const now = Date.now();
    const timeSinceLastShot = now - lastShotTime;
    setLastShotTime(now);

    // If kill within 2 seconds of last kill, increase consecutive hits
    if (timeSinceLastShot < 2000) {
      setConsecutiveHits(prev => prev + 1);
    } else {
      setConsecutiveHits(1);
    }

    // Increase stamina based on difficulty
    const staminaRecovery = {
      EASY: 25,
      MEDIUM: 15,
      HARD: 10
    };

    setStamina(prev => {
      const recovery = staminaRecovery[difficulty];
      return Math.min(100, prev + recovery);
    });

    // Play sound effect and vibrate
    Vibration.vibrate(100);

    if (GAME_CONFIG.SOUND_ENABLED && hitSound) {
      hitSound.replayAsync();
    }
  };

  // Handle camera permission denied
  const handleCameraPermissionDenied = useCallback(() => {
    Alert.alert(
      'Camera Permission Required',
      'This AR game needs camera access to work. Please enable camera permissions in your device settings.',
      [{ text: 'OK', onPress: () => navigation.navigate('MainMenu') }]
    );
  }, [navigation]);
  
  // Function to check if a bat is hit
  const checkBatHit = (position) => {
    // Forward the hit check to the AR scene
    if (arSceneRef.current) {
      return arSceneRef.current.checkBatHit(position);
    }
    return false;
  };

  // Handle bat hit
  const handleBatHit = useCallback((points) => {
    if (GAME_CONFIG.SOUND_ENABLED && hitSound) {
      hitSound.replayAsync();
    }
    
    Vibration.vibrate(100);
    
    const now = Date.now();
    const timeSinceLastShot = now - lastShotTime;
    setLastShotTime(now);
    
    let bonus = 0;
    if (timeSinceLastShot < 2000) {
      setConsecutiveHits(prev => prev + 1);
      bonus = Math.min(consecutiveHits * 5, 50);
    } else {
      setConsecutiveHits(1);
    }
    
    // Apply difficulty multiplier to points
    const difficultyMultiplier = GAME_CONFIG.DIFFICULTY_LEVELS[difficulty].POINTS_MULTIPLIER;
    const basePoints = points;
    const totalPoints = Math.round((basePoints + bonus) * difficultyMultiplier);
    
    setScore(prev => prev + totalPoints);
  }, [consecutiveHits, lastShotTime, hitSound, difficulty]);
  
  // Handle shooting
  const handleShoot = useCallback((tapX, tapY) => {
    if (!gameActive || gameOver) return;
    
    // Vibrate on shoot for feedback
    Vibration.vibrate(50);
    
    // Check if hit any bat
    const tapPosition = { x: tapX, y: tapY };
    const hit = checkBatHit(tapPosition);
    
    if (!hit) {
      // Miss - reduce stamina and score
      const staminaReduction = consecutiveHits === 0 ? 12 : 8;
      const scoreReduction = Math.floor(10 * GAME_CONFIG.DIFFICULTY_LEVELS[difficulty].POINTS_MULTIPLIER);
      
      animateMissIndicator(tapPosition);
      
      // Reset consecutive hits on miss
      setConsecutiveHits(0);
      
      // Reduce stamina
      setStamina(prev => {
        const newValue = Math.max(0, prev - staminaReduction);
        if (newValue <= 0) {
          endGame(false);
        }
        return newValue;
      });

      // Reduce score
      setScore(prev => Math.max(0, prev - scoreReduction));

      // Play miss sound if enabled
      if (GAME_CONFIG.SOUND_ENABLED && missSound) {
        missSound.replayAsync();
      }
    }
  }, [gameActive, gameOver, consecutiveHits, difficulty, animateMissIndicator]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Add back touch handler but with box-none to allow bat taps */}
      <TouchableWithoutFeedback onPress={handleScreenTap}>
        <View style={styles.touchLayer} pointerEvents="box-none">
          <CameraView ref={cameraRef} style={styles.cameraView}>
            <ARScene
              ref={arSceneRef}
              active={gameActive && !gameOver}
              onBatHit={handleBatHit}
              difficulty={difficulty}
            />
          </CameraView>

          {/* Bat Spawner */}
          {gameActive && !gameOver && (
            <BatSpawner onBatKilled={handleBatKill} difficulty={difficulty} />
          )}

          {/* UI Layer */}
          <View style={styles.uiContainer} pointerEvents="box-none">
            {/* Back button */}
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => {
                setGameActive(false);
                navigation.goBack();
              }}
            >
              <Image 
                source={require('../assets/images/XBtn.png')} 
                style={styles.backButtonImage} 
                resizeMode="contain"
              />
            </TouchableOpacity>
            
            {/* Stats display (time, score) */}
            <StatsDisplay
              timeLeft={timeLeft}
              score={score}
              batsKilled={batsKilled}
            />
            
            {/* Stamina bar */}
            <StaminaBar stamina={stamina} />
            
            {/* Enhanced miss indicator with animation */}
            {lastMissPosition && (
              <View style={styles.missIndicatorContainer} pointerEvents="none">
                <View style={[styles.missIndicator, {
                  left: lastMissPosition.x - 25,
                  top: lastMissPosition.y - 25
                }]} />
                
                <Animated.View style={[
                  styles.missTextContainer,
                  {
                    left: lastMissPosition.x - 50,
                    top: lastMissPosition.y - 60,
                    opacity: missTextOpacity,
                    transform: [{ scale: missTextScale }]
                  }
                ]}>
                  <Text style={styles.missMainText}>MISS!</Text>
                  <Text style={styles.missPenaltyText}>
                    -{Math.floor(10 * GAME_CONFIG.DIFFICULTY_LEVELS[difficulty].POINTS_MULTIPLIER)}
                  </Text>
                </Animated.View>
              </View>
            )}
            
            {/* Combo indicator */}
            {consecutiveHits > 1 && (
              <View style={styles.comboContainer}>
                <Text style={styles.comboText}>{consecutiveHits}x COMBO!</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'black',
  },
  touchLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  cameraView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  uiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    pointerEvents: 'box-none',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonImage: {
    width: 100,
    height: 100,
  },
  missIndicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    pointerEvents: 'none',
  },
  missIndicator: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'rgba(255, 0, 0, 0.8)',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  missTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  missMainText: {
    color: '#ff0000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  missPenaltyText: {
    color: '#ff4444',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  comboContainer: {
    position: 'absolute',
    top: height / 2 - 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 100,
  },
  comboText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});