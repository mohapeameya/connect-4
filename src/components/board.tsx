import { TouchableOpacity, useWindowDimensions, View } from "react-native";

export default function Board ({
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

