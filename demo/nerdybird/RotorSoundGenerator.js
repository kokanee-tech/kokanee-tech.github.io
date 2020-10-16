import Scalar from "../../src/Scalar.js";
import Sound from "./Sound.js";

export default class RotorSoundGenerator {
  constructor({
    deps = { Scalar, Sound, window: globalThis },
    context,
    zeroSpeed = {
      frequency: 1,
      gain: 0,
    },
    fullSpeed = {
      frequency: 15,
      gain: 1,
    },
  }) {
    this.deps = deps;
    this.zeroSpeed = zeroSpeed;
    this.fullSpeed = fullSpeed;
    this.pulseOscillator = deps.Sound.createPulseOscillator(context.audio);
    this.gainNode = context.audio.createGain();
  }

  async renderGrain(sampleRate) {
    const DURATION = 0.05;
    const offlineAudioContext = new this.deps.window.OfflineAudioContext({
      numberOfChannels: 1,
      length: DURATION * sampleRate,
      sampleRate,
    });
    const bufferSource = offlineAudioContext.createBufferSource();
    bufferSource.buffer = this.deps.Sound.createNoiseBuffer(
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
    this.pulseOscillator.frequency.value = this.deps.Scalar.lerp(
      this.zeroSpeed.frequency,
      this.fullSpeed.frequency,
      motorSpeed
    );

    this.gainNode.gain.value = this.deps.Scalar.lerp(
      this.zeroSpeed.gain,
      this.fullSpeed.gain,
      motorSpeed
    );
  }
}
