import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import AnimatedGif from './AnimatedGif';
import { Asset } from 'expo-asset';
import { GAME_CONFIG } from '../utils/gameConfig';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

/**
 * ARScene Component - Simulates AR by rendering animated bat images
 * @param {Object} props
 * @param {Boolean} props.active - Whether the AR scene is active
 * @param {Function} props.onBatHit - Callback when a bat is hit
 * @param {String} props.difficulty - Game difficulty level
 */
const ARScene = forwardRef(({ active = true, onBatHit, difficulty = 'MEDIUM' }, ref) => {
  const [bats, setBats] = useState([]);
  const spawnIntervalRef = useRef(null);
  const timeoutRefs = useRef([]);
  const animationsRef = useRef({});
  
  // Get difficulty settings - memoized to prevent recalculation
  const getDifficultySettings = useCallback(() => {
    const diffSettings = GAME_CONFIG.DIFFICULTY_LEVELS[difficulty];
    
    return {
      spawnIntervalMin: diffSettings.SPAWN_RATE * 0.8,
      spawnIntervalMax: diffSettings.SPAWN_RATE * 1.2,
      maxBats: diffSettings.MAX_BATS,
      scale: diffSettings.BAT_SCALE,
      zIndexRange: [1, 15]
    };
  }, [difficulty]);
  
  // Generate random position - memoized
  const generateRandomPosition = useCallback(() => {
    const settings = getDifficultySettings();
    
    // Determine spawn side and position
    const side = Math.random() > 0.5 ? 'left' : 'right';
    
    // Add padding to ensure bats are fully off screen when spawning
    const padding = 80; // Increased padding to account for bat size
    const spawnX = side === 'left' ? -padding : width + padding;
    
    // Keep bats in the middle 60% of the screen height for better visibility
    const minHeight = height * 0.2;  // 20% from top
    const maxHeight = height * 0.8;  // 20% from bottom
    const spawnY = minHeight + (Math.random() * (maxHeight - minHeight));
    
    // Adjust z-index range for better depth perception
    const minZ = settings.zIndexRange[0];
    const maxZ = settings.zIndexRange[1];
    const spawnZ = minZ + (Math.random() * (maxZ - minZ));
    
    return {
      x: spawnX,
      y: spawnY,
      z: spawnZ,
      side
    };
  }, [getDifficultySettings]);

  // Create bat animations
  const createBatAnimations = useCallback((bat, endX, flightDuration) => {
    const { speed } = bat;
    const baseDuration = 2000 / speed;
    const rotationDuration = 1000 / speed;

    return Animated.parallel([
      // Fade sequence
      Animated.sequence([
        Animated.timing(bat.opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(bat.opacity, {
          toValue: 1,
          duration: flightDuration - 600,
          useNativeDriver: true
        }),
        Animated.timing(bat.opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]),
      // Vertical movement
      Animated.loop(
        Animated.sequence([
          Animated.timing(bat.translateY, {
            toValue: 40,
            duration: baseDuration,
            easing: (t) => Math.sin(t * Math.PI),
            useNativeDriver: true
          }),
          Animated.timing(bat.translateY, {
            toValue: -40,
            duration: baseDuration,
            easing: (t) => Math.sin(t * Math.PI),
            useNativeDriver: true
          })
        ])
      ),
      // Horizontal movement
      Animated.timing(bat.translateX, {
        toValue: endX,
        duration: flightDuration,
        useNativeDriver: true
      }),
      // Rotation
      Animated.loop(
        Animated.sequence([
          Animated.timing(bat.rotation, {
            toValue: bat.position.side === 'left' ? 15 : -15,
            duration: rotationDuration,
            easing: (t) => Math.sin(t * Math.PI),
            useNativeDriver: true
          }),
          Animated.timing(bat.rotation, {
            toValue: bat.position.side === 'left' ? -15 : 15,
            duration: rotationDuration,
            easing: (t) => Math.sin(t * Math.PI),
            useNativeDriver: true
          })
        ])
      )
    ]);
  }, []);

  // Spawn a new bat
  const spawnBat = useCallback(() => {
    const settings = getDifficultySettings();
    
    if (bats.length >= settings.maxBats) return;
    
    const position = generateRandomPosition();
    const zFactor = 1 - (position.z / settings.zIndexRange[1]);
    const sizeMultiplier = 0.5 + zFactor * 0.5;
    const speed = GAME_CONFIG.DIFFICULTY_LEVELS[difficulty].BAT_SPEED;
    
    // Calculate flight distance based on screen width
    const moveDistance = width + 160; // Full screen width plus double padding
    const endX = position.side === 'left' ? moveDistance : -moveDistance;
    
    const newBat = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      position,
      scale: settings.scale * sizeMultiplier,
      rotation: new Animated.Value(position.side === 'left' ? -15 : 15), // Initial rotation based on direction
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      points: GAME_CONFIG.POINTS_PER_BAT,
      speed,
      lifespan: Math.floor(moveDistance / speed * 50) // Adjust lifespan based on speed and distance
    };
    
    const flightDuration = newBat.lifespan * 0.8;
    const animation = createBatAnimations(newBat, endX, flightDuration);
    
    // Store animation reference
    animationsRef.current[newBat.id] = animation;
    
    setBats(prevBats => [...prevBats, newBat]);
    
    // Start animation
    animation.start();
    
    // Set cleanup timeout
    const timeoutId = setTimeout(() => {
      if (active) {
        setBats(prevBats => prevBats.filter(bat => bat.id !== newBat.id));
        delete animationsRef.current[newBat.id];
      }
    }, newBat.lifespan);
    
    timeoutRefs.current.push(timeoutId);
  }, [active, bats.length, difficulty, getDifficultySettings, generateRandomPosition, createBatAnimations]);

  // Handle bat spawning
  useEffect(() => {
    if (!active) return;
    
    const settings = getDifficultySettings();
    const initialBatCount = Math.min(2, settings.maxBats - 1);

    // Spawn initial bats
    const initialSpawns = Array(initialBatCount).fill(null).map((_, i) => {
      return setTimeout(() => spawnBat(), i * 1500);
    });

    // Start regular spawn cycle
    const startSpawnCycle = setTimeout(() => {
      const scheduleNextSpawn = () => {
        const settings = getDifficultySettings();
        const spawnInterval = Math.floor(
          settings.spawnIntervalMin +
          Math.random() * (settings.spawnIntervalMax - settings.spawnIntervalMin)
        );

        spawnIntervalRef.current = setTimeout(() => {
          if (bats.length < settings.maxBats) {
            spawnBat();
          }
          scheduleNextSpawn();
        }, spawnInterval);
      };

      scheduleNextSpawn();
    }, initialBatCount * 1500 + 1000);

    // Cleanup
    return () => {
      initialSpawns.forEach(clearTimeout);
      clearTimeout(startSpawnCycle);
      if (spawnIntervalRef.current) {
        clearTimeout(spawnIntervalRef.current);
      }
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
      Object.values(animationsRef.current).forEach(animation => animation.stop());
      animationsRef.current = {};
    };
  }, [active, getDifficultySettings, spawnBat]);
  
  // Check bat hits
  const checkBatHit = useCallback((crosshairPosition) => {
    const settings = getDifficultySettings();
    const hitBatIndex = bats.findIndex(bat => {
      const dx = crosshairPosition.x - (bat.position.x + bat.translateX.__getValue());
      const dy = crosshairPosition.y - (bat.position.y + bat.translateY.__getValue());
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Base hit radius scaled by bat size and difficulty hitbox scale
      const hitRadius = 30 * bat.scale * GAME_CONFIG.DIFFICULTY_LEVELS[difficulty].HITBOX_SCALE;
      
      return distance < hitRadius;
    });
    
    if (hitBatIndex !== -1) {
      const hitBat = bats[hitBatIndex];
      
      // Stop animations
      if (animationsRef.current[hitBat.id]) {
        animationsRef.current[hitBat.id].stop();
        delete animationsRef.current[hitBat.id];
      }
      
      // Remove the bat
      setBats(prevBats => prevBats.filter(bat => bat.id !== hitBat.id));
      
      // Call the onBatHit callback with the bat's points value
      if (onBatHit) {
        onBatHit(hitBat.points);
      }
      
      return true;
    }
    
    return false;
  }, [bats, onBatHit, difficulty, getDifficultySettings]);

  // Expose checkBatHit to parent
  useImperativeHandle(
    ref,
    () => ({
      checkBatHit
    }),
    [checkBatHit]
  );
  
  return (
    <View style={styles.container}>
      {bats.map(bat => (
        <Animated.View
          key={bat.id}
          style={[
            styles.batContainer,
            {
              left: bat.position.x,
              top: bat.position.y,
              transform: [
                { scale: bat.scale },
                { translateX: bat.translateX },
                { translateY: bat.translateY },
                { rotate: bat.rotation.interpolate({
                  inputRange: [-15, 15],
                  outputRange: ['-15deg', '15deg']
                })}
              ],
              opacity: bat.opacity,
              zIndex: Math.round(bat.position.z)
            }
          ]}
        >
          <AnimatedGif
            source={require('../assets/images/pixel_bats.gif')}
            style={styles.batImage}
          />
        </Animated.View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  batContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  batImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  }
});

export default ARScene;
