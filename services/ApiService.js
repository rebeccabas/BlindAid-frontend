import { Image } from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Audio } from 'expo-av';

export default class ApiService {
  static lastSpokenText = '';
  static spokenText = '';
  static sound = null;

  static async playSound() {
    try {
      if (ApiService.sound) {
        await ApiService.sound.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'http://192.168.1.101:8000/get_audio/' },
        { shouldPlay: true }
      );
      ApiService.sound = sound;
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }
  static async stopSound() {
    try {
      if (ApiService.sound) {
        await ApiService.sound.stopAsync();
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }
 
  static async sendImagetoRead(imageFile) {
   
    try {
      const formData = new FormData();
      formData.append('file', {
        name: 'image.jpg',
        type: 'image/jpeg',
        uri: imageFile.uri,
      });

      const response = await fetch('http://192.168.1.103:8000/ocr/', {
        method: 'POST',
        body: formData,
        headers: {
          // 'Accept': 'audio/mpeg', // Expected response content type
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Here");
      console.log(response);
      

      if (!response.ok) {
        throw new Error(`Error fetching audio file: ${response.status}`);
      }

      console.log(response);
      const responseBody = await response.json();
      console.log(responseBody);
      const text = responseBody.extracted_text;
      console.log(text);
      

      // Check if Speech is available on the platform
      if (Speech !== null && Speech.speak !== undefined && text) {
         // Stop any existing speech
         ApiService.spokenText = '';
        await this.saveLastSpokenText(text);
        await Speech.speak(text,{
          rate: 0.7,

          onBoundary: (boundaries) => {
            const { charIndex, charLength } = boundaries;
            const word = text.substring(charIndex, charIndex + charLength);
            ApiService.spokenText += word;
            console.log(ApiService.spokenText);
        }

        });

      } else {
        console.log('Speech module is not available on this platform');
      }

      return text; // Optionally return the instructions as well
    } catch (error) {
      console.log('Error sending image or speaking instructions:', error);
      return null;
    }
  }

  static async sendImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append('file', {
        name: 'image.jpg',
        type: 'image/jpeg',
        uri: imageFile.uri,
      });

      const response = await fetch('http://192.168.1.101:8000/navigate/tts', {
        method: 'POST',
        body: formData,
        headers: {
          // 'Accept': 'audio/mpeg', // Expected response content type
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching audio file: ${response.status}`);
      }

      console.log(response);
      
     // Assuming the API returns the audio file URI directly
      await ApiService.playSound();

      // Check if Speech is available on the platfor
      // Optionally return the instructions as well
    } catch (error) {
      console.log('Error sending image or speaking instructions:', error);
      return null;
    }
  }

static async resumeSpeech() {
  try {
    if (Speech !== null && Speech.speak !== undefined) {
      // Retrieve the last spoken text from AsyncStorage
      const lastSpokenText = await AsyncStorage.getItem('lastSpokenText');
      if (lastSpokenText) {
        // Remove the spoken text from lastSpokenText
        const remainingText = lastSpokenText.slice(ApiService.spokenText.length);
        await Speech.speak(remainingText);
        console.log('Speech resumed from where it left off');
      } else {
        console.log('No last spoken text found');
      }
    } else {
      console.log('Speech module is not available on this platform');
    }
  } catch (error) {
    console.log('Error resuming speech:', error);
  }
}


  static async pauseSpeech() {
    try {
      if (Speech !== null && Speech.stop !== undefined) {
        await Speech.stop();
        console.log('Speech paused');
      } else {
        console.log('Speech module is not available on this platform');
      }
    } catch (error) {
      console.log('Error pausing speech:', error);
    }
  }


  static async saveLastSpokenText(text) {
    try {
      // Save the last spoken text to AsyncStorage
      await AsyncStorage.setItem('lastSpokenText', text);
      console.log('Last spoken text saved:', text);
    } catch (error) {
      console.log('Error saving last spoken text:', error);
    }
  }
}