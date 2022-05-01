import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
  PixelRatio,
  Image,
} from "react-native";
import * as Location from "expo-location";
import ViewShot from "react-native-view-shot";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { activateKeepAwake } from "expo-keep-awake";

import FloatingButton from "./components/FloatingButton";

import data from "./data/data.json";
import Cards from "./components/Cards";

export default function App() {
  activateKeepAwake();
  const viewShotRef = useRef();
  // const mapRef = useRef(null);

  const chargers_data = data.chargers;

  let [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const targetPixelCount = 2000;
  const pixelRatio = PixelRatio.get(); // The pixel ratio of the device
  const pixels = targetPixelCount / pixelRatio;

  // ======================================== Getting Current loaction =================================================
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

  //================================= Share FAB Handler ==================================

  async function shareViewShot() {
    console.log("Share Button clicked");

    const imageViewshot = await viewShotRef.current.capture();

    // Getting viewshot as object
    let imageObject = await FileSystem.getInfoAsync(imageViewshot);

    // Manipulating file to compress  + return as WEBP?
    const manipImage = await manipulateAsync(
      imageObject.localUri || imageObject.uri,
      [{ resize: { height: pixels, width: pixels } }],
      {
        compress: 0.5,
        format: SaveFormat.WEBP, // png & jpeg works, webp does not. Defaults to jpeg.
      }
    );
    const imageURL = manipImage.uri;

    await Sharing.shareAsync(imageURL);
  }

  // ================================================ API FAB Handler =====================================================
  async function uploadViewShot() {
    console.log("API Button clicked");

    // Capturing View Shot
    const imageViewshot = await viewShotRef.current.capture();

    // Getting viewshot as object
    let imageObject = await FileSystem.getInfoAsync(imageViewshot);
    console.log("----------- Viewshot Image ----------", imageObject);

    // Manipulating file to compress  + return as WEBP?
    const manipImage = await manipulateAsync(
      imageObject.localUri || imageObject.uri,
      [{ resize: { height: pixels, width: pixels } }],
      {
        compress: 0.5,
        format: SaveFormat.WEBP, // png & jpeg works, webp does not. Defaults to jpeg.
      }
    );

    const imageURL = manipImage.uri;

    // let manipUriInfo = await FileSystem.getInfoAsync(image);
    // console.log("----------- Manipulated Image INFO -----------", manipUriInfao); // file compression working, WebP conversion not working
    console.log("------- Manipulated Image URI--------", imageURL);

    //Cloudinary test
    const formData = new FormData();
    formData.append("file", imageURL);
    formData.append("upload_preset", "ev-app");
    formData.append("cloud_name", "bhagyashreemarde09");

    //Uploading converted viewshot to api
    try {
      const response = await fetch("HTTP://3.7.20.173:8503/api/upload/", {
        method: "post",
        headers: {
          // Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      const response_data = await response.json();
      console.log("--------------JSON Response----------------", response_data);
      if (response.ok) {
        Alert.alert("File upload successful");
      } else {
        Alert.alert("Something went wrong");
      }
    } catch (error) {
      console.log(error); // Displays "Network Request Failed", not working on POSTMAN too
    }
  }

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1, result: "tmpfile" }}
        style={styles.viewshotContainer}
      >
        <MapView
          // ref={mapRef}
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
          {chargers_data.map((value, index) => {
            return (
              <MapView.Marker
                coordinate={{
                  latitude: parseFloat(value.latitude),
                  longitude: parseFloat(value.longitude),
                }}
                key={index}
                title={value.name}
                image={require("./assets/charging_station.png")}
              />
            );
          })}
        </MapView>
      </ViewShot>

      <View style={styles.floatingButtonAPI}>
        <FloatingButton onPress={uploadViewShot} title="Upload to API" />
      </View>

      <View style={styles.floatingButtonShare}>
        <FloatingButton onPress={shareViewShot} title="Share" />
      </View>

      <Cards />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  viewshotContainer: { flex: 1 },
  floatingButtonAPI: {
    position: "absolute",
    top: "10%",
    right: 20,
  },
  floatingButtonShare: {
    position: "absolute",
    top: "18%",
    right: 20,
  },
});
