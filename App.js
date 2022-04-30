import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
  PixelRatio,
  FlatList,
  Text,
} from "react-native";
import * as Location from "expo-location";
import ViewShot from "react-native-view-shot";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { activateKeepAwake } from "expo-keep-awake";

import FloatingButton from "./components/FloatingButton";
import Cards from "./components/Cards";

import data from "./data/data.json";

export default function App() {
  activateKeepAwake();
  const viewShotRef = useRef();

  const chargers_data = data.chargers;

  const [chargers, setChargers] = useState();

  let [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  // const [image, setImage] = useState();

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

  // ================================================ FAB Handler =====================================================
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

    const imageURL = manipImage.uri;
    // const cleanURL = imageURL.replace("file://", "");
    // setImage(manipImage.uri);
    // console.log("----------- Manipulated Image -----------", manipImage);

    // let manipUriInfo = await FileSystem.getInfoAsync(image);
    // console.log("----------- Manipulated Image INFO -----------", manipUriInfao); // file compression working, WebP conversion not working
    console.log("----------- Manipulated Image URI-----------", imageURL);

    // const imageShare = await Sharing.shareAsync(imageURL);
    // console.log(imageShare.imageURL);

    //Cloudinary test
    const formData = new FormData();
    formData.append("file", imageURL);
    formData.append("upload_preset", "ev-app");
    formData.append("cloud_name", "bhagyashreemarde09");

    //Uploading converted viewshot to api

    const response = await fetch(
      // "HTTP://3.7.20.173:8503/api/upload/",
      "https://api.cloudinary.com/v1_1/bhagyashreemarde09/image/upload",
      {
        method: "post",
        headers: {
          // Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );
    const response_data = await response.json();
    console.log("--------------JSON Response----------------", response_data); // handle response with catch
    if (response.ok) {
      Alert.alert("File upload successful");
    } else {
      Alert.alert("Response", JSON.stringify(response_data));
    }
  }

  // ========================================= Display Cards ==============================================================
  // function renderChargers({ data }) {
  //   return (
  //     <View>
  //       <Text>{ data.name }</Text>
  //       {/* <Text>YO</Text> */}
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1, result: "tmpfile" }}
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
      <View style={styles.cardsWrapper}>
        <FlatList
          data={chargers_data}
          keyExtractor={(data) => data.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.name}</Text>
              <Text>{item.address}</Text>
              <Text>{item.distance}</Text>
              <Text>Supported Connections</Text>
              <Text>{item.connector_types[0]}</Text>
              {/* use foreach to loop through array */}
            </View>
          )}
        />
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
  cardsWrapper: {
    flex: 1,
  },
  card: {
    backgroundColor: "deepskyblue",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
});
