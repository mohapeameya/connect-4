import { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAudioPlayer } from "expo-audio";
import audioClick from "@/assets/sounds/click.mp3";
import audioWinner from "@/assets/sounds/winner.wav";
import Board from "@/components/game/board";
import { playFeedback, winnerFeedback } from "@/utils/utilities";
import Footer from "@/components/game/footer";
import React from "react";

export default function Game() {
  const audioClickPlayer = useAudioPlayer(audioClick);
  const audioWinPlayer = useAudioPlayer(audioWinner);
  const ROWS = 6,
    COLS = 5;

  const initialBoard = Array(ROWS) // Create an array with 6 rows
    .fill(null)
    .map(
      (_, rowIndex) =>
        Array(COLS) // Create an array with 7 columns
          .fill(null)
          .map((_, colIndex) => "") // Set each cell to "row,col"
    );
  const [state, setState] = useState(initialBoard);
  const player1 = useRef("Player 1");
  const player2 = useRef("Player 2");
  const [player, setPlayer] = useState("Player 1");
  const [winner, setWinner] = useState("");
  const [draw, setDraw] = useState(false);
  const players = [player1, player2];
  const moves = useRef<{ emptyRowIndex: number; colIndex: number }[]>([]);
  const lastMove = useRef(-1);

  const getEmptyRowIndex = (colIndex: number) => {
    for (let i = ROWS - 1; i >= 0; i--) {
      if (state[i][colIndex] === "") return i;
    }
    return -1;
  };

  const checkDraw = () => {
    for (let i = 0; i < COLS; i++) {
      if (state[0][i] === "") {
        return false;
      }
    }
    return true;
  };

  // check winner, draw, or update player turn
  // on state change
  useEffect(() => {
    // need to set player turn if no move has
    // been made in case of undo till the start
    if (lastMove.current < 0) {
      setPlayer(player1.current);
      return; // no move yet
    }

    if(winner) return; // game already won

    if (
      checkWinner(
        moves.current[lastMove.current].emptyRowIndex,
        moves.current[lastMove.current].colIndex
      )
    ) {
      setWinner(player);
      winnerFeedback(audioWinPlayer);
    } else if (checkDraw()) {
      setDraw(true);
    }
    setPlayer(player === player1.current ? player2.current : player1.current);
  }, [state]);

  // Function to update a specific cell
  const updateCell = (rowIndex: number, colIndex: number) => {
    
    // If no cell is empty in the column, return
    const emptyRowIndex = getEmptyRowIndex(colIndex);
    if (emptyRowIndex === -1) return;

    // sound
    playFeedback(audioClickPlayer);

    // Use ref is sync, therefore last move is updated
    // before the state is updated

    // Add the move to the moves array
    moves.current.push({ emptyRowIndex: emptyRowIndex, colIndex: colIndex });
    lastMove.current = moves.current.length - 1;
    // console.log(moves.current);

    // update state
    setState((prevState) => {
      // Create a deep copy of the current state
      const newState = prevState.map((row) => [...row]);

      // Update the specific cell (similar to X and O game)
      // newState[rowIndex][colIndex] = player;

      // Update first empty cell in the column from the bottom
      // As per the original game rules
      newState[emptyRowIndex][colIndex] = player;

      return newState;
    });
  };

  // paint the winner cells
  const paintWinner = (connect4: { row: number; col: number }[]) => {
    const newState = state.map((row) => [...row]);
    connect4.forEach((cell) => {
      newState[cell.row][cell.col] = player + "W";
    });
    setState(newState);
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
      let connect4 = [{ row: rowIndex, col: colIndex }];
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
        connect4.push({ row: newRow, col: newCol });
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
        connect4.push({ row: newRow, col: newCol });
        count++;
      }
      // winner
      if (count >= 4) {
        paintWinner(connect4.slice(0, 4));
        return true;
      }
    }
    return false;
  };

  const restart = () => {
    // clear moves
    lastMove.current = -1;
    moves.current = [];

    // reset states
    setState(initialBoard);
    setPlayer(player1.current);
    setWinner("");
    setDraw(false);
  };

  const undo = () => {
    if (lastMove.current < 0) return;

    playFeedback(audioClickPlayer);
    // move state one move back
    const { emptyRowIndex, colIndex } = moves.current[lastMove.current];
    const newState = state.map((row) => [...row]);

    // unpaint winner if present
    for(let i=0;i<ROWS;i++) {
      for(let j=0;j<COLS;j++) {
        if(newState[i][j] === player1.current + 'W') {
          newState[i][j] = player1.current;
        } else if(newState[i][j] === player2.current + 'W') {
          newState[i][j] = player2.current;
        }
      }
    }
    newState[emptyRowIndex][colIndex] = "";
    setState(newState);

    // clear winner/draw
    setWinner("");
    setDraw(false);

    // forget last move
    moves.current.pop();
    lastMove.current = lastMove.current - 1;
  };

  //  untested
  // const redo = () => {
  //   if (lastMove.current >= moves.current.length - 1) return;
  //   lastMove.current = lastMove.current + 1;
  //   const { emptyRowIndex, colIndex } = moves.current[lastMove.current];
  //   const newState = state.map((row) => [...row]);
  //   newState[emptyRowIndex][colIndex] = player;
  //   setState(newState);
  //   // setPlayer(player === player1.current ? player2.current : player1.current);
  //   // setWinner("");
  //   // setDraw(false);
  // }

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
        {draw ? (
          <Text style={styles.text}>It's a draw!</Text>
        ) : (
          <>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 50 / 2,
                backgroundColor: winner
                  ? winner === player1.current
                    ? "yellow"
                    : "red"
                  : player === player1.current
                  ? "yellow"
                  : "red",
              }}
            ></View>
            <Text style={styles.text}>
              {winner
                ? `${winner} wins 🎉`
                : `${
                    player === player1.current
                      ? player1.current
                      : player2.current
                  }'s turn`}
            </Text>
          </>
        )}
      </View>
      <Footer
        restart={restart}
        undo={undo}
        // redo={redo}
      />
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
    marginBottom: 20,
    fontWeight: "bold",
    fontStyle: "italic",
    alignSelf: "center",
  },
  text: {
    color: "white",
    fontSize: 30,
  },
});
