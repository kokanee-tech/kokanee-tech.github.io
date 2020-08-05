import IndicatorBar from "./IndicatorBar.js";
import Scalar from "../../src/Scalar.js";
import ToyHelicopter from "./ToyHelicopter.js";

export default class Simulation {
  constructor({ audioContext, controls, timer, visualContext }) {
    this.deps = { audioContext, controls, timer, visualContext };
    this.paused = false;
  }

  start() {
    const { audioContext, controls, timer, visualContext } = this.deps;
    const indicatorBar = new IndicatorBar(this.deps).loadSettings({
      gaugeSize: 20,
    });
    const masterGain = audioContext.createGain();
    const toyHelicopter = new ToyHelicopter(audioContext, masterGain);
    masterGain.connect(audioContext.destination);

    let time = 0;
    masterGain.gain.value = 0;
    toyHelicopter.start();

    timer.forEachAnimationFrame((elapsedTime) => {
      visualContext.beginPath();

      indicatorBar.drawAngularGauge(0, (2 * Math.PI * time) / 60);
      indicatorBar.drawLinearGauge(1, toyHelicopter.motorSpeed);

      const canvasWidth = visualContext.canvas.width;
      const canvasHeight = visualContext.canvas.height;
      visualContext.save();
      visualContext.translate(canvasWidth / 2, canvasHeight / 2);
      visualContext.scale(100, -100);
      //helicopter.drawSelf(visualContext);
      visualContext.restore();

      if (this.paused) {
        masterGain.gain.value = 0;
      } else {
        masterGain.gain.value = 1;

        const gamepadSample = controls.getGamepadSample();
        const throttle = gamepadSample.buttons[6].value; // left trigger
        indicatorBar.drawLinearGauge(2, throttle);

        //
        // Limit the integration stepsize in case the animation has been
        // suspended. (The browser may suspend animations if the tab is
        // in the background).
        //
        const MAX_STEPSIZE = 0.1;
        const stepsize = Math.min(elapsedTime, MAX_STEPSIZE);

        time = Scalar.integrate(time, 1, stepsize);
        toyHelicopter.update(stepsize, throttle);
      }

      visualContext.stroke();
    });
  }
}
