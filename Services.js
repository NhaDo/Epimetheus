import React, { useEffect, useState } from 'react';
import { 
    ActivityIndicator, 
    FlatList, 
    Text, 
    View, 
    Image, 
    StyleSheet
} from 'react-native';
import base64 from 'react-native-base64';

export default OutputScreen = async ({navigation,route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  let img = route.params.inputImage;
  console.log("img", img);

  var imgToBase64 = base64.encode(img)
  console.log("imgToBase64", imgToBase64);

  const callAPI = async()=>{
    await fetch('http://127.0.0.1:5000', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imgToBase64,
      }),
    })
    .then((res) => res.json())
    .then((resJson) => {
      console.log('resJson: ', resJson.item_0.category);
      setData(resJson.item_0.list_b64_str);
    })
    .catch((err)=>{
      console.log(err);
    })
    console.log('HAAH');
    setLoading(false);
  }

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>ABC</Text>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <View style={styles.item}>                
                <Image 
                style={styles.image}
                source={item}
                resizeMode="contain"/>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    list:{
        flex: 1,
        padding: 8
    },
    item:{
        flexDirection: 'row',
        marginTop:8,
        padding: 5,
        shadowColor: "#000"
    },
    image:{
        width:100,
        height:150
    }
});