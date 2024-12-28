import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { useAudioPlayer } from "expo-audio";
import audioClick from "@/assets/sounds/click.mp3";
import audioWinner from "@/assets/sounds/winner.wav";

const Board = ({
  players,
  winner,
  rows,
  cols,
  state,
  updateCell,
}: {
  players: Array<string>;
  winner: string;
  rows: number;
  cols: number;
  state: Array<Array<string>>;
  updateCell: (rowIndex: number, colIndex: number) => void;
}) => {
  const { width, height } = useWindowDimensions();
  const gap = 10;
  const boardWidth = width - gap * 2;
  const boardHeight = height - gap * 2;
  let cellWidth = (boardWidth - (cols - 1) * gap) / cols;
  const cellHeight = (boardHeight - (rows - 1) * gap) / rows;
  cellWidth = Math.min(cellWidth, cellHeight);
  const board = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(
        <TouchableOpacity
          onPress={() => updateCell(i, j)}
          disabled={state[i][j] !== "" || winner !== ""}
          key={j}
          style={{
            width: cellWidth,
            height: cellWidth,
            borderRadius: cellWidth / 2,
            backgroundColor:
              state[i][j] === players[0]
                ? "yellow"
                : state[i][j] === players[1]
                ? "red"
                : "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></TouchableOpacity>
      );
    }
    board.push(
      <View key={i} style={{ flexDirection: "row", gap: gap }}>
        {row}
      </View>
    );
  }
  return <View style={{ gap: gap }}>{board}</View>;
};

export default function Index() {
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

  // Function to update a specific cell
  const updateCell = (rowIndex: number, colIndex: number) => {
    if (checkWinner(rowIndex, colIndex)) {
      setWinner(player);
      winnerFeedback();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
      audioClickPlayer.seekTo(0);
      audioClickPlayer.play();
    }

    setState((prevState) => {
      // Create a deep copy of the current state
      const newState = prevState.map((row) => [...row]);
      // Update the specific cell
      newState[rowIndex][colIndex] = player;
      return newState;
    });
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log("Game help");
          }}
        >
          <Text style={styles.buttonText}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log("Restart Game");
            restartGame();
          }}
        >
          <Text style={styles.buttonText}>Restart Game</Text>
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
    padding: 10,
  },
  buttonText: {
    color: "white",
  },
});
