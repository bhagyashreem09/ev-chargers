import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";

function FloatingButton(props) {
  return (
    <Pressable style={styles.container} onPress={props.onPress}>
      <Text style={styles.title}>{props.title}</Text>
    </Pressable>
  );
}

export default FloatingButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    // position: "absolute",
    // bottom: "10%",
    // right: 40,
    backgroundColor: "#26653A",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
