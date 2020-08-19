import Simulation from "./Simulation.js";
import TextDisplay from "./TextDisplay.js";

const CLICK_TO_START = `CLICK TO START
LEFT TRIGGER TO CLIMB
RIGHT JOYSTICK TO TRAVERSE`;

const GAMEPAD_NOT_DETECTED = `No active gamepad detected.
If you have one and it's paired, press buttons to wake it up.

(Support may be very limited: Xbox One wireless controller,
Chrome version 83, and macOS 10.11.5 for example)`;

export default class App {
  constructor({ audioContext, controls, timer, uiElement, visualContext }) {
    this.deps = { audioContext, controls, timer, uiElement, visualContext };
  }

  async start() {
    const {
      audioContext,
      controls,
      timer,
      uiElement,
      visualContext,
    } = this.deps;

    //
    // First we set the drawing styles (colours)
    //
    timer.forEachAnimationFrame(() => {
      visualContext.strokeStyle = "white";
      visualContext.fillStyle = "white";
    });

    //
    // Now we can start the text display
    //
    const textDisplay = new TextDisplay(this.deps);
    textDisplay
      .loadSettings({
        fontFamily: "'Courier New', monospace",
        fontSize: "24px",
        lineStride: 30,
        topMargin: 120,
      })
      .start();

    //
    // Make sure that the audio context is running
    // (due to browser autoplay policies)
    //
    if (audioContext.state !== "running") {
      textDisplay.message = CLICK_TO_START;
      await uiElement.userClick();
      textDisplay.message = "";
      await audioContext.resume();
    }

    //
    // Gamepads (at least in Chrome) only support
    // polling
    //
    timer.forEachAnimationFrame(() => {
      textDisplay.message = controls.getGamepadSample()
        ? ""
        : GAMEPAD_NOT_DETECTED;
    });

    //
    // Finally we can start the simulation
    //
    const simulation = new Simulation(this.deps);
    await simulation.start();
  }
}
