import IndicatorBar from "./IndicatorBar.js";
import Scalar from "../../src/Scalar.js";
import ToyHelicopter from "./ToyHelicopter.js";

export default class Simulation {
  constructor({
    deps = { IndicatorBar, Scalar, ToyHelicopter },
    context,
    maxStepsize = 0.1,
  }) {
    this.deps = deps;
    this.context = context;
    this.maxStepsize = maxStepsize;
  }

  async start() {
    const context = this.context;
    const indicatorBar = new this.deps.IndicatorBar({ context, gaugeSize: 20 });
    const toyHelicopter = new this.deps.ToyHelicopter({ context });

    let time = 0;
    await toyHelicopter.start(context.audio, context.audio.destination);

    context.timer.forEachAnimationFrame((elapsedTime) => {
      context.visual.beginPath();

      indicatorBar.drawAngularGauge(0, (2 * Math.PI * time) / 60);
      indicatorBar.drawLinearGauge(1, toyHelicopter.motorSpeed);

      const canvasWidth = context.visual.canvas.width;
      const canvasHeight = context.visual.canvas.height;
      context.visual.save();
      context.visual.translate(canvasWidth / 2, canvasHeight / 2);
      //      context.visual.scale(100, -100);
      //helicopter.drawSelf(context.visual);
      context.visual.scale(0.2, 0.2);
      context.visual.restore();

      const gamepadSample = context.controls.getGamepadSample();
      if (gamepadSample) {
        const throttle = gamepadSample.buttons[6].value; // left trigger
        indicatorBar.drawLinearGauge(2, throttle);

        //
        // Limit the integration stepsize in case the animation has been
        // suspended. (The browser may suspend animations if the tab is
        // in the background).
        //
        const stepsize = Math.min(elapsedTime, this.maxStepsize);

        time = this.deps.Scalar.integrate(time, 1, stepsize);
        toyHelicopter.update(throttle, stepsize);
      }

      context.visual.stroke();
    });
  }
}
