import React, { useState, useRef } from 'react';
import { View, Button } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';
import ApiService from '../../services/ApiService';
import { StyleSheet, Dimensions } from 'react-native';
import AudioRecorderPeriodic from '../AudioRecorder/AudioRecorderPeriodic';

export default function ReadFromText() {
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);

  const takePictureAndUpload = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync();
    setCapturedImage(photo);
    console.log("image captured", photo)
    ApiService.sendImagetoRead(photo);
  };

  const handlePauseSpeech = async () => {
    await ApiService.pauseSpeech();
  };

  const handlePlaySpeech = async () => {
   
    await ApiService.resumeSpeech();
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <ExpoCamera
          style={styles.camera}
          type={ExpoCamera.Constants.Type.back}
          ref={cameraRef}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Play" onPress={handlePlaySpeech} />
        <Button title="Pause" onPress={handlePauseSpeech} />
        <Button title="Take Picture" onPress={takePictureAndUpload} />
      </View>
      <View>
      <AudioRecorderPeriodic/>
      </View>
    </View>
  );
}

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    width: '80%',
    aspectRatio: 1,
    height: height * 0.6, // Increase camera container height
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'space-between', // Evenly space buttons
    marginTop: 20, // Add margin between camera and buttons
    width: '80%', // Match the width of camera container
  },
});
