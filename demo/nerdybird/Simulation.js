export default class Simulation {
  constructor({ audioContext, controls, timer, visualContext }) {
    this.deps = { audioContext, controls, timer, visualContext };
    this.paused = false;
  }

  start() {
    const { audioContext, controls, timer, visualContext } = this.deps;

    /*
    const lfo = audioContext.createOscillator();
    //...more audio graph setup...
    helicopterOutputNode.connect(audioContext.destination);
    lfo.start();
    */

    timer.forEachAnimationFrame((elapsedTime) => {
      // TODO: remember to mute while paused
      //...

      if (!this.paused) {
        const w = visualContext.canvas.width;
        const h = visualContext.canvas.height;
        visualContext.save();
        visualContext.translate(w / 2, h / 2);
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
      }
    });
  }
}
