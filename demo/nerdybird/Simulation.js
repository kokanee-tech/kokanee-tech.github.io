export default class Simulation {
  constructor({ audioContext, gamepads, timer, visualContext }) {
    this.deps = { audioContext, gamepads, timer, visualContext };
  }

  start() {
    const { audioContext, gamepads, timer, visualContext } = this.deps;

    /*
    const lfo = audioContext.createOscillator();
    //...more audio graph setup...
    helicopterOutputNode.connect(audioContext.destination);
    lfo.start();
    */

    timer.forEachAnimationFrame((elapsedTime) => {
      const w = visualContext.canvas.width;
      const h = visualContext.canvas.height;
      visualContext.save();
      visualContext.translate(w / 2, h / 2);
      visualContext.scale(100, -100);
      visualContext.beginPath();

      /*
      helicopter.update(elapsedTime, gamepads[0]);
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
    });
  }
}
