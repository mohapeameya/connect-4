import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Footer({ restartGame }: { restartGame: () => void }) {
  useEffect(() => {
    console.log("Footer rendered");
  }, []);
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.button}>
        <Ionicons name="caret-back" size={24} color="yellow" />
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("Restart Game");
          restartGame();
        }}
      >
        <Text style={styles.buttonText}>Reset</Text>
        <Ionicons name="refresh" size={24} color="red" />
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
    paddingHorizontal: 15,
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
