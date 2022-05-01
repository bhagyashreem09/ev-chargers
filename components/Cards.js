import React from "react";

import {
  View,
  FlatList,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";

import data from "../data/data.json";

function Cards() {
  const chargers_data = data.chargers;
  function renderChargers({ item }) {
    const conn_type = item.connector_types;

    const distance = (item.distance / 1000).toFixed(1);

    const nameVal = item.name;
    const updatedName = nameVal.toUpperCase();

    let type_name = [];
    let type_number = [];

    // to split connector types by "-"
    for (let i = 0; i < conn_type.length; i++) {
      let values = conn_type[i].split("-");
      type_name.push(values[0]);
      type_number.push(values[1]);
    }

    // replacing connector type names
    type_name.splice(0, 1, "Level 1 DC");
    type_name.splice(1, 1, "Level 2 DC");
    type_name.splice(2, 1, "Normal AC");

    // displaying connector names
    const name = type_name.map((item, i) => {
      return (
        <View style={{ flexDirection: "row", paddingVertical: 9 }} key={i}>
          <Image source={require("../assets/charger_type.png")} />
          <Text
            style={{
              color: "white",
              fontSize: 13,
              fontWeight: "bold",
              marginLeft: 7,
            }}
            key={i}
          >
            {item}
          </Text>
        </View>
      );
    });

    //displaying connector numbers
    const num = type_number.map((item, i) => {
      return (
        <Text
          style={{
            color: "white",
            fontSize: 13,
            fontWeight: "bold",
            paddingVertical: 9,
          }}
          key={i}
        >
          x {item}
        </Text>
      );
    });

    // card click handler to navigate to card coordinates, not working
    function clickHandler(data_coords) {
      // const latitude = data_coords[0];
      // const longitude = data_coords[1];
      // console.log(latitude, longitude);
      // //will require forward ref
      // mapRef.current.animateToRegion(
      //   // will require forward ref
      //   {
      //     latitude: latitude,
      //     longitude: longitude,
      //     latitudeDelta: 0.4,
      //     longitudeDelta: 0.4,
      //   },
      //   300
      // );
    }

    return (
      <View
        onPress={clickHandler.bind(null, [item.latitude, item.longitude])}
        key={item.id}
        style={styles.card}
      >
        <View>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text
                numberOfLines={1}
                style={{
                  width: 200,
                  color: "white",
                  fontWeight: "bold",
                  flex: 1,
                  fontSize: 12,
                }}
              >
                {updatedName}
              </Text>
              <Text style={{ marginTop: 3, fontSize: 10, color: "#C0C0C0" }}>
                {item.address}
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Image source={require("../assets/distance.png")} />
              <Text style={{ color: "white", fontSize: 10, color: "skyblue" }}>
                {distance} km
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: "#20b2aa",
              fontWeight: "bold",
              fontSize: 12,
              paddingVertical: 14,
            }}
          >
            SUPPORTED CONNECTIONS
          </Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>{name}</View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>{num}</View>
          </View>
        </View>
        <Image
          style={{ alignSelf: "center" }}
          source={require("../assets/arrow.png")}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.cardsWrapper}>
      <View>
        <FlatList
          contentContainerStyle={{ justifyContent: "center" }}
          horizontal={true}
          nestedScrollEnabled={true}
          data={chargers_data}
          keyExtractor={(data) => data.id}
          renderItem={renderChargers}
        />
      </View>
    </ScrollView>
  );
}

export default Cards;

const styles = StyleSheet.create({
  cardsWrapper: {
    flex: 1,
    position: "absolute",
    bottom: 0,
  },
  card: {
    backgroundColor: "#041C2A",
    padding: 20,
    margin: 8,
    borderRadius: 10,
    elevation: 30,
  },
});
