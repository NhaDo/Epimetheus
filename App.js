import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useState, useEffect, useRef} from 'react';
import Button from './Button.js';

export default function App() {
  const [hasCameraermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.Off)
  const cameraRef = useRef(null);

  useEffect(()=>{
    (async() => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status == 'granted');

    })();
  },[])

  const takePicture = async()=>{
    if(cameraRef) {
      try{
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch(e) {
        console.log(e);
      }
    }
  }
  const usePandora = async() =>{
    if(image) {
      try{ // change this to use API
        console.log(image);
        await MediaLibrary.createAssetAsync(image);
        alert('Picture saved to library!'); 
        setImage(null);
      } catch(e_){
        console.log(e_)
      }
    }
  }

  if(hasCameraermission === false){
    return <Text>No access to camera.</Text>
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      {!image ?
      <Camera 
        style={styles.camera} 
        type={type}
        flashMode={flash}
        ref={cameraRef}
      >
        <View style={styles.button}>
          <Button 
          icon={'flash'}
          color={flash===Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'}
          onPress={()=>{
            setFlash(flash===Camera.Constants.FlashMode.off
              ? Camera.Constants.FlashMode.on
              : Camera.Constants.FlashMode.off )
          }}/>
          <Button 
          icon={'retweet'} 
          onPress={()=>{
              setType(type===CameraType.back ? CameraType.front : CameraType.back)
          }}/>
        </View>
      </Camera>
      : 
      <Image source={{uri: image}} style={styles.camera}></Image>
      }
      <View>
        {image ?
          <View  style={styles.button}>
          <Button icon='qq' title={'Use Pandora'} onPress={usePandora}/>
          <Button icon='ccw' title={'Retake'} onPress={
            () => setImage(null)
          }/>
          </View>
        :
          <Button
            icon='camera'
            onPress={takePicture}
          />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 20
  },
  camera:{
    flex:1,
  },
  button: {
    flexDirection:'row', 
    justifyContent:'space-between',
    paddingHorizontal: 50,
    backgroundColor: '#000',
  }
});
