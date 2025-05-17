import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

const { width } = Dimensions.get('window');

const NameEntry = ({ onSubmit, onCancel }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (playerName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (playerName.trim().length > 15) {
      setError('Name must be less than 15 characters');
      return;
    }
    onSubmit(playerName.trim());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.modal}>
        <Text style={styles.title}>Enter Your Name</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Your name here..."
          value={playerName}
          onChangeText={(text) => {
            setPlayerName(text);
            setError('');
          }}
          maxLength={15}
          autoFocus
          autoCapitalize="words"
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.submitButton]} 
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    width: width * 0.8,
    backgroundColor: '#2C3E50',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#34495E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ECF0F1',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#34495E',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#ECF0F1',
    marginBottom: 10,
  },
  errorText: {
    color: '#E74C3C',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95A5A6',
  },
  submitButton: {
    backgroundColor: '#27AE60',
  },
  buttonText: {
    color: '#ECF0F1',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NameEntry; 