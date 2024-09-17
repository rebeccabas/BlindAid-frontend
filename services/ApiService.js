import { Image } from 'react-native';
import * as Speech from 'expo-speech';

export default class ApiService {
  static async sendImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append('file', {
        name: 'image.jpg',
        type: 'image/jpeg',
        uri: imageFile.uri,
      });

      const response = await fetch('http://192.168.101.3:8000/navigate/', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching instructions: ${response.status}`);
      }

      console.log(response);
      const responseBody = await response.json();
      const instructions = responseBody.instructions;
      console.log('Received instructions:', instructions);

      if (instructions) {
        await this.speakInstructions(instructions);
      } else {
        console.log('No instructions received');
      }

      return instructions;
    } catch (error) {
      console.error('Error sending image or speaking instructions:', error);
      return null;
    }
  }

  static async sendReader(imageFile) {
    try {
      const formData = new FormData();
      formData.append('file', {
        name: 'image.jpg',
        type: 'image/jpeg',
        uri: imageFile.uri,
      });

      const response = await fetch('http://192.168.1.139:8000/ocr/', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching instructions: ${response.status}`);
      }

      console.log(response);
      const responseBody = await response.json();
      const instructions = responseBody.instructions;
      console.log('Received instructions:', instructions);

      if (instructions) {
        await this.speakInstructions(instructions);
      } else {
        console.log('No instructions received');
      }

      return instructions;
    } catch (error) {
      console.error('Error sending image or speaking instructions:', error);
      return null;
    }
  }

  static async speakInstructions(text, language = 'hi-IN') {
    try {
      const options = {
        language: language,
        pitch: 1.0,
        rate: 0.75,
      };
      await Speech.speak(text, options);
    } catch (error) {
      console.error('Error speaking instructions:', error);
    }
  }
}