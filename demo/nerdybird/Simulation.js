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
    const clock = new Clock();

    /*
    const lfo = audioContext.createOscillator();
    //...more audio graph setup...
    helicopterOutputNode.connect(audioContext.destination);
    lfo.start();
    */

    timer.forEachAnimationFrame((elapsedTime) => {
      //
      // Use paths throughout for simple drawing
      //
      visualContext.beginPath();

      const canvasWidth = visualContext.canvas.width;
      const canvasHeight = visualContext.canvas.height;

      visualContext.save();
      visualContext.translate(canvasWidth - 12, 12);
      visualContext.scale(10, 10);
      clock.drawSelf(visualContext);
      visualContext.restore();

      visualContext.save();
      visualContext.translate(canvasWidth / 2, canvasHeight / 2);
      visualContext.scale(100, -100);
      //helicopter.drawSelf(visualContext);
      visualContext.restore();

      if (this.paused) {
        // TODO: mute audio
      } else {
        //lfo.frequency.value = helicopter.rotorSpeed; // or whatever...

        //
        // The brower generally suspends the animations for a tab while
        // the tab is in the background. Limit the integration stepsize
        // in case the animation has been suspended.
        //
        const MAX_STEPSIZE = 0.1;
        const stepsize = Math.min(elapsedTime, MAX_STEPSIZE);
        clock.update(stepsize);
        //helicopter.update(stepsize, controls.getGamepadSample());
      }

      //
      // Render all paths after context has been restored
      //
      visualContext.stroke();
    });
  }
}
