import Scalar from "../../src/Scalar.js";
import Sound from "./Sound.js";

export default class RotorSoundGenerator {
  constructor(audioContext) {
    this.pulseOscillator = Sound.createPulseOscillator(audioContext);
    this.gainNode = audioContext.createGain();

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

  async renderGrain(sampleRate) {
    const DURATION = 0.05;
    const offlineAudioContext = new OfflineAudioContext({
      numberOfChannels: 1,
      length: DURATION * sampleRate,
      sampleRate,
    });
    const bufferSource = offlineAudioContext.createBufferSource();
    bufferSource.buffer = Sound.createNoiseBuffer(
      offlineAudioContext,
      DURATION
    );
    const gain = offlineAudioContext.createGain();
    gain.gain.value = 0;
    gain.gain
      .linearRampToValueAtTime(1, DURATION / 2)
      .linearRampToValueAtTime(0, DURATION);
    bufferSource.connect(gain).connect(offlineAudioContext.destination);
    bufferSource.start();
    return offlineAudioContext.startRendering();
  }

  async start(audioContext, destination) {
    const convolver = audioContext.createConvolver();
    convolver.buffer = await this.renderGrain(audioContext.sampleRate);

    this.pulseOscillator
      .connect(convolver)
      .connect(this.gainNode)
      .connect(destination);

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
