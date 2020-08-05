import RotorSoundGenerator from "./RotorSoundGenerator.js";

const IDLE_THROTTLE_MOTOR_SPEED = 0.4;
const FULL_THROTTLE_MOTOR_SPEED = 1;
const ZERO_SPEED_RESPONSE_TIME = 0.8;
const FULL_SPEED_RESPONSE_TIME = 0.03;

export default class ToyHelicopter {
  constructor(audioContext, destination) {
    this.motorSpeed = 0;
    this.rotorSoundGenerator = new RotorSoundGenerator(
      audioContext,
      destination
    );
  }

  start() {
    this.rotorSoundGenerator.start();
  }

  update(stepsize, throttle) {
    // TODO: lerp
    const motorSpeedCommand =
      (1 - throttle) * IDLE_THROTTLE_MOTOR_SPEED +
      throttle * FULL_THROTTLE_MOTOR_SPEED;

    // TODO: lerp
    const responseTime =
      (1 - this.motorSpeed) * ZERO_SPEED_RESPONSE_TIME +
      this.motorSpeed * FULL_SPEED_RESPONSE_TIME;

    // TODO: lag
    this.motorSpeed +=
      ((motorSpeedCommand - this.motorSpeed) * stepsize) /
      (stepsize + responseTime);

    this.rotorSoundGenerator.update(this.motorSpeed);
  }
}
