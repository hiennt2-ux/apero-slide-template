import Deck from "@/components/Deck";
import stressDeck from "@/examples/stress-deck.json";
import type { PitchSlide } from "@/lib/pitch";

export default function StressPage() {
  return <Deck pitchSlides={stressDeck as PitchSlide[]} />;
}
