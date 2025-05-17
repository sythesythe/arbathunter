import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { getLeaderboard } from '../services/leaderboardService';

const { width } = Dimensions.get('window');

const Leaderboard = ({ onClose }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const leaderboard = await getLeaderboard();
    setScores(leaderboard);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>Leaderboard</Text>
        
        <ScrollView style={styles.scrollView}>
          {scores.length === 0 ? (
            <Text style={styles.noScores}>No scores yet!</Text>
          ) : (
            scores.map((entry, index) => (
              <View key={index} style={styles.scoreRow}>
                <Text style={styles.rank}>#{index + 1}</Text>
                <View style={styles.scoreInfo}>
                  <Text style={styles.playerName}>{entry.playerName}</Text>
                  <Text style={styles.date}>{formatDate(entry.date)}</Text>
                </View>
                <Text style={styles.score}>{entry.score}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
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
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  modal: {
    width: width * 0.9,
    maxHeight: '80%',
    backgroundColor: '#2C3E50',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#34495E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ECF0F1',
    marginBottom: 20,
  },
  scrollView: {
    width: '100%',
    maxHeight: 400,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#34495E',
  },
  rank: {
    width: 40,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  scoreInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  playerName: {
    fontSize: 18,
    color: '#ECF0F1',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#95A5A6',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27AE60',
    minWidth: 60,
    textAlign: 'right',
  },
  noScores: {
    textAlign: 'center',
    color: '#95A5A6',
    fontSize: 18,
    marginTop: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#34495E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#ECF0F1',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Leaderboard; 