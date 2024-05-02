import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { Audio } from 'expo-av';

const BackAudio = () => {
  const [sound, setSound] = useState(null);

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'http://192.168.1.103:8000/get_audio/' },
        { shouldPlay: true }
      );
    
      setSound(sound);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const stopSound = () => {
    if (sound) {
      sound.stopAsync();
    }
  };

  return (
    <View>
      <Button title="Play Audio" onPress={playSound} />
      <Button title="Stop Audio" onPress={stopSound} />
    </View>
  );
};

export default BackAudio;
