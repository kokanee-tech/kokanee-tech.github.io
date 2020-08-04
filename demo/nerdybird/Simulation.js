import CyclicSoundGenerator from "./CyclicSoundGenerator.js";
import IndicatorBar from "./IndicatorBar.js";
import Pseudorandom from "../../src/Pseudorandom.js";
import SoundSimulationContext from "./SoundSimulationContext.js";

export default class Simulation {
  constructor({ audioContext, controls, timer, visualContext }) {
    this.deps = { audioContext, controls, timer, visualContext };
    this.paused = false;
  }

  start() {
    const { audioContext, controls, timer, visualContext } = this.deps;
    const pseudorandom = new Pseudorandom();
    const indicatorBar = new IndicatorBar(this.deps).loadSettings({
      gaugeSize: 20,
    });
    const soundSimulationContext = new SoundSimulationContext(this.deps);
    const cyclicSoundGenerator = new CyclicSoundGenerator(
      soundSimulationContext,
      0.05,
      (frame, frameCount) =>
        (2 * pseudorandom.nextScalar() - 1) *
        Math.min((2 * frame) / frameCount, 2 - (2 * frame) / frameCount)
    );

    let time = 0;
    let motorSpeed = 0;
    cyclicSoundGenerator.connect(audioContext.destination);
    cyclicSoundGenerator.setFrequency(8 + 7 * motorSpeed);
    cyclicSoundGenerator.start();

    timer.forEachAnimationFrame((elapsedTime) => {
      visualContext.beginPath();

      indicatorBar.drawAngularGauge(0, (2 * Math.PI * time) / 60);
      indicatorBar.drawLinearGauge(1, motorSpeed);

      const canvasWidth = visualContext.canvas.width;
      const canvasHeight = visualContext.canvas.height;
      visualContext.save();
      visualContext.translate(canvasWidth / 2, canvasHeight / 2);
      visualContext.scale(100, -100);
      //helicopter.drawSelf(visualContext);
      visualContext.restore();

      if (this.paused) {
        // TODO: mute audio
      } else {
        const gamepadSample = controls.getGamepadSample();
        const throttle = gamepadSample.buttons[6].value; // left trigger
        indicatorBar.drawLinearGauge(2, throttle);
        cyclicSoundGenerator.setFrequency(8 + 7 * motorSpeed);

        //
        // Limit the integration stepsize in case the animation has been
        // suspended. (The browser may suspend animations if the tab is
        // in the background).
        //
        const MAX_STEPSIZE = 0.1;
        const stepsize = Math.min(elapsedTime, MAX_STEPSIZE);
        time += stepsize;
        motorSpeed += ((throttle - motorSpeed) * stepsize) / (stepsize + 0.03);
        //helicopter.update(stepsize, controls.getGamepadSample());
      }

      visualContext.stroke();
    });
  }
}
