import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions, Alert, Button } from "react-native";
import * as Location from "expo-location";

export default function App() {
  let [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [errorMsg, setErrormsg] = useState();

  const clickHandler = () => {
    //function to handle click on floating Action Button
    Alert.alert("Floating Button Clicked");
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrormsg("Permission denied, cannot access current location.");
        alert(errorMsg);
        return;
      }

      currentLocation = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  console.log(currentLocation.latitude, currentLocation.longitude);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        region={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          image={require("./assets/current_location.png")}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  touchableOpacityStyle: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: "contain",
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
});
