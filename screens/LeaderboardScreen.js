import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';
import { GAME_CONFIG } from '../utils/gameConfig';

const { width, height } = Dimensions.get('window');

// Hardcoded leaderboard data
const LEADERBOARD_DATA = [
  { id: '1', name: 'Bat Master', score: 5650, date: '2023-05-10', difficulty: 'HARD' },
  { id: '2', name: 'Night Hunter', score: 4320, date: '2023-05-09', difficulty: 'MEDIUM' },
  { id: '3', name: 'Shadow Slayer', score: 3990, date: '2023-05-08', difficulty: 'HARD' },
  { id: '4', name: 'Vampire Hunter', score: 3280, date: '2023-05-07', difficulty: 'MEDIUM' },
  { id: '5', name: 'Echo Lord', score: 2950, date: '2023-05-06', difficulty: 'EASY' },
  { id: '6', name: 'Wing Seeker', score: 2840, date: '2023-05-05', difficulty: 'MEDIUM' },
  { id: '7', name: 'Nocturnal Hero', score: 2735, date: '2023-05-04', difficulty: 'HARD' },
  { id: '8', name: 'Sonar Expert', score: 2530, date: '2023-05-03', difficulty: 'MEDIUM' },
  { id: '9', name: 'Twilight Hunter', score: 2220, date: '2023-05-02', difficulty: 'EASY' },
  { id: '10', name: 'Cavern Explorer', score: 2110, date: '2023-05-01', difficulty: 'MEDIUM' },
];

export default function LeaderboardScreen({ navigation }) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    // Play the background video when component mounts
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Background Video - same as main menu */}
      <Video
        ref={videoRef}
        source={require('../assets/images/GameMenuBackground.mp4')}
        style={styles.backgroundVideo}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted={!GAME_CONFIG.SOUND_ENABLED} // Match sound settings
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>LEADERBOARD</Text>
        
        {/* Simple table header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.rankCell]}>RANK</Text>
          <Text style={[styles.headerCell, styles.nameCell]}>NAME</Text>
          <Text style={[styles.headerCell, styles.scoreCell]}>SCORE</Text>
          <Text style={[styles.headerCell, styles.dateCell]}>DATE</Text>
          <Text style={[styles.headerCell, styles.difficultyCell]}>DIFF</Text>
        </View>
        
        {/* Scrollable leaderboard rows */}
        <ScrollView style={styles.tableBody}>
          {LEADERBOARD_DATA.map((item, index) => (
            <View 
              key={item.id} 
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow,
                index === 0 ? styles.firstPlace : null,
                index === 1 ? styles.secondPlace : null,
                index === 2 ? styles.thirdPlace : null
              ]}
            >
              <Text style={[styles.cell, styles.rankCell]}>{index + 1}</Text>
              <Text style={[styles.cell, styles.nameCell]}>{item.name}</Text>
              <Text style={[styles.cell, styles.scoreCell]}>{item.score}</Text>
              <Text style={[styles.cell, styles.dateCell]}>{item.date}</Text>
              <Text 
                style={[
                  styles.cell, 
                  styles.difficultyCell,
                  item.difficulty === 'EASY' ? styles.easyDifficulty :
                  item.difficulty === 'MEDIUM' ? styles.mediumDifficulty :
                  styles.hardDifficulty
                ]}
              >
                {item.difficulty}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image 
          source={require('../assets/images/BackBtn.png')} 
          style={styles.backButtonImage} 
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0026',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.85, // Match the opacity from MainMenu
  },
  content: {
    width: width * 0.8,
    height: height * 0.7,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 1,
  },
  headerCell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableBody: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  evenRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  oddRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  firstPlace: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  secondPlace: {
    backgroundColor: 'rgba(192, 192, 192, 0.15)',
  },
  thirdPlace: {
    backgroundColor: 'rgba(205, 127, 50, 0.15)',
  },
  cell: {
    color: 'white',
    fontSize: 14,
  },
  rankCell: {
    width: '10%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  nameCell: {
    width: '30%',
  },
  scoreCell: {
    width: '20%',
    textAlign: 'center',
    color: '#FF3366',
    fontWeight: 'bold',
  },
  dateCell: {
    width: '20%',
    textAlign: 'center',
    color: '#cccccc',
  },
  difficultyCell: {
    width: '20%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  easyDifficulty: {
    color: '#44DD44',
  },
  mediumDifficulty: {
    color: '#DDDD44',
  },
  hardDifficulty: {
    color: '#DD4444',
  },
  backButton: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
  },
  backButtonImage: {
    width: 100,
    height: 100,
  },
}); 