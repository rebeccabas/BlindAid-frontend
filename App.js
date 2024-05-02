import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import NavigationBar from './components/Navigation/NavigationBar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Camera from './components/Camera/Camera';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import ApiService from './services/ApiService';
import AudioRecorder from './components/AudioRecorder/AudioRecorder';
import ReadFromText from './components/ReadFromText/ReadFromText';
import AudioRecorderPeriodic from './components/AudioRecorder/AudioRecorderPeriodic';
import MainScreen from './components/Home/MainScreen';
import BlankScreen from './components/BlankScreen';
import BackAudio from './components/BackAudio';
const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="BlankScreen">
        <Stack.Screen name = "blank screen" component={BlankScreen} />
        <Stack.Screen name="HomeScreen" component={MainScreen} />
        <Stack.Screen name="ReadFromText" component={ReadFromText} />
        <Stack.Screen name="AudioRecorder" component={AudioRecorder} />
        <Stack.Screen name="BackAudio" component={BackAudio}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
