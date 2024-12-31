import { CELL_STATES, GameState } from "@/utils/utilities";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Status({ state }: { state: GameState }) {
  return (
    <View
      style={{
        marginTop: 20,
        flexDirection: "row",
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {state.draw ? (
        <Text style={styles.text}>It's a draw!</Text>
      ) : (
        <>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50 / 2,
              backgroundColor: state.win
                ? state.winner === CELL_STATES.P1
                  ? "yellow"
                  : "red"
                : state.turn === CELL_STATES.P1
                ? "yellow"
                : "red",
            }}
          ></View>
          <Text style={styles.text}>
            {state.win
              ? `${
                  state.winner === CELL_STATES.P1
                    ? state.players[0].current
                    : state.players[1].current
                } wins 🎉`
              : `${
                  state.turn === CELL_STATES.P1
                    ? state.players[0].current
                    : state.players[1].current
                }'s turn`}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 30,
  },
});
