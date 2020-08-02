export default class Simulation {
  constructor({ audioContext, controls, timer, visualContext }) {
    this.deps = { audioContext, controls, timer, visualContext };
    this.paused = false;
  }

  start() {
    const { audioContext, controls, timer, visualContext } = this.deps;

    // Simulation time
    let time = 0;

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

      // Indicate simulation time
      visualContext.save();
      visualContext.translate(canvasWidth - 10, 10);
      visualContext.scale(8, 8);
      visualContext.arc(0, 0, 1, 0, 2 * Math.PI);
      visualContext.rotate((2 * Math.PI * time) / 60);
      visualContext.moveTo(0, 0);
      visualContext.lineTo(0, -1);
      visualContext.restore();

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

        // Indicate throttle
        visualContext.save();
        visualContext.translate(canvasWidth - 30, 10);
        visualContext.scale(8, 8);
        visualContext.moveTo(0, -1);
        visualContext.lineTo(0, 1);
        visualContext.moveTo(-0.2, 2 * throttle - 1);
        visualContext.lineTo(0.2, 2 * throttle - 1);
        visualContext.restore();

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

      //
      // Render all paths after context has been restored
      //
      visualContext.stroke();
    });
  }
}
