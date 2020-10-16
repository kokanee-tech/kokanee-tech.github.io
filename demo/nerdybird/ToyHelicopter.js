import RotorSoundGenerator from "./RotorSoundGenerator.js";
import Scalar from "../../src/Scalar.js";

export default class ToyHelicopter {
  constructor({
    deps = { RotorSoundGenerator, Scalar },
    context,
    idleThrottleMotorSpeed = 0.4,
    fullThrottleMotorSpeed = 1,
    zeroSpeedResponseTime = 0.8,
    fullSpeedResponseTime = 0.03,
  }) {
    this.deps = deps;
    this.idleThrottleMotorSpeed = idleThrottleMotorSpeed;
    this.fullThrottleMotorSpeed = fullThrottleMotorSpeed;
    this.zeroSpeedResponseTime = zeroSpeedResponseTime;
    this.fullSpeedResponseTime = fullSpeedResponseTime;
    this.motorSpeed = 0;
    this.rotorSoundGenerator = new deps.RotorSoundGenerator({ context });
  }

  async start(audioContext, destination) {
    await this.rotorSoundGenerator.start(audioContext, destination);
  }

  update(throttle, stepsize) {
    const motorSpeedCommand = this.deps.Scalar.lerp(
      this.idleThrottleMotorSpeed,
      this.fullThrottleMotorSpeed,
      throttle
    );

    const responseTime = this.deps.Scalar.lerp(
      this.zeroSpeedResponseTime,
      this.fullSpeedResponseTime,
      this.motorSpeed
    );

    this.motorSpeed = this.deps.Scalar.lag(
      this.motorSpeed,
      motorSpeedCommand,
      1 / responseTime,
      stepsize
    );

    this.rotorSoundGenerator.update(this.motorSpeed);
  }
}
