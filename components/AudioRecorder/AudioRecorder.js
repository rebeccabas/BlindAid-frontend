import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios'; // Import Axios
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Buffer } from 'buffer';

export default function AudioRecorder() {
  const [recording, setRecording] = React.useState();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        {
          isMeteringEnabled: true,
          android: {
            extension: '.3gp',
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          },
          ios: {
            extension: '.wav',
            outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        }
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }




  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    console.log('Recording stopped and stored at', uri);
   
    processAudio(uri)

    

    // Convert recorded audio URI to Blob format
    
  }

  
  
  // Function to process the audio Blob
  async function processAudio(uri) {
    // Perform any additional processing or send the Blob to the server
    // For example, you can create a FormData object and append the Blob to it
    const localUri = `${FileSystem.documentDirectory}${Date.now()}.wav`;
    await FileSystem.copyAsync({ from: uri, to: localUri });
   
    console.log(uri)
    const formData = new FormData();
    const filetype = uri.split(".").pop();
    const filename = uri.split("/").pop();
    console.log(filename);
    console.log(filetype);
    console.log('Processing audio', uri);
 


    formData.append('file', {
      uri: uri,
      type: 'audio/3gp', // Adjust the MIME type if necessary
      name: filename,
    });
    
    try {
      const response = await fetch('http://192.168.1.103:8000/audio/transcribe', {
        method: 'POST',
        body:formData,

      
       
      });
      const data = await response.json();
      console.log('Transcribed Text:', data);
      const text = data['transcribed_text']
      if(text.includes('play'))
      {
        console.log("yes");
      }
      else{
        console.log('no');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
 