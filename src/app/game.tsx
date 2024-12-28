import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { useAudioPlayer } from "expo-audio";
import audioClick from "@/assets/sounds/click.mp3";
import audioWinner from "@/assets/sounds/winner.wav";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Board from "@/components/board";

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

  const winnerFeedback = () => {
    audioWinPlayer.seekTo(0);
    audioWinPlayer.play();
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
      }, i * 10);
    }
  };

  const playFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    audioClickPlayer.seekTo(0);
    audioClickPlayer.play();
  }

  const getEmptyRowIndex = (colIndex: number) => {
    for (let i = ROWS - 1; i >= 0; i--) {
      if (state[i][colIndex] === "") return i;
    }
    return -1;
  }

  // Function to update a specific cell
  const updateCell = (rowIndex: number, colIndex: number) => {
    // If no cell is empty in the column, return
    const emptyRowIndex = getEmptyRowIndex(colIndex);
    if(emptyRowIndex === -1) return;


    if (checkWinner(emptyRowIndex, colIndex)) {
      setWinner(player);
      winnerFeedback();
    } else {
      playFeedback();
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
      <View style={styles.board}>
        <Board
          rows={ROWS}
          cols={COLS}
          state={state}
          updateCell={updateCell}
          players={players}
          winner={winner}
        />
      </View>

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
          <Text style={styles.buttonText}>Restart Game</Text>
          <Ionicons name="refresh" size={24} color="red" />
        </TouchableOpacity>
      </View>
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
  },
  board: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 25,
  },
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
