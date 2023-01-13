import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image } from 'react-native';
import React, { useState, useEffect, useRef} from 'react';
import Button from './Button.js';
import * as ImagePicker from 'expo-image-picker';

export default function Home({ navigation }) {
  const [hasCameraermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  //const [imageList, setList] = useState(null);
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
        console.log("data:", data);
        setImage(data.uri);
      } catch(e) {
        console.log(e);
      }
    }
  }
  const usePandora = async() =>{
    if(image) {
      try{ // change this to use API
        console.log("img in home component:", image);
        navigation.navigate("ListScreen", {inputImage: image});
        setImage(null);
      } catch(e_){
        console.log(e_)
      }
    }
  }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log('result', result);
    
    if (!result.canceled) {
      //save to library - change here to load to pandora
      await MediaLibrary.createAssetAsync(result.assets[0].uri);
      alert('Picture saved to library!');
      setImage(result.assets[0].uri);
    }
  };

  if(hasCameraermission === false){
    return <Text>No access to camera.</Text>
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
        {/* upper buttons */}
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
      {/* lower buttons */}
      <View>
        {image ?          
          <View  style={styles.button}>
            <Button icon='qq' title={'Use Pandora'} 
            onPress={usePandora}/>
            <Button icon='ccw' title={'Retake'} onPress={
              () => setImage(null)
            }/>
          </View>
        :
          <View  style={styles.button}>
            <Button
              icon='camera'
              onPress={takePicture}
            />
            <Button
              icon='image'
              onPress={pickImage}/>
          </View>
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
