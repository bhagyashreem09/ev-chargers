import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions, Alert, PixelRatio } from "react-native";
import * as Location from "expo-location";
import ViewShot from "react-native-view-shot";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

import FloatingButton from "./components/FloatingButton";

export default function App() {
  const viewShotRef = useRef();

  let [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [image, setImage] = useState();

  const targetPixelCount = 1080;
  const pixelRatio = PixelRatio.get(); // The pixel ratio of the device
  const pixels = targetPixelCount / pixelRatio;

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

  // =============================== FAB Handler ==================================
  async function captureViewShot() {
    console.log("Button clicked");

    // Capturing View Shot
    const imageViewshot = await viewShotRef.current.capture();

    // Getting viewshot as object
    let imageObject = await FileSystem.getInfoAsync(imageViewshot);
    console.log(
      "----------------- Viewshot Image ---------------",
      imageObject
    );

    // Manipulating file to compress  + return as WEBP?
    const manipImage = await manipulateAsync(
      imageObject.localUri || imageObject.uri,
      [{ resize: { height: pixels, width: pixels } }],
      {
        compress: 0.5,
        format: SaveFormat.WEBP, // png & jpeg works, webp does not. Defaults to jpeg.
      }
    );
    // setImage(manipImage.uri);
    console.log("----------- Manipulated Image -----------", manipImage);

    // let manipUriInfo = await FileSystem.getInfoAsync(image);
    // console.log("----------- Manipulated Image INFO -----------", manipUriInfao); // file compression working, WebP conversion not working
    console.log("----------- Manipulated Image URI-----------", manipImage.uri);

    //Uploading converted viewshot to api
    const response = await fetch("HTTP://3.7.20.173:8503/api/upload/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json", // headers is not required in Firebase, but it will be required in most other APIs, to describe the content type
      },
      body: { file: manipImage.uri },
    });
    const response_data = await response;
    console.log("--------------JSON Response----------------", response_data); // handle response with catch
    // Alert.alert("File upload successful", response_data.json.file);
    // console.log(response_data.json.file);

    // fetch("https://wireone-ev-default-rtdb.firebaseio.com/", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json", // headers is not required in Firebase, but it will be required in most other APIs, to describe the content type
    //   },
    //   body: JSON.stringify({ file: manipImage.uri }),
    // })
    //   .then((response) => {
    //     if (response.ok) {
    //       console.log("Data post successful");
    //     } //else {
    //     //   console.log("Data post failed");
    //     // }
    //   })
    //   .catch((error) => {
    //     throw new Error(error);
    //   });
  }

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 0.5 }}
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
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  viewshotContainer: { flex: 1 },
  floatingButtonStyle: {
    position: "absolute",
    top: "10%",
    right: 20,
  },
});
