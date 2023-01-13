import React, { useEffect, useState } from 'react';
import { 
    ActivityIndicator, 
    FlatList, 
    Text, 
    View, 
    Image, 
    StyleSheet
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import axios from "axios";

export default ListScreen = ({navigation,route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [category, setCategory] = useState(null);
  const [list_b64_str, setList_b64_str] = useState([]);
  let img = route.params.inputImage;
  var base64Icon = 'data:image/png;base64,';

  const callAPI = async()=>{
    const base64 = await FileSystem.readAsStringAsync(img, { encoding: 'base64' });
    console.log('file system: ');

    axios.post('http://192.168.1.7:5000', {
      image: base64
    })
    .then((response) => {
      const {data} = response.data;      
      Object.keys(data).forEach(key=>{
        let {list_b64_str} = data[key];
        
        Object.keys(list_b64_str).forEach(key=>{
          list_b64_str[key] = base64Icon + list_b64_str[key];
        })
      })
      setData(data);
      console.log('data: ', data);
    })
    .catch(function (error) {
    })
    .finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    callAPI();
    console.log('isLoading', isLoading);
    console.log('loaded data', data[0].list_b64_str);
  }, []);

  return (    
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          renderItem={({ item }) => (            
            <View>   
                <Text style={styles.category}>{item.category}</Text>
                <View style={styles.item}>
                  <Image
                  style={styles.image}
                  source={{uri: item.list_b64_str[0]}}
                  resizeMode='contain'
                  ></Image>
                  <Image
                  style={styles.image}
                  source={{uri: item.list_b64_str[1]}}
                  resizeMode='contain'
                  ></Image>    
                  <Image
                  style={styles.image}
                  source={{uri: item.list_b64_str[2]}}
                  resizeMode='contain'
                  ></Image> 
                </View>                  
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
    },
    category:{
      
    }
});