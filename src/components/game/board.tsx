import { MutableRefObject, useEffect } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";

export default function Board({
  players,
  winner,
  rows,
  cols,
  state,
  updateCell,
}: {
  players: Array<MutableRefObject<string>>;
  winner: string;
  rows: number;
  cols: number;
  state: Array<Array<string>>;
  updateCell: (rowIndex: number, colIndex: number) => void;
}) {
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
        <Pressable
          onPress={() => updateCell(i, j)}
          disabled={winner !== ""}
          key={j}
          style={{
            width: cellWidth,
            height: cellWidth,
            borderRadius: cellWidth / 2,
            borderColor:
              winner &&
              (state[i][j] === players[0].current + "W" ||
                state[i][j] === players[1].current + "W")
                ? "black"
                : "transparent",
            borderWidth:5,
            backgroundColor:
              state[i][j] === players[0].current ||
              state[i][j] === players[0].current + "W"
                ? "yellow"
                : state[i][j] === players[1].current ||
                  state[i][j] === players[1].current + "W"
                ? "red"
                : "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></Pressable>
      );
    }
    board.push(
      <View key={i} style={{ flexDirection: "row", gap: gap }}>
        {row}
      </View>
    );
  }

  useEffect(() => {
    console.log("Board rendered");
  }, []);
  return (
    <View style={styles.board}>
      <View style={{ gap: gap }}>{board}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 25,
  },
});
