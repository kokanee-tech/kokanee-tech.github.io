import Simulation from "./Simulation.js";
import TextDisplay from "./TextDisplay.js";

const CLICK_TO_START = `CLICK TO START
LEFT TRIGGER TO CLIMB
RIGHT JOYSTICK TO TRAVERSE`;

const GAMEPAD_NOT_DETECTED = `No active gamepad detected.
If you have one and it's paired, press buttons to wake it up.
Note this is still a work in progress. We use an Xbox One
wireless controller with Chrome version 83 and macOS 10.11.5.`;

export default class App {
  constructor({ audioContext, controls, timer, uiElement, visualContext }) {
    this.deps = { audioContext, controls, timer, uiElement, visualContext };
  }

  async start() {
    const { audioContext, controls, timer, uiElement } = this.deps;

    const textDisplay = new TextDisplay(this.deps);
    textDisplay.start();

    if (audioContext.state !== "running") {
      textDisplay.message = CLICK_TO_START;
      await uiElement.userClick();
      textDisplay.message = "";
      await audioContext.resume();
    }

    const simulation = new Simulation(this.deps);

    timer.forEachAnimationFrame(() => {
      if (!controls.getGamepadSample()) {
        simulation.paused = true;
        textDisplay.message = GAMEPAD_NOT_DETECTED;
      } else {
        textDisplay.message = "";
        simulation.paused = false;
      }
    });

    simulation.start();
  }
}
