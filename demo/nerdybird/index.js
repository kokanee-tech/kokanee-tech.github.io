import Platform from "../../src/Platform.js";
import TextDisplay from "./TextDisplay.js";
import Simulation from "./Simulation.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention

new Platform(window).run(MAIN_CANVAS_ID, async (dependencies) => {
  const textDisplay = new TextDisplay(dependencies);
  textDisplay.start();

  const simulation = new Simulation(dependencies);
  await simulation.displayPrerequisites(textDisplay);
  simulation.start();
});

//--------------
// TODO:
// - gamepads becomes stale and thus we get stuck in the endless loop
// - better name for displayPrerequisites: promptForReady, ?
// - finish implementations of TextDisplay and Simulation
// - write spec for timer.sleep
// - finish spec for Platform
// - audio
//--------------
