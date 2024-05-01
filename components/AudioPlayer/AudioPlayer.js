import React, { useEffect } from 'react';
import { Audio } from 'expo-av';
import { Button, View } from 'react-native';
import ApiService from '../../services/ApiService'; // Adjust the relative path
 // Import the ApiService

const AudioPlayer = ({ audioFile }) => {
  useEffect(() => {
    if (audioFile) {
      playAudio(audioFile);
    }
  }, [audioFile]);

  const playAudio = async (audioFile) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioFile },
        { shouldPlay: true }
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };

  const handlePauseSpeech = async () => {
    await ApiService.pauseSpeech(); // Call the pauseSpeech method from ApiService
  };

  const handlePlaySpeech = async () => {
    const text = 'Your speech text here'; // Provide the speech text to be played
    await ApiService.resumeSpeech(); // Call the playSpeech method from ApiService
  };

  return (
    <View>
      {/* Button to pause speech */}
      <Button title="Pause Speech" onPress={handlePauseSpeech} />
      {/* Button to play speech */}
      <Button title="Play Speech" onPress={handlePlaySpeech} />
    </View>
  );
};

export default AudioPlayer;
