import Pseudorandom from "../../src/Pseudorandom.js";
import SoundSimulationContext from "./SoundSimulationContext.js";

const GRAIN_DURATION = 0.05;
const ZERO_SPEED_FREQUENCY = 0.1;
const FULL_SPEED_FREQUENCY = 15;
const ZERO_SPEED_GAIN = 0.6;
const FULL_SPEED_GAIN = 1;

export default class RotorSoundGenerator {
  constructor(audioContext, destination) {
    const pseudorandom = new Pseudorandom();
    const soundSimulationContext = new SoundSimulationContext(audioContext);
    const pulseOscillator = soundSimulationContext.createPulseOscillator();
    const grainConvolver = soundSimulationContext.createGrainConvolver(
      GRAIN_DURATION,
      (frame, frameCount) =>
        (2 * pseudorandom.nextScalar() - 1) *
        Math.min((2 * frame) / frameCount, 2 - (2 * frame) / frameCount) // TODO: tent
    );
    const gainNode = audioContext.createGain();

    pulseOscillator.connect(grainConvolver);
    grainConvolver.connect(gainNode);
    gainNode.connect(destination);

    this.pulseOscillator = pulseOscillator;
    this.gainNode = gainNode;
  }

  start() {
    this.pulseOscillator.start();
  }

  update(motorSpeed) {
    // TODO: lerp
    this.pulseOscillator.frequency.value =
      (1 - motorSpeed) * ZERO_SPEED_FREQUENCY +
      motorSpeed * FULL_SPEED_FREQUENCY;
    // TODO: lerp
    this.gainNode.gain.value =
      (1 - motorSpeed) * ZERO_SPEED_GAIN + motorSpeed * FULL_SPEED_GAIN;
  }
}
