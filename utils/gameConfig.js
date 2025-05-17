export const GAME_CONFIG = {
  DEFAULT_TIME_LIMIT: 120, // 2 minutes in seconds
  DEFAULT_TARGET_BATS: 25,
  MAX_BATS_ON_SCREEN: 8,
  COLORS: { PRIMARY: '#9F33FF', SECONDARY: '#FF3366', BACKGROUND: '#1A0026', TEXT: '#FFFFFF' },
  POINTS_PER_BAT: 100,
  STAMINA_COST_PER_SHOT: 5,
  STAMINA_REGEN_RATE: 1, // Points per second
  DIFFICULTY_LEVELS: {
    EASY: { 
      BAT_SPEED: 0.5,        // Slower bats
      SPAWN_RATE: 4000,      // 4 seconds between spawns
      MAX_BATS: 3,           // Max 3 bats on screen
      STAMINA_DRAIN: 0.8,    // 20% less stamina drain
      POINTS_MULTIPLIER: 1,  // Normal points
      BAT_SCALE: 1.4,        // 40% larger bats
      HITBOX_SCALE: 1.2      // Larger hitbox for easy mode
    },
    MEDIUM: { 
      BAT_SPEED: 0.8,        // Normal speed
      SPAWN_RATE: 3000,      // 3 seconds between spawns
      MAX_BATS: 4,           // Max 4 bats on screen
      STAMINA_DRAIN: 1.0,    // Normal stamina drain
      POINTS_MULTIPLIER: 1.5, // 50% more points
      BAT_SCALE: 1.2,        // 20% larger bats
      HITBOX_SCALE: 1.0      // Normal hitbox size
    },
    HARD: { 
      BAT_SPEED: 1.2,        // 20% faster bats
      SPAWN_RATE: 2000,      // 2 seconds between spawns
      MAX_BATS: 5,           // Max 5 bats on screen
      STAMINA_DRAIN: 1.3,    // 30% more stamina drain
      POINTS_MULTIPLIER: 2.0, // Double points
      BAT_SCALE: 1.0,        // Normal size bats
      HITBOX_SCALE: 0.6      // 40% smaller hitbox for hard mode
    }
  },
  CURRENT_DIFFICULTY: 'MEDIUM',
  SOUND_ENABLED: true
};
