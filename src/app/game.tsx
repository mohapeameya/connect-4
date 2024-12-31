import { useRef, useState } from "react";
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
  const shape = { rows: 6, cols: 5 };

  const player1 = useRef("Player 1");
  const player2 = useRef("Player 2");

  const initialBoard = Array(shape.rows) // Create an array with 6 rows
    .fill(null)
    .map(
      (_, rowIndex) =>
        Array(shape.cols) // Create an array with 7 columns
          .fill(null)
          .map((_, colIndex) => "") // Set each cell to "row,col"
    );

  const initialState = {
    board: initialBoard,
    players: [player1, player2],
    turn: player1.current,
    win: false,
    draw: false,
    winner: "",
  };

  const [state, setState] = useState(initialState);

  const moves = useRef<{ emptyRowIndex: number; colIndex: number }[]>([]);
  const lastMove = useRef(-1);

  const getEmptyRowIndex = (colIndex: number) => {
    for (let i = shape.rows - 1; i >= 0; i--) {
      if (state.board[i][colIndex] === "") return i;
    }
    return -1;
  };

  const checkDraw = (board: string[][]) => {
    for (let i = 0; i < shape.cols; i++) {
      if (board[0][i] === "") {
        console.log(state.board[0][i]);
        return false;
      }
    }
    return true;
  };

  // Function to update a specific cell
  const updateCell = (rowIndex: number, colIndex: number) => {
    // If no cell is empty in the column, return
    const emptyRowIndex = getEmptyRowIndex(colIndex);
    if (emptyRowIndex === -1) return;

    // sound
    playFeedback(audioClickPlayer);

    // Add the move to the moves array
    moves.current.push({ emptyRowIndex: emptyRowIndex, colIndex: colIndex });
    lastMove.current = moves.current.length - 1;

    const status = checkWinner(
      state.board,
      emptyRowIndex,
      colIndex,
      state.turn
    );

    if (status.winner) {
      winnerFeedback(audioWinPlayer);
      setState((prevState) => {
        // Create a deep copy of the current board
        const newBoard = prevState.board.map((row) => [...row]);

        // paint the winner cells
        status.cells.forEach((cell) => {
          newBoard[cell.row][cell.col] = prevState.turn + "W";
        });

        const newState = {
          ...prevState,
          win: true,
          board: newBoard,
          winner: prevState.turn,
          turn:
            prevState.turn === player1.current
              ? player2.current
              : player1.current,
        };
        return newState;
      });
    } else {
      setState((prevState) => {
        // Create a deep copy of the current board
        const newBoard = prevState.board.map((row) => [...row]);

        // Update first empty cell in the column from the bottom
        // As per the original game rules
        newBoard[emptyRowIndex][colIndex] = prevState.turn;

        let newState = {
          ...prevState,
          board: newBoard,
          turn:
            prevState.turn === player1.current
              ? player2.current
              : player1.current,
        };
        if (checkDraw(newBoard)) {
          newState = { ...newState, draw: true };
        }
        return newState;
      });
    }
  };

  // crux of the game
  const checkWinner = (
    board: string[][],
    rowIndex: number,
    colIndex: number,
    turn: string
  ) => {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    for (const [dx, dy] of directions) {
      let cells = [{ row: rowIndex, col: colIndex }];
      let count = 1;
      for (let i = 1; i < 4; i++) {
        const newRow = rowIndex + i * dx;
        const newCol = colIndex + i * dy;
        if (
          newRow < 0 ||
          newRow >= shape.rows ||
          newCol < 0 ||
          newCol >= shape.cols ||
          board[newRow][newCol] !== turn
        )
          break;
        cells.push({ row: newRow, col: newCol });
        count++;
      }
      for (let i = 1; i < 4; i++) {
        const newRow = rowIndex - i * dx;
        const newCol = colIndex - i * dy;
        if (
          newRow < 0 ||
          newRow >= shape.rows ||
          newCol < 0 ||
          newCol >= shape.cols ||
          board[newRow][newCol] !== turn
        )
          break;
        cells.push({ row: newRow, col: newCol });
        count++;
      }
      // winner
      if (count >= 4) {
        return { winner: true, cells: cells };
      }
    }
    return { winner: false, cells: [] };
  };

  const restart = () => {
    // clear moves
    lastMove.current = -1;
    moves.current = [];

    // reset states
    setState(initialState);
  };

  const undo = () => {
    if (lastMove.current < 0) return;

    playFeedback(audioClickPlayer);
    // move state one move back
    const { emptyRowIndex, colIndex } = moves.current[lastMove.current];
    const lastTurn =
      state.turn === player1.current ? player2.current : player1.current;

    // if game is won
    if (state.win) {
      setState((prevState) => {
        // Create a deep copy of the current board
        const newBoard = prevState.board.map((row) => [...row]);

        newBoard[emptyRowIndex][colIndex] = "";
        const status = checkWinner(
          newBoard,
          emptyRowIndex,
          colIndex,
          lastTurn + "W"
        );
        console.log(status);

        // unpaint the winner cells
        status.cells.forEach((cell) => {
          newBoard[cell.row][cell.col] = lastTurn;
        });
        newBoard[emptyRowIndex][colIndex] = "";

        const newState = {
          ...prevState,
          win: false,
          board: newBoard,
          winner: "",
          turn:
            prevState.turn === player1.current
              ? player2.current
              : player1.current,
        };
        return newState;
      });
    } else {
      setState((prevState) => {
        // Create a deep copy of the current board
        const newBoard = prevState.board.map((row) => [...row]);
        newBoard[emptyRowIndex][colIndex] = "";

        const newState = {
          ...prevState,
          board: newBoard,
          turn:
            prevState.turn === player1.current
              ? player2.current
              : player1.current,
          draw: false,
        };
        return newState;
      });
    }

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
      <Board shape={shape} state={state} updateCell={updateCell} />

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
                  ? state.winner === player1.current
                    ? "yellow"
                    : "red"
                  : state.turn === player1.current
                  ? "yellow"
                  : "red",
              }}
            ></View>
            <Text style={styles.text}>
              {state.win
                ? `${state.winner} wins 🎉`
                : `${
                    state.turn === player1.current
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
