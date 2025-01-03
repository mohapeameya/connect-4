import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Platform,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

export default function Index() {
  const logoActualWidth = 402,
    logoActualHeight = 479;
  const logoWidth = 200;
  const logoHeight = (logoWidth * logoActualHeight) / logoActualWidth;

  const onLayoutView = useCallback(() => {
    setTimeout(() => SplashScreen.hide(), 800);
  }, []);

  return (
    <View onLayout={onLayoutView} style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>CONNECT 4</Text>
      <Image
        source={require("@/assets/images/logo.png")}
        style={[styles.logo, { width: logoWidth, height: logoHeight }]}
      />
      <Link href={"/game"} asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start Game</Text>
          {Platform.OS !== "web" && (
            <FontAwesome5 name="play" size={26} color="green" />
          )}
        </TouchableOpacity>
      </Link>
      {/* <Link href={"/settings"} asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Settings</Text>
          <FontAwesome5 name="cog" size={26} color="yellow" />
        </TouchableOpacity>
      </Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 50,
    marginBottom: 40,
    fontWeight: "bold",
    fontStyle: "italic",
    alignSelf: "center",
  },
  logo: {
    alignSelf: "center",
    marginBottom: 40,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "white",
    flexDirection: "row",
    alignSelf: "center", // Center the button
    alignItems: "center", // Center items vertically
    justifyContent: "center", // Center items horizontally
    gap: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "600", // Corrected to a string
  },
});
