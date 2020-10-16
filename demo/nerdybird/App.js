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
  constructor({ deps = { Simulation, TextDisplay }, context }) {
    this.deps = deps;
    this.context = context;
  }

  async start() {
    const context = this.context;

    //
    // First we set the drawing styles (colours)
    //
    context.timer.forEachAnimationFrame(() => {
      context.visual.strokeStyle = "white";
      context.visual.fillStyle = "white";
    });

    //
    // Now we can start the text display
    //
    const textDisplay = new this.deps.TextDisplay({
      context,
      fontFamily: "'Courier New', monospace",
      fontSize: "24px",
      lineStride: 30,
      topMargin: 120,
    });
    textDisplay.start();

    //
    // Make sure that the audio context is running
    // (due to browser autoplay policies)
    //
    if (context.audio.state !== "running") {
      textDisplay.message = CLICK_TO_START;
      await context.uiElement.userClick();
      textDisplay.message = "";
      await context.audio.resume();
    }

    //
    // Gamepads (at least in Chrome) only support
    // polling
    //
    context.timer.forEachAnimationFrame(() => {
      textDisplay.message = context.controls.getGamepadSample()
        ? ""
        : GAMEPAD_NOT_DETECTED;
    });

    //
    // Finally we can start the simulation
    //
    const simulation = new this.deps.Simulation({ context });
    await simulation.start();
  }
}
