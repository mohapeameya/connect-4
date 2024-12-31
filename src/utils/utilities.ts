import { AudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { MutableRefObject } from "react";

export const winnerFeedback = (audioWinPlayer: AudioPlayer) => {
  audioWinPlayer.seekTo(0);
  audioWinPlayer.play();
  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }, i * 10);
  }
};

export const playFeedback = (audioClickPlayer: AudioPlayer) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  audioClickPlayer.seekTo(0);
  audioClickPlayer.play();
};

export const CELL_STATES = {
  EMPTY: 0,
  P1: 1,
  P2: 2,
  W1: 3,
  W2: 4,
};

export interface GameState {
  board: number[][];
  turn: number;
  players: MutableRefObject<string>[];
  win: boolean;
  draw: boolean;
  winner: number;
}

export interface Shape {
  rows: number;
  cols: number;
}