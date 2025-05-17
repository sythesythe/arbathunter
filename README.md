# AR Bat Hunter 🦇

An exciting augmented reality game where you hunt virtual bats in your real environment! Test your reflexes and accuracy as you try to catch fast-moving bats while managing your stamina.

## Features 🎮

- **Augmented Reality Experience**: Hunt bats in your real environment
- **Multiple Difficulty Levels**:
  - Easy: Larger bats, slower movement, more forgiving hitboxes
  - Medium: Balanced gameplay with moderate challenge
  - Hard: Faster bats, smaller hitboxes, true test of skill
- **Dynamic Gameplay**:
  - Stamina management system
  - Combo system for consecutive hits
  - Score multipliers based on difficulty
  - Natural bat movement patterns
- **Visual Feedback**:
  - Hit/miss indicators
  - Combo counters
  - Stamina bar
  - Score display
- **Sound Effects** (when enabled):
  - Shooting sounds
  - Hit confirmation
  - Miss feedback

## Installation 🚀

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ar-bat-hunter.git
cd ar-bat-hunter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Use Expo Go app to run on your device, or run on an emulator:
```bash
npm run android  # for Android
npm run ios      # for iOS
```

## Requirements 📱

- Node.js (v14 or higher)
- Expo CLI
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development)
- Physical device with camera for AR features

## Dependencies 📦

- React Native
- Expo
- React Navigation
- Expo Camera
- Expo AV (for sound)
- React Native Reanimated
- Other AR and animation related packages

## Game Controls 🎯

- Tap the screen to shoot at bats
- Watch your stamina bar - each shot costs stamina
- Hit consecutive bats quickly to build combos
- Manage your resources to achieve the highest score

## Difficulty Levels 🎚️

### Easy Mode
- 3 bats maximum
- 4-second spawn rate
- 40% larger bats
- 20% larger hitboxes
- Normal points multiplier

### Medium Mode
- 4 bats maximum
- 3-second spawn rate
- 20% larger bats
- Normal hitboxes
- 1.5x points multiplier

### Hard Mode
- 5 bats maximum
- 2-second spawn rate
- Normal size bats
- 40% smaller hitboxes
- 2x points multiplier

## Contributing 🤝

Feel free to submit issues and enhancement requests!

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits 🙏

- Game assets and sounds
- React Native and Expo communities
- Contributors and testers

## Future Enhancements 🚀

- Additional bat types
- Power-ups and special abilities
- Global leaderboard
- More visual effects
- Additional game modes
