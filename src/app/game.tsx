import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAudioPlayer } from "expo-audio";
import audioClick from "@/assets/sounds/click.mp3";
import audioWinner from "@/assets/sounds/winner.wav";
import Board from "@/components/board";
import { playFeedback, winnerFeedback } from "@/utils/utilities";
import Footer from "@/components/footer";

export default function Game() {
  const audioClickPlayer = useAudioPlayer(audioClick);
  const audioWinPlayer = useAudioPlayer(audioWinner);
  const ROWS = 6,
    COLS = 5;

  const [state, setState] = useState(
    Array(ROWS) // Create an array with 6 rows
      .fill(null)
      .map(
        (_, rowIndex) =>
          Array(COLS) // Create an array with 7 columns
            .fill(null)
            .map((_, colIndex) => "") // Set each cell to "row,col"
      )
  );
  const [player1, setPlayer1] = useState("Player 1");
  const [player2, setPlayer2] = useState("Player 2");
  const [player, setPlayer] = useState("Player 1");
  const [winner, setWinner] = useState("");
  const players = [player1, player2];

  const getEmptyRowIndex = (colIndex: number) => {
    for (let i = ROWS - 1; i >= 0; i--) {
      if (state[i][colIndex] === "") return i;
    }
    return -1;
  };

  // Function to update a specific cell
  const updateCell = (rowIndex: number, colIndex: number) => {
    // If no cell is empty in the column, return
    const emptyRowIndex = getEmptyRowIndex(colIndex);
    if (emptyRowIndex === -1) return;

    if (checkWinner(emptyRowIndex, colIndex)) {
      setWinner(player);
      winnerFeedback(audioWinPlayer);
    } else {
      playFeedback(audioClickPlayer);
    }

    // update state
    setState((prevState) => {
      // Create a deep copy of the current state
      const newState = prevState.map((row) => [...row]);

      // Update the specific cell
      // newState[rowIndex][colIndex] = player; // Update the specific cell
      newState[emptyRowIndex][colIndex] = player; // Update first empty cell in the column from the bottom

      return newState;
    });

    // update player turn
    setPlayer(player === player1 ? player2 : player1);
  };

  // crux of the game
  const checkWinner = (rowIndex: number, colIndex: number) => {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    for (const [dx, dy] of directions) {
      let count = 1;
      for (let i = 1; i < 4; i++) {
        const newRow = rowIndex + i * dx;
        const newCol = colIndex + i * dy;
        if (
          newRow < 0 ||
          newRow >= ROWS ||
          newCol < 0 ||
          newCol >= COLS ||
          state[newRow][newCol] !== player
        )
          break;
        count++;
      }
      for (let i = 1; i < 4; i++) {
        const newRow = rowIndex - i * dx;
        const newCol = colIndex - i * dy;
        if (
          newRow < 0 ||
          newRow >= ROWS ||
          newCol < 0 ||
          newCol >= COLS ||
          state[newRow][newCol] !== player
        )
          break;
        count++;
      }
      if (count >= 4) return true;
    }
    return false;
  };

  const restartGame = () => {
    setState(
      Array(ROWS) // Create an array with 6 rows
        .fill(null)
        .map(
          (_, rowIndex) =>
            Array(COLS) // Create an array with 7 columns
              .fill(null)
              .map((_, colIndex) => "") // Set each cell to "row,col"
        )
    );
    setPlayer(player1);
    setWinner("");
  };
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>CONNECT 4</Text>
        <Board
          rows={ROWS}
          cols={COLS}
          state={state}
          updateCell={updateCell}
          players={players}
          winner={winner}
        />

      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 50 / 2,
            backgroundColor: winner
              ? winner === player1
                ? "yellow"
                : "red"
              : player === player1
              ? "yellow"
              : "red",
          }}
        ></View>
        {winner ? (
          <Text style={{ color: "white", fontSize: 30 }}>{winner} wins 🎉</Text>
        ) : (
          <Text style={{ color: "white", fontSize: 30 }}>
            {player === player1 ? player1 : player2}'s turn
          </Text>
        )}
      </View>
      <Footer restartGame={restartGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  title: {
    color: "white",
    fontSize: 30,
    marginBottom: 40,
    fontWeight: "bold",
    fontStyle: "italic",
    alignSelf: "center",
  }
});
