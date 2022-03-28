import React from 'react';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, Button, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { key } from './Key';


export default function App() {
  // Haaga-Helia, w/ given example values
  const initialRegion = {
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  }

  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState(initialRegion);

  useEffect(()=> {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission for location data')
        return;
      }
      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
      setRegion({...region, latitude: location.coords.latitude, longitude: location.coords.longitude});
    })();
  }, []);

  const fetchCoordinates = async () => {
    try {
      const response = await fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${search}`);
      const data = await response.json();
      const { lat, lng } = data.results[0].locations[0].latLng;
      setRegion({...region, latitude: lat, longitude: lng});
      setTitle(search);
    }
    catch {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
        <MapView
          style={styles.map}
          region={region}>
            <Marker
            coordinate={{latitude: region.latitude, longitude: region.longitude}}
            title={title} />  
        </MapView>
        <View style={styles.searchAndButton}>
        <TextInput placeholder='Search address' 
        style={styles.searchInput}
        onChangeText={input => setSearch(input)} />
        <Button title='Show' onPress={fetchCoordinates}></Button>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '90%',
    flex: 1
  },
  searchAndButton: {
    marginTop: 30,
    marginBottom: 30
  },
  searchInput: {
    width: 200
  }
});
