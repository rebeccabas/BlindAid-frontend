import { Image } from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ApiService {
  static lastSpokenText = '';
  static spokenText = ''; // Add a static property to store spoken text

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

      const response = await fetch('http://192.168.1.103:8000/navigate/', {
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
      const responseBody = await response.json();
      const instructions = responseBody.instructions;
      console.log(instructions);
      

      // Check if Speech is available on the platform
      if (Speech !== null && Speech.speak !== undefined && instructions) {
        await Speech.stop(); // Stop any existing speech
        ApiService.spokenText = '';
        await ApiService.saveLastSpokenText(instructions);
        
        await Speech.speak(instructions,{
          rate: 0.7,
          onBoundary: (boundaries) => {
            const { charIndex, charLength } = boundaries;
            const word = instructions.substring(charIndex, charIndex + charLength);
          
            ApiService.spokenText += word;
            console.log(ApiService.spokenText);
        }

        });
      } else {
        console.log('Speech module is not available on this platform');
      }

      return instructions; // Optionally return the instructions as well
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