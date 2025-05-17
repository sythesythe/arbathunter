import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';

/**
 * AnimatedGif Component - A custom component for animating bat sprites
 * 
 * @param {Object} props
 * @param {string|number} props.source - The source of the GIF image
 * @param {Object} props.style - Additional styles for the image
 */
const AnimatedGif = ({ 
  source, 
  style,
  ...props 
}) => {
  // Use a rotation animation for bat wings
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Start the animation
  useEffect(() => {
    // Create a sequence for the bat wing flapping animation
    Animated.loop(
      Animated.sequence([
        // Flap wings up
        Animated.timing(rotateAnim, {
          toValue: 15,
          duration: 100, // Faster flap speed
          easing: Easing.bezier(0.4, 0, 0.6, 1), // Custom easing for pixel-art style
          useNativeDriver: true
        }),
        // Hold briefly at top
        Animated.timing(rotateAnim, {
          toValue: 15,
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        // Flap wings down
        Animated.timing(rotateAnim, {
          toValue: -15,
          duration: 100, // Faster flap speed
          easing: Easing.bezier(0.4, 0, 0.6, 1), // Custom easing for pixel-art style
          useNativeDriver: true
        }),
        // Hold briefly at bottom
        Animated.timing(rotateAnim, {
          toValue: -15,
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ])
    ).start();
    
    return () => {
      // Cleanup
      rotateAnim.stopAnimation();
      scaleAnim.stopAnimation();
    };
  }, []);
  
  return (
    <Animated.Image
      source={source}
      style={[
        style,
        {
          transform: [
            { rotate: rotateAnim.interpolate({
              inputRange: [-15, 15],
              outputRange: ['-15deg', '15deg']
            })}
          ]
        }
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default AnimatedGif;