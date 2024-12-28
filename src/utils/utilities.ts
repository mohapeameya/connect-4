import { AudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";

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