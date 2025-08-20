import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "./animation.json";

export default function ShowVideo() {
  return (
    <Player
      autoplay
      loop
      src={animationData}
      style={{ height: "300px", width: "300px" }}
    />
  );
}
