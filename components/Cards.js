import { StyleSheet, View, Text, FlatList } from "react-native";
import { Card } from "react-native-elements";
// import data from "../data/data.json";

function Cards() {
  let chargers = props.data.map((content, i) => {
    <View>
      <View>{content.name}</View>
      <View>{content.address}</View>
      <View>{content.distance}</View>
      <Text>Supported Connections</Text>
      {/* <View>{props.connector_types}</View> */}
    </View>;
  });
  return (
    <FlatList>
      <Text>{chargers}</Text>
    </FlatList>
  );
}

export default Cards;
