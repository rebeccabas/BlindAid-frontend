import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import Camera from './components/Camera/Camera';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import BookReader from './components/Camera/BookReader';
import ApiService from './services/ApiService';
import { decode as atob, encode as btoa } from 'base-64';

const Tab = createBottomTabNavigator();

function CameraAudioScreen() {
  const [capturedImage, setCapturedImage] = React.useState(null);
  const [audioFile, setAudioFile] = React.useState(null);

  const handleImageCapture = (image) => {
    console.log("app", image);
    setCapturedImage(image);
  };

  const handleAudioReceived = (audio) => {
    setAudioFile(audio);
  };

  React.useEffect(() => {
    const fetchAudioFromApi = async () => {
      try {
        if (capturedImage) {
          await ApiService.sendImage(capturedImage);
        }
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    };

    fetchAudioFromApi();
  }, [capturedImage]);

  return (
    <View style={{ flex: 1 }}>
      <Camera onImageCapture={handleImageCapture} />
      <AudioPlayer audioFile={audioFile} />
    </View>
  );
}

function BookReaderAudioScreen() {
  const [capturedBook, setCapturedBook] = React.useState(null);
  const [audioFile, setAudioFile] = React.useState(null);

  const handleBookReader = (image) => {
    console.log("app", image);
    setCapturedBook(image);
  };

  React.useEffect(() => {
    const fetchAudioFromApiBookReader = async () => {
      try {
        if (capturedBook) {
          await ApiService.sendReader(capturedBook);
        }
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    };

    fetchAudioFromApiBookReader();
  }, [capturedBook]);

  return (
    <View style={{ flex: 1 }}>
      <BookReader onBookReader={handleBookReader} />
      <AudioPlayer audioFile={audioFile} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Camera" component={CameraAudioScreen} />
        <Tab.Screen name="BookReader" component={BookReaderAudioScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}