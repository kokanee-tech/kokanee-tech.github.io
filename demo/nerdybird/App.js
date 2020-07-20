import Simulation from "./Simulation.js";
import TextDisplay from "./TextDisplay.js";

const TITLE = `---=== NerdyBird ===---`;

const MESSAGE_GAMEPAD_NOT_DETECTED = `No active gamepad detected.
If you have one and it's paired, press buttons to wake it up.
Note this is still a work in progress. We use an Xbox One
wireless controller with Chrome version 83 and macOS 10.11.5.`;

const MESSAGE_CLICK_TO_START = `CLICK TO START
LEFT TRIGGER TO CLIMB
RIGHT JOYSTICK TO TRAVERSE`;

export default class App {
  constructor({ audioContext, controls, timer, uiElement, visualContext }) {
    this.deps = { audioContext, controls, timer, uiElement, visualContext };
  }

  async displayPrerequisites(textDisplay) {
    const { audioContext, controls, timer, uiElement } = this.deps;

    textDisplay.title = TITLE;
    await timer.sleep(1000);
    if (!controls.getGamepadSample()) {
      textDisplay.message = MESSAGE_GAMEPAD_NOT_DETECTED;
      do {
        await timer.sleep(500);
      } while (!controls.getGamepadSample());
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
    const textDisplay = new TextDisplay(this.deps);
    textDisplay.start();

    await this.displayPrerequisites(textDisplay);

    new Simulation(this.deps).start();
  }
}
