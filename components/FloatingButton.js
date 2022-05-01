import { StyleSheet, Text, TouchableHighlight } from "react-native";
import React from "react";

function FloatingButton(props) {
  return (
    <TouchableHighlight
      style={styles.container}
      onPress={props.onPress}
      activeOpacity={0.6}
      underlayColor="#ff6699"
    >
      <Text style={styles.title}>{props.title}</Text>
    </TouchableHighlight>
  );
}

export default FloatingButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#26653A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "teal",
  },
  title: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
});
