import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

const LogoIntro = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/images/LogoAnimation.mp4')}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
        style={styles.video}
        onLoad={() => setIsLoading(false)}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            onComplete();
          }
        }}
      />
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
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  video: {
    width: width,
    height: height,
  },
});

export default LogoIntro; 