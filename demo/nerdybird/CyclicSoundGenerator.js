export default class CyclicSoundGenerator {
  constructor(soundSimulationContext, grainDuration, callback) {
    this.grainConvolver = soundSimulationContext.createGrainConvolver(
      grainDuration,
      callback
    );
    this.pulseOscillator = soundSimulationContext.createPulseOscillator();
    this.pulseOscillator.connect(this.grainConvolver);
  }

  connect(destination) {
    this.grainConvolver.connect(destination);
  }

  setFrequency(value) {
    this.pulseOscillator.frequency.value = value;
  }

  start() {
    this.pulseOscillator.start();
  }
}
