import Pseudorandom from "../../src/Pseudorandom.js";
import Scalar from "../../src/Scalar.js";
import SoundSimulationContext from "./SoundSimulationContext.js";

const GRAIN_DURATION = 0.05;

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

    this.settings = {
      zeroSpeedFrequency: 1,
      fullSpeedFrequency: 15,
      zeroSpeedGain: 0,
      fullSpeedGain: 1,
    };
  }

  loadSettings(settings) {
    Object.assign(this.settings, settings);
    return this;
  }

  start() {
    this.pulseOscillator.start();
  }

  update(motorSpeed) {
    const {
      zeroSpeedFrequency,
      fullSpeedFrequency,
      zeroSpeedGain,
      fullSpeedGain,
    } = this.settings;

    this.pulseOscillator.frequency.value = Scalar.lerp(
      zeroSpeedFrequency,
      fullSpeedFrequency,
      motorSpeed
    );

    this.gainNode.gain.value = Scalar.lerp(
      zeroSpeedGain,
      fullSpeedGain,
      motorSpeed
    );
  }
}
