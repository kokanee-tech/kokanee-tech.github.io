import IndicatorBar from "./IndicatorBar.js";

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
    let time = 0;
    /*
    const lfo = audioContext.createOscillator();
    //...more audio graph setup...
    helicopterOutputNode.connect(audioContext.destination);
    lfo.start();
    */

    timer.forEachAnimationFrame((elapsedTime) => {
      visualContext.beginPath();

      indicatorBar.drawAngularGauge(0, (2 * Math.PI * time) / 60);

      // TODO: finish this...
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
        indicatorBar.drawLinearGauge(1, throttle);

        //lfo.frequency.value = helicopter.rotorSpeed; // or whatever...

        //
        // Limit the integration stepsize in case the animation has been
        // suspended. (The browser may suspend animations if the tab is
        // in the background).
        //
        const MAX_STEPSIZE = 0.1;
        const stepsize = Math.min(elapsedTime, MAX_STEPSIZE);
        time += stepsize;
        //helicopter.update(stepsize, controls.getGamepadSample());
      }

      visualContext.stroke();
    });
  }
}
