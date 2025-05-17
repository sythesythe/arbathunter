import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * StatsDisplay Component - Displays game statistics including time, score, and bats killed
 * @param {Object} props
 * @param {Number} props.timeLeft - Time remaining in seconds
 * @param {Number} props.score - Current player score
 * @param {Number} props.batsKilled - Number of bats killed
 * @param {Object} props.style - Additional styles for the container
 */
const StatsDisplay = ({ 
  timeLeft = 60, 
  score = 0, 
  batsKilled = 0,
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Timer - centered at top */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>
      
      {/* Score and Kills - top right */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{score}</Text>
        <Text style={styles.batsText}>Bats: {batsKilled}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: width,
    zIndex: 10,
  },
  timerContainer: {
    position: 'absolute',
    top: 30,
    left: 100,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  timerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  scoreContainer: {
    position: 'absolute',
    top: 30,
    right: -40,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 60,
  },
  scoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  batsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default StatsDisplay; 