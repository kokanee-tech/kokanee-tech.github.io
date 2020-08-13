import Pseudorandom from "../../src/Pseudorandom.js";
import Scalar from "../../src/Scalar.js";
import SoundSimulationContext from "./SoundSimulationContext.js";

const GRAIN_DURATION = 0.05;
const ZERO_SPEED_FREQUENCY = 1;
const FULL_SPEED_FREQUENCY = 15;
const ZERO_SPEED_GAIN = 0;
const FULL_SPEED_GAIN = 1;

export default class RotorSoundGenerator {
  constructor(audioContext, destination) {
    const pseudorandom = new Pseudorandom();
    const soundSimulationContext = new SoundSimulationContext(audioContext);
    const pulseOscillator = soundSimulationContext.createPulseOscillator();
    const grainBuffer = soundSimulationContext.createGrainBuffer(
      GRAIN_DURATION,
      (frame, frameCount) =>
        (2 * pseudorandom.nextScalar() - 1) * Scalar.tent(frame / frameCount)
    );
    const grainConvolver = soundSimulationContext.createGrainConvolver(
      grainBuffer
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
    this.pulseOscillator.frequency.value = Scalar.lerp(
      ZERO_SPEED_FREQUENCY,
      FULL_SPEED_FREQUENCY,
      motorSpeed
    );
    this.gainNode.gain.value = Scalar.lerp(
      ZERO_SPEED_GAIN,
      FULL_SPEED_GAIN,
      motorSpeed
    );
  }
}
