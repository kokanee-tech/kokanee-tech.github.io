const TITLE = `---=== NerdyBird ===---`;

const MESSAGE_GAMEPAD_NOT_DETECTED = `No active gamepad detected.
If you have one and it's paired, press buttons to wake it up.
Note this is still a work in progress. We use an Xbox One
wireless controller with Chrome version 83 and macOS 10.11.5.`;

const MESSAGE_CLICK_TO_START = `CLICK TO START
LEFT TRIGGER TO CLIMB
RIGHT JOYSTICK TO TRAVERSE`;

export default class Simulation {
  constructor({ audioContext, gamepads, timer, uiElement, visualContext }) {
    this.deps = { audioContext, gamepads, timer, uiElement, visualContext };
  }

  async displayPrerequisites(textDisplay) {
    const { audioContext, gamepads, timer, uiElement } = this.deps;

    textDisplay.title = TITLE;
    await timer.sleep(1000);
    if (!gamepads[0]) {
      textDisplay.message = MESSAGE_GAMEPAD_NOT_DETECTED;
      do {
        await timer.sleep(500);
      } while (!gamepads[0]);
      textDisplay.message = "";
    }

    if (audioContext.state !== "running") {
      textDisplay.message = MESSAGE_CLICK_TO_START;
      await uiElement.userClick();
      textDisplay.message = "";
      await audioContext.resume();
    }

    textDisplay.title = "";
  }

  async start() {
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

      visualContext.strokeRect(-1, -1, 2, 2);

      visualContext.restore();
      visualContext.stroke();
    });
  }
}
