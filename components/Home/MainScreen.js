import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import ApiService from '../../services/ApiService';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import NavigationBar from '../Navigation/NavigationBar';
import Camera from '../Camera/Camera';
import AudioRecorderPeriodic from '../AudioRecorder/AudioRecorderPeriodic';
import ReadFromText from '../ReadFromText/ReadFromText';

function MainScreen() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const handleImageCapture = async (image) => {
    console.log("Image captured:", image);
    setCapturedImage(image);
  };
  const handleAudioReceived = (audio) => {
    setAudioFile(audio);
  };


  useEffect(() => {
    const fetchAudioFromApi = async () => {
      try {
        if (capturedImage) {
          await ApiService.sendImage(capturedImage);
        }
      } catch (error) {
        console.error('Error fetching audio:', error);
        // Handle errors if needed
      }
    };

    fetchAudioFromApi();

  }, [capturedImage]);

  return (
    <View style={{ flex: 1 }}>
      <NavigationBar />
      <Camera onImageCapture={handleImageCapture} />
      
      
    </View>
  );
}

export default MainScreen;
