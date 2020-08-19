import IndicatorBar from "./IndicatorBar.js";
import Scalar from "../../src/Scalar.js";
import ToyHelicopter from "./ToyHelicopter.js";

export default class Simulation {
  constructor({ audioContext, controls, timer, visualContext }) {
    this.deps = { audioContext, controls, timer, visualContext };

    this.settings = { maxStepsize: 0.1 };
  }

  loadSettings(settings) {
    Object.assign(this.settings, settings);
    return this;
  }

  async start() {
    const { audioContext, controls, timer, visualContext } = this.deps;
    const { maxStepsize } = this.settings;
    const indicatorBar = new IndicatorBar(this.deps).loadSettings({
      gaugeSize: 20,
    });
    const toyHelicopter = new ToyHelicopter(audioContext);

    let time = 0;
    await toyHelicopter.start(audioContext, audioContext.destination);

    timer.forEachAnimationFrame((elapsedTime) => {
      visualContext.beginPath();

      indicatorBar.drawAngularGauge(0, (2 * Math.PI * time) / 60);
      indicatorBar.drawLinearGauge(1, toyHelicopter.motorSpeed);

      const canvasWidth = visualContext.canvas.width;
      const canvasHeight = visualContext.canvas.height;
      visualContext.save();
      visualContext.translate(canvasWidth / 2, canvasHeight / 2);
      //      visualContext.scale(100, -100);
      //helicopter.drawSelf(visualContext);
      visualContext.scale(0.2, 0.2);
      visualContext.restore();

      const gamepadSample = controls.getGamepadSample();
      if (gamepadSample) {
        const throttle = gamepadSample.buttons[6].value; // left trigger
        indicatorBar.drawLinearGauge(2, throttle);

        //
        // Limit the integration stepsize in case the animation has been
        // suspended. (The browser may suspend animations if the tab is
        // in the background).
        //
        const stepsize = Math.min(elapsedTime, maxStepsize);

        time = Scalar.integrate(time, 1, stepsize);
        toyHelicopter.update(throttle, stepsize);
      }

      visualContext.stroke();
    });
  }
}
