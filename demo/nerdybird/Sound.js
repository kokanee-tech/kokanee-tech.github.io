import Pseudorandom from "../../src/Pseudorandom.js";

export default class Sound {
  static createNoiseBuffer(audioContext, duration) {
    const CHANNEL_COUNT = 1;
    const frameCount = duration * audioContext.sampleRate;
    const buffer = audioContext.createBuffer(
      CHANNEL_COUNT,
      frameCount,
      audioContext.sampleRate
    );

    const channelData = buffer.getChannelData(0);
    const pseudorandom = new Pseudorandom();
    for (let frame = 0; frame < frameCount; frame++) {
      channelData[frame] = pseudorandom.nextScalar() * 2 - 1;
    }

    return buffer;
  }

  static createPulseOscillator(audioContext) {
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
