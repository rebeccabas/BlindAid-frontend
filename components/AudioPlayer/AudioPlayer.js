import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

const AudioPlayer = ({ audioContent }) => {
  const [sound, setSound] = useState();

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (audioContent) {
      playAudio(audioContent);
    }
  }, [audioContent]);

  const playAudio = async (audioContent) => {
    console.log('Loading Sound');
    try {
      // Convert base64 to URI
      const uri = `data:audio/mp3;base64,${audioContent}`;
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(newSound);

      console.log('Playing Sound');
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return null; // No visual component needed
}

export default AudioPlayer;