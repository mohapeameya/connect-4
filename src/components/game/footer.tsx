import {
  EvilIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Footer({
  restart,
  undo,
  // redo,
}: {
  restart: () => void;
  undo: () => void;
  // redo: () => void;
}) {
  useEffect(() => {
    console.log("Footer rendered");
  }, []);
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.button}>
        <Ionicons name="caret-back" size={24} color="yellow" />
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      {/* <View style={[styles.button, { flexDirection: "row", gap: 10 }]}> */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            undo();
          }}
        >
          <Text style={styles.buttonText}>Undo</Text>
          <EvilIcons name="undo" size={30} color="white" />
        </TouchableOpacity>
        {/* <TouchableOpacity
          // style={styles.button}
          onPress={() => {
            redo();
          }}
        >
          <EvilIcons name="redo" size={30} color="white" />
        </TouchableOpacity> */}
      {/* </View> */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("Restart Game");
          restart();
        }}
      >
        <Text style={styles.buttonText}>Reset</Text>
        <MaterialIcons name="delete-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
