import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions, Alert, Share } from "react-native";
import * as Location from "expo-location";
import ViewShot from "react-native-view-shot";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import FloatingButton from "./components/FloatingButton";

export default function App() {
  const viewShotRef = useRef();

  let [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [image, setImage] = useState("");

  const targetPixelCount = 1080;

  // ======================= FAB Handler ==========================
  async function captureViewShot() {
    console.log("Button clicked");

    // ------------------- Capturing View Shot ------------------------
    const imageURL = await viewShotRef.current.capture();
    setImage(imageURL);
    console.log(image);
    // const manipImage = await manipulateAsync(
    //   // not working
    //   image[{ resize: { height: 70, width: 30 } }],
    //   {
    //     compress: 0,
    //     format: SaveFormat.WEBP,
    //   }
    // );
    // setImage(manipImage);
    // // Share.share({ title: "Image", url: image });

    // Expo does not support file URI, therefore creating a blob
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    // console.log(manipImage);
  }
  // console.log(image);

  // ======================= Getting current loaction =================================
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied, cannot access current location.");
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
      <ViewShot
        ref={viewShotRef}
        options={{ format: "jpg", quality: 0 }}
        style={styles.viewshotContainer}
      >
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
      </ViewShot>

      <View style={styles.floatingButtonStyle}>
        <FloatingButton onPress={captureViewShot} title="Capture" />
      </View>
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
  viewshotContainer: { flex: 1 },
  floatingButtonStyle: {
    position: "absolute",
    top: "10%",
    right: 20,
  },
});
