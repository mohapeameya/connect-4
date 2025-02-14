import { useEffect } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { CELL_STATES, GameState, Shape } from "@/utils/utilities";

export default function Board({
  shape,
  state,
  updateCell,
}: {
  shape: Shape;
  state: GameState;
  updateCell: (rowIndex: number, colIndex: number) => void;
}) {
  const rows = shape.rows,
    cols = shape.cols;
  const { width, height } = useWindowDimensions();
  const gap = 10;
  const boardWidth = Math.min(width - 2 * gap, 500);
  const boardHeight = Math.min(height, 600);
  let cellWidth = (boardWidth - 2 * gap - (cols - 1) * gap) / cols;
  const cellHeight = (boardHeight - (rows - 1) * gap) / rows;
  cellWidth = Math.min(cellWidth, cellHeight);
  const board = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(
        <Pressable
          onPress={() => updateCell(i, j)}
          disabled={state.win}
          key={j}
          style={{
            width: cellWidth,
            height: cellWidth,
            borderRadius: cellWidth / 2,
            borderColor:
              state.win &&
              (state.board[i][j] === CELL_STATES.W1 ||
                state.board[i][j] === CELL_STATES.W2)
                ? "black"
                : "transparent",
            borderWidth: 5,
            backgroundColor:
              state.board[i][j] === CELL_STATES.P1 ||
              state.board[i][j] === CELL_STATES.W1
                ? "yellow"
                : state.board[i][j] === CELL_STATES.P2 ||
                  state.board[i][j] === CELL_STATES.W2
                ? "red"
                : "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* {state.board[i][j] === 'D' && 
         <Entypo name="chevron-down" size={40} color="white" />
         }  */}
        </Pressable>
      );
    }
    board.push(
      <View key={i} style={{ flexDirection: "row", gap: gap }}>
        {row}
      </View>
    );
  }

  return (
    <View style={[styles.board, { width: boardWidth }]}>
      <View style={{ gap: gap }}>{board}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 25,
    alignSelf: "center",
  },
});
