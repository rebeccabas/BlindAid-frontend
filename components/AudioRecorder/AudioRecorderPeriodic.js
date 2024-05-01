import * as React from 'react';
import { Audio } from 'expo-av';
import ApiService from '../../services/ApiService';
import ReadFromText from '../ReadFromText/ReadFromText';


export default function AudioRecorderPeriodic({captureImage}) {
  
  const [recording, setRecording] = React.useState(null);
  const [x,setX] = React.useState(false);
  React.useEffect(() => {
    const startRecording = async () => {
      if (recording) {
        console.log('A recording is already in progress.');
        return;
      }
      try {
        console.log('Requesting permissions..');
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        console.log('Starting recording..');

        
        const recordingInstance = new Audio.Recording();
        await recordingInstance.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await recordingInstance.startAsync();
        setRecording(recordingInstance);

        
        setTimeout(async () => {
          await recordingInstance.stopAndUnloadAsync();
          setRecording(null);
          const uri = recordingInstance.getURI();
          console.log('Recording stopped and stored at', uri);
          processAudio(uri);
        }, 5000);
      } catch (error) {
        console.log('Nothing');
      }
    };

    const interval = setInterval(startRecording, 15000); 

    return () => clearInterval(interval); 
  }, []);

  const processAudio = async (uri) => {
    console.log('Processing audio', uri);
    const filetype = uri.split(".").pop();
    const filename = uri.split("/").pop();
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'audio/3gp',
        name: filename,
      });

      const response = await fetch('http://192.168.1.105:8000/audio/transcribe/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Transcribed Text:', data);
      console.log(data['transcribed_text'])
      const text = data['transcribed_text']
      if(text.includes('pause'))
      {
        ApiService.pauseSpeech();
      }
      
      if(text.includes('play'))
      {
        ApiService.playSpeech();
      }
      
      if(text.includes('hey blind aid') || text.includes('hello blind aid')|| text.includes('hey blindaid') || text.includes('hello blindaid'))
      {
        console.log("Voice assistant activated!!")
      }
      if(text.includes('read text'))
      {
        setX(true);


      }
      if(text.includes('capture') || text.includes('click'))
      {
        captureImage();
        


      }
    
    
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  return(
    <>
  {x ? <ReadFromText /> : null}
  </>

  );
  
   
}
