import { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import isEqual from "lodash/isEqual";

export default function App() {
  const starterBoard: string[][] = [
    ["5", "3", "", "", "7", "", "", "", ""],
    ["6", "", "", "1", "9", "5", "", "", ""],
    ["", "9", "8", "", "", "", "", "6", ""],
    ["8", "", "", "", "6", "", "", "", "3"],
    ["4", "", "", "8", "", "3", "", "", "1"],
    ["7", "", "", "", "2", "", "", "", "6"],
    ["", "6", "", "", "", "", "2", "8", ""],
    ["", "", "", "4", "1", "9", "", "", "5"],
    ["", "", "", "", "8", "", "", "7", "9"],
  ];

  const [board, setBoard] = useState<string[][]>([]);
  const [locked, setLocked] = useState<boolean[][]>([]);
  const [error, setError] = useState<string>("");
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    setBoard(starterBoard);
    const lockedCells = starterBoard.map((row) =>
      row.map((cell) => cell !== "")
    );
    setLocked(lockedCells);
  }, []);

  const handleChange = (text: string, row: number, col: number) => {
    const updateBoard = [...board];
    const value = text.replace(/[^1-9]/g, "").slice(0, 1);

    updateBoard[row][col] = value;
    setBoard(updateBoard);
  };

  const checkBoard = () => {
    if (isEqual(board, starterBoard)) {
      setError("You should actually start :)");
      return;
    }
    for (let row = 0; row < 9; row++) {
      let seen = new Set();
      for (let i = 0; i < 9; i++) {
        if (seen.has(board[row][i])) {
          setError("Row has duplicate values. Must be numeric 1-9 per row.");
          return;
        }
        seen.add(board[row][i]);
      }
    }
    for (let col = 0; col < 9; col++) {
      let seen = new Set();
      for (let i = 0; i < 9; i++) {
        if (seen.has(board[col][i])) {
          setError("Col has duplicate values. Must be numeric 1-9 per column.");
          return;
        }
        seen.add(board[col][i]);
      }
    }

    for (let square = 0; square < 9; square++) {
      let seen = new Set();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          //I got this part from my leetcode solution
          let row = Math.floor(square / 3) * 3 + i;
          let col = (square % 3) * 3 + j;
          if (seen.has(board[row][col])) {
            setError("One of the squares does not add up to 9.");
          }
          seen.add(board[row][col]);
        }
      }
    }
    setError("");
    setIsSuccessModalVisible(true);
  };

  const resetBoard = () => {
    setBoard(starterBoard);
    setError("");
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      testID="dismissable-area"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={styles.header}>Sudoku</Text>
            {board.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((cell, colIndex) => (
                  <TextInput
                    key={`${rowIndex}-${colIndex}`}
                    style={[
                      styles.cell,
                      rowIndex % 3 === 0 && rowIndex !== 0
                        ? styles.thickTopBorder
                        : {},
                      colIndex % 3 === 0 && colIndex !== 0
                        ? styles.thickLeftBorder
                        : {},
                    ]}
                    maxLength={1}
                    onChangeText={(text) =>
                      handleChange(text, rowIndex, colIndex)
                    }
                    value={cell}
                    keyboardType="numeric"
                    editable={!locked[rowIndex][colIndex]}
                  />
                ))}
              </View>
            ))}
            <View>
              <Text style={styles.errorText}>{error}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={checkBoard}
              >
                <Text style={styles.buttonText}>Finished</Text>
                <FontAwesome
                  name="check"
                  size={16}
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={resetBoard}
              >
                <Text style={styles.buttonText}>Reset</Text>
                <FontAwesome
                  name="refresh"
                  size={16}
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isSuccessModalVisible}
          onRequestClose={() => setIsSuccessModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text
                style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}
              >
                Congratulations Champ!
              </Text>
              <Text>You can actually solve a sudoku puzzle :)</Text>
              <TouchableOpacity
                style={[styles.submitButton, { marginTop: 30 }]}
                onPress={() => setIsSuccessModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
                <FontAwesome
                  name="close"
                  size={16}
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  thickTopBorder: {
    borderTopWidth: 3,
  },
  thickLeftBorder: {
    borderLeftWidth: 3,
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
  },
  header: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 10,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0047AB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: 150,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#000",
    fontSize: 14,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
