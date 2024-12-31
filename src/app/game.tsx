import { useRef, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAudioPlayer } from "expo-audio";
import audioClick from "@/assets/sounds/click.mp3";
import audioWinner from "@/assets/sounds/winner.wav";
import Board from "@/components/game/board";
import { CELL_STATES, playFeedback, winnerFeedback } from "@/utils/utilities";
import Footer from "@/components/game/footer";
import React from "react";
import Status from "@/components/game/status";

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
          .map((_, colIndex) => CELL_STATES.EMPTY) // Set each cell to "row,col"
    );

  const initialState = {
    board: initialBoard,
    players: [player1, player2],
    turn: CELL_STATES.P1,
    win: false,
    draw: false,
    winner: -1,
  };

  const [state, setState] = useState(initialState);

  const moves = useRef<{ emptyRowIndex: number; colIndex: number }[]>([]);
  const lastMove = useRef(-1);

  const getEmptyRowIndex = (colIndex: number) => {
    for (let i = shape.rows - 1; i >= 0; i--) {
      if (state.board[i][colIndex] === CELL_STATES.EMPTY) return i;
    }
    return -1;
  };

  const checkDraw = (board: number[][]) => {
    for (let i = 0; i < shape.cols; i++) {
      if (board[0][i] === CELL_STATES.EMPTY) {
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
          newBoard[cell.row][cell.col] =
            prevState.turn === CELL_STATES.P1 ? CELL_STATES.W1 : CELL_STATES.W2;
        });

        const newState = {
          ...prevState,
          win: true,
          board: newBoard,
          winner: prevState.turn,
          turn:
            prevState.turn === CELL_STATES.P1 ? CELL_STATES.P2 : CELL_STATES.P1,
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

        // // paint arrow cells
        // for(let i=emptyRowIndex-1; i>=0; i--) {
        //   newBoard[i][colIndex] = 'D'
        // }

        let newState = {
          ...prevState,
          board: newBoard,
          turn:
            prevState.turn === CELL_STATES.P1 ? CELL_STATES.P2 : CELL_STATES.P1,
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
    board: number[][],
    rowIndex: number,
    colIndex: number,
    turn: number
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
      state.turn === CELL_STATES.P1 ? CELL_STATES.W2 : CELL_STATES.W1;

    // if game is won
    if (state.win) {
      setState((prevState) => {
        // Create a deep copy of the current board
        const newBoard = prevState.board.map((row) => [...row]);

        newBoard[emptyRowIndex][colIndex] = CELL_STATES.EMPTY;
        const status = checkWinner(newBoard, emptyRowIndex, colIndex, lastTurn);
        console.log(status);

        // unpaint the winner cells
        status.cells.forEach((cell) => {
          newBoard[cell.row][cell.col] =
            lastTurn === CELL_STATES.W1 ? CELL_STATES.P1 : CELL_STATES.P2;
        });
        newBoard[emptyRowIndex][colIndex] = CELL_STATES.EMPTY;

        const newState = {
          ...prevState,
          win: false,
          board: newBoard,
          winner: -1,
          turn:
            prevState.turn === CELL_STATES.P1 ? CELL_STATES.P2 : CELL_STATES.P1,
        };
        return newState;
      });
    } else {
      setState((prevState) => {
        // Create a deep copy of the current board
        const newBoard = prevState.board.map((row) => [...row]);
        newBoard[emptyRowIndex][colIndex] = CELL_STATES.EMPTY;

        const newState = {
          ...prevState,
          board: newBoard,
          turn:
            prevState.turn === CELL_STATES.P1 ? CELL_STATES.P2 : CELL_STATES.P1,
          draw: false,
        };
        return newState;
      });
    }

    // forget last move
    moves.current.pop();
    lastMove.current = lastMove.current - 1;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>CONNECT 4</Text>
      <Board shape={shape} state={state} updateCell={updateCell} />

      <Status state={state} />
      <Footer restart={restart} undo={undo} />
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
});
