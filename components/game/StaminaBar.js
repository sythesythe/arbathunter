import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * StaminaBar Component - Displays player's stamina as a horizontal progress bar
 * @param {Object} props
 * @param {Number} props.stamina - Current stamina value (0-100)
 * @param {Object} props.style - Additional styles to apply
 */
const StaminaBar = ({ stamina = 100, style }) => {
  // Animated value for the stamina bar width
  const widthAnim = useRef(new Animated.Value(stamina)).current;
  
  // Animated value for pulsing effect when stamina is low
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Update the width animation when stamina changes
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: stamina,
      duration: 300,
      useNativeDriver: false
    }).start();
    
    // Create pulsing effect when stamina is low
    if (stamina <= 30) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: false
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false
          })
        ])
      ).start();
    } else {
      // Stop the animation and reset to normal
      pulseAnim.setValue(1);
    }
    
    return () => {
      pulseAnim.stopAnimation();
    };
  }, [stamina]);
  
  // Calculate color based on stamina level
  const getStaminaColor = () => {
    if (stamina > 60) return '#00ff00'; // Green
    if (stamina > 30) return '#ffff00'; // Yellow
    return '#ff3300'; // Red
  };

  return (
    <View style={[styles.staminaContainer, style]}>
      <Animated.View 
        style={[
          styles.staminaBar, 
          { 
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%']
            }),
            backgroundColor: getStaminaColor(),
            opacity: stamina <= 30 ? pulseAnim : 1
          }
        ]} 
      />
      <Text style={styles.staminaText}>STAMINA</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  staminaContainer: {
    position: 'absolute',
    bottom: 30,
    width: width * 0.5,
    left: width / 2 - (width * 0.25),
    left: 250,
    height: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    zIndex: 5,
  },
  staminaBar: { 
    height: '100%',
    borderRadius: 5,
  },
  staminaText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default StaminaBar; 