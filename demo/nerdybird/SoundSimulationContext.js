export default class SoundSimulationContext {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  createGrainConvolver(grainDuration, callback) {
    const CHANNEL_COUNT = 1;
    const frameCount = grainDuration * this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(
      CHANNEL_COUNT,
      frameCount,
      this.audioContext.sampleRate
    );

    const channelData = buffer.getChannelData(0);
    for (let frame = 0; frame < frameCount; frame++) {
      channelData[frame] = callback(frame, frameCount);
    }

    const convolver = this.audioContext.createConvolver();
    convolver.buffer = buffer;
    return convolver;
  }

  createPulseOscillator() {
    const COEFFICIENT_COUNT = 2048;
    const periodicWave = this.audioContext.createPeriodicWave(
      new Array(COEFFICIENT_COUNT).fill(1),
      new Array(COEFFICIENT_COUNT).fill(0)
    );

    const oscillator = this.audioContext.createOscillator();
    oscillator.setPeriodicWave(periodicWave);
    return oscillator;
  }
}
