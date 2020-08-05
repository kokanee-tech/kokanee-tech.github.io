import RotorSoundGenerator from "./RotorSoundGenerator.js";
import Scalar from "../../src/Scalar.js";

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
    const motorSpeedCommand = Scalar.lerp(
      IDLE_THROTTLE_MOTOR_SPEED,
      FULL_THROTTLE_MOTOR_SPEED,
      throttle
    );
    const responseTime = Scalar.lerp(
      ZERO_SPEED_RESPONSE_TIME,
      FULL_SPEED_RESPONSE_TIME,
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
