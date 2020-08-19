import RotorSoundGenerator from "./RotorSoundGenerator.js";
import Scalar from "../../src/Scalar.js";

export default class ToyHelicopter {
  constructor(audioContext, destination) {
    this.motorSpeed = 0;
    this.rotorSoundGenerator = new RotorSoundGenerator(
      audioContext,
      destination
    );

    this.settings = {
      idleThrottleMotorSpeed: 0.4,
      fullThrottleMotorSpeed: 1,
      zeroSpeedResponseTime: 0.8,
      fullSpeedResponseTime: 0.03,
    };
  }

  loadSettings(settings) {
    Object.assign(this.settings, settings);
    return this;
  }

  start() {
    this.rotorSoundGenerator.start();
  }

  update(throttle, stepsize) {
    const {
      idleThrottleMotorSpeed,
      fullThrottleMotorSpeed,
      zeroSpeedResponseTime,
      fullSpeedResponseTime,
    } = this.settings;

    const motorSpeedCommand = Scalar.lerp(
      idleThrottleMotorSpeed,
      fullThrottleMotorSpeed,
      throttle
    );

    const responseTime = Scalar.lerp(
      zeroSpeedResponseTime,
      fullSpeedResponseTime,
      this.motorSpeed
    );

    this.motorSpeed = Scalar.lag(
      this.motorSpeed,
      motorSpeedCommand,
      1 / responseTime,
      stepsize
    );

    this.rotorSoundGenerator.update(this.motorSpeed);
  }
}
