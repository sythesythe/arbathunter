import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Image, TouchableWithoutFeedback, Dimensions, Animated, Easing, StyleSheet, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

// Simplified difficulty settings
const DIFFICULTY_SETTINGS = {
  EASY: {
    maxBats: 3,
    spawnInterval: 2000,  // Reduced interval
    batSize: 60,
    moveRange: 8,
    speed: 5000,  // Faster speed
  },
  MEDIUM: {
    maxBats: 5,
    spawnInterval: 1500,
    batSize: 50,
    moveRange: 6,
    speed: 4000,
  },
  HARD: {
    maxBats: 7,
    spawnInterval: 1000,
    batSize: 40,
    moveRange: 4,
    speed: 3000,
  }
};

// Hit indicator component
const HitIndicator = ({ x, y, onAnimationEnd }) => {
  const scale = useRef(new Animated.Value(0.2)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const textScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      // Circle animation
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      // Text animation
      Animated.sequence([
        Animated.spring(textScale, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Fade out both
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(onAnimationEnd);
  }, []);

  return (
    <Animated.View
      style={[
        styles.hitIndicator,
        {
          transform: [
            { translateX: x - 30 }, // Center the indicator
            { translateY: y - 30 },
          ],
          opacity,
        },
      ]}
    >
      {/* Circle */}
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale }],
          },
        ]}
      />
      {/* Hit text */}
      <Animated.Text
        style={[
          styles.hitText,
          {
            transform: [{ scale: textScale }],
          },
        ]}
      >
        HIT!
      </Animated.Text>
    </Animated.View>
  );
};

const BatSpawner = ({ onBatKilled, difficulty = 'MEDIUM' }) => {
  const [bats, setBats] = useState([]);
  const [hitEffects, setHitEffects] = useState([]);
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const spawnIntervalRef = useRef(null);
  const animationsRef = useRef({});

  // Function to create a new bat
  const createBat = useCallback(() => {
    // Always start from left side for now
    const startX = -settings.batSize;
    const startY = Math.random() * (height * 0.6) + height * 0.2;
    
    console.log('Creating new bat at:', { startX, startY, width, height });

    const newBat = {
      id: Math.random().toString(),
      x: new Animated.Value(startX),
      y: new Animated.Value(startY),
      opacity: new Animated.Value(1),
      direction: 1,  // Always moving right
    };

    // Simple horizontal movement
    const horizontalMovement = Animated.timing(newBat.x, {
      toValue: width + settings.batSize,
      duration: settings.speed,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    // Simple up and down movement
    const verticalMovement = Animated.loop(
      Animated.sequence([
        Animated.timing(newBat.y, {
          toValue: startY - settings.moveRange,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(newBat.y, {
          toValue: startY + settings.moveRange,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    // Combine movements
    const movement = Animated.parallel([horizontalMovement, verticalMovement]);

    // Start the animation
    movement.start(({ finished }) => {
      console.log('Bat animation finished:', finished);
      if (finished) {
        setBats(currentBats => currentBats.filter(bat => bat.id !== newBat.id));
        delete animationsRef.current[newBat.id];
      }
    });

    animationsRef.current[newBat.id] = movement;
    return newBat;
  }, [settings]);

  // Spawn new bats periodically
  useEffect(() => {
    console.log('Setting up bat spawner with settings:', settings);
    
    const spawnNewBat = () => {
      setBats(currentBats => {
        console.log('Current bat count:', currentBats.length, 'Max bats:', settings.maxBats);
        if (currentBats.length < settings.maxBats) {
          const newBat = createBat();
          console.log('Spawning new bat:', newBat.id);
          return [...currentBats, newBat];
        }
        return currentBats;
      });
    };

    // Initial spawn
    spawnNewBat();

    // Set up interval for spawning
    spawnIntervalRef.current = setInterval(spawnNewBat, settings.spawnInterval);

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
      Object.values(animationsRef.current).forEach(animation => {
        if (animation) animation.stop();
      });
      animationsRef.current = {};
      setBats([]);
    };
  }, [settings, createBat]);

  const handleBatTap = useCallback((batId) => {
    console.log('Bat tapped:', batId);
    const tappedBat = bats.find(bat => bat.id === batId);
    if (tappedBat) {
      // Get the current position of the bat for the hit effect
      const currentX = tappedBat.x.__getValue();
      const currentY = tappedBat.y.__getValue();

      // Add hit effect
      const hitId = Math.random().toString();
      setHitEffects(current => [...current, {
        id: hitId,
        x: currentX,
        y: currentY,
      }]);

      if (animationsRef.current[batId]) {
        animationsRef.current[batId].stop();
        delete animationsRef.current[batId];
      }

      Animated.timing(tappedBat.opacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setBats(currentBats => currentBats.filter(bat => bat.id !== batId));
        if (onBatKilled) onBatKilled();
      });
    }
  }, [bats, onBatKilled]);

  const handleHitEffectComplete = useCallback((hitId) => {
    setHitEffects(current => current.filter(effect => effect.id !== hitId));
  }, []);

  console.log('Rendering BatSpawner with', bats.length, 'bats');

  return (
    <View style={styles.container} pointerEvents="box-none">
      {bats.map(bat => (
        <TouchableWithoutFeedback 
          key={bat.id} 
          onPress={() => handleBatTap(bat.id)}
        >
          <Animated.View
            style={[
              styles.batContainer,
              {
                transform: [
                  { translateX: bat.x },
                  { translateY: bat.y },
                  { scaleX: bat.direction },
                ],
                opacity: bat.opacity,
              }
            ]}
          >
            <Image
              source={require('../assets/images/pixel_bats.gif')}
              style={{
                width: settings.batSize,
                height: settings.batSize,
              }}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      ))}
      {hitEffects.map(effect => (
        <HitIndicator
          key={effect.id}
          x={effect.x}
          y={effect.y}
          onAnimationEnd={() => handleHitEffectComplete(effect.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  batContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hitIndicator: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FF4444',
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
  },
  hitText: {
    color: '#FF4444',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default BatSpawner; 