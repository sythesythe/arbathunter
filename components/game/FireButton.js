import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * FireButton Component
 * @param {Object} props
 * @param {Function} props.onPress - Function to call when button is pressed
 * @param {Object} props.style - Additional styles to apply to the button
 * @param {String} props.label - Text to display in the button (default: 'FIRE')
 */
const FireButton = ({ onPress, style, label = 'FIRE' }) => {
  return (
    <TouchableOpacity
      style={[styles.fireButton, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.fireButtonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fireButton: {
    position: 'absolute',
    bottom: 30,
    left: 350,
    width: 400,
    height: 400,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  fireButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});

export default FireButton; 