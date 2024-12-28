import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Footer({ restartGame }: { restartGame: () => void }) {
  return (
    <View style={styles.footer}>
      <Link href={"/"} asChild>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="caret-back" size={24} color="yellow" />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("Restart Game");
          restartGame();
        }}
      >
        <Text style={styles.buttonText}>Restart</Text>
        <Ionicons name="refresh" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 50,
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
