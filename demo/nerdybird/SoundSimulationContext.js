export default class SoundSimulationContext {
  constructor({ audioContext }) {
    this.deps = { audioContext };
  }

  createGrainConvolver(grainDuration, callback) {
    const { audioContext } = this.deps;
    const CHANNEL_COUNT = 1;
    const frameCount = grainDuration * audioContext.sampleRate;
    const buffer = audioContext.createBuffer(
      CHANNEL_COUNT,
      frameCount,
      audioContext.sampleRate
    );

    const channelData = buffer.getChannelData(0);
    for (let frame = 0; frame < frameCount; frame++) {
      channelData[frame] = callback(frame, frameCount);
    }

    const convolver = audioContext.createConvolver();
    convolver.buffer = buffer;
    return convolver;
  }

  createPulseOscillator() {
    const { audioContext } = this.deps;
    const COEFFICIENT_COUNT = 2048;
    const periodicWave = audioContext.createPeriodicWave(
      new Array(COEFFICIENT_COUNT).fill(1),
      new Array(COEFFICIENT_COUNT).fill(0)
    );

    const oscillator = audioContext.createOscillator();
    oscillator.setPeriodicWave(periodicWave);
    return oscillator;
  }
}
