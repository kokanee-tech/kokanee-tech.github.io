import Clock from "./Clock.js";

export default class Simulation {
  constructor({ audioContext, controls, timer, visualContext }) {
    this.deps = { audioContext, controls, timer, visualContext };
    this.paused = false;
  }

  start() {
    const { audioContext, controls, timer, visualContext } = this.deps;

    //
    // Indicator for simulation time
    //
    const clock = new Clock(this.deps);

    /*
    const lfo = audioContext.createOscillator();
    //...more audio graph setup...
    helicopterOutputNode.connect(audioContext.destination);
    lfo.start();
    */

    timer.forEachAnimationFrame((elapsedTime) => {
      const canvasWidth = visualContext.canvas.width;
      const canvasHeight = visualContext.canvas.height;

      visualContext.save();
      visualContext.translate(canvasWidth - 12, 12);
      visualContext.scale(10, 10);
      visualContext.beginPath();
      clock.indicate();
      visualContext.restore();
      visualContext.stroke();

      if (this.paused) {
        // TODO: mute audio
      } else {
        //
        // Browers suspend animations while the tab is in the background
        // so we need an upper limit on the value that we use for numerical
        // integration.
        //
        const MAX_STEPSIZE = 0.1;
        const stepsize = Math.min(elapsedTime, MAX_STEPSIZE);

        visualContext.save();
        visualContext.translate(canvasWidth / 2, canvasHeight / 2);
        visualContext.scale(100, -100);
        visualContext.beginPath();

        /*
        helicopter.update(elapsedTime, controls.getGamepadSample());
        lfo.frequency.value = helicopter.rotorSpeed; // or whatever...
        helicopter.drawSelf(visualContext);
        */

        visualContext.moveTo(-2, -2);
        visualContext.lineTo(2, -2);
        visualContext.lineTo(2, 2);
        visualContext.lineTo(-2, 2);
        visualContext.lineTo(-2, -2);

        visualContext.restore();
        visualContext.stroke();

        clock.update(stepsize);
      }
    });
  }
}
