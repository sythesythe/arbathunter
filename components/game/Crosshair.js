import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * Crosshair Component - Displays a targeting crosshair in the center of the screen
 * @param {Object} props
 * @param {Object} props.style - Additional styles for the container
 * @param {String} props.color - Color for the crosshair lines (default: white)
 * @param {String} props.centerColor - Color for the center dot (default: red)
 * @param {Number} props.size - Size of the crosshair (default: 60)
 */
const Crosshair = ({ 
  style, 
  color = 'rgba(255, 255, 255, 0.8)', 
  centerColor = 'rgb(255, 0, 0)',
  size = 60
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <View 
        style={[
          styles.horizontal, 
          { backgroundColor: color, width: size / 2 }
        ]} 
      />
      <View 
        style={[
          styles.vertical, 
          { backgroundColor: color, height: size / 2 }
        ]} 
      />
      <View 
        style={[
          styles.center, 
          { backgroundColor: centerColor }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: -200,
    marginLeft: -30,
    marginTop: -30,
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    position: 'absolute',
    width: 30,
    height: 2,
  },
  vertical: {
    position: 'absolute',
    width: 2,
    height: 30,
  },
  center: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'white',
  },
});

export default Crosshair; 