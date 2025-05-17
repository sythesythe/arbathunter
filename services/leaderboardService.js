import AsyncStorage from '@react-native-async-storage/async-storage';

const LEADERBOARD_KEY = '@bat_hunter_leaderboard';

export const saveScore = async (playerName, score) => {
  try {
    // Get existing leaderboard
    const existingData = await AsyncStorage.getItem(LEADERBOARD_KEY);
    let leaderboard = existingData ? JSON.parse(existingData) : [];

    // Add new score
    const newEntry = {
      playerName,
      score,
      date: new Date().toISOString(),
    };

    leaderboard.push(newEntry);

    // Sort by score (highest first)
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only top 10 scores
    leaderboard = leaderboard.slice(0, 10);

    // Save back to storage
    await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));

    return leaderboard;
  } catch (error) {
    console.error('Error saving score:', error);
    return null;
  }
};

export const getLeaderboard = async () => {
  try {
    const data = await AsyncStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

export const clearLeaderboard = async () => {
  try {
    await AsyncStorage.removeItem(LEADERBOARD_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    return false;
  }
}; 