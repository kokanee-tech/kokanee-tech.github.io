import Platform from "../../src/Platform.js";
import TextDisplay from "./TextDisplay.js";
import Simulation from "./Simulation.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention

new Platform(window).run(MAIN_CANVAS_ID, (dependencies) => {
  const textDisplay = new TextDisplay(dependencies);
  textDisplay.start();

  const simulation = new Simulation(dependencies);
  simulation.displayPrerequisites(textDisplay);
  simulation.start();
});

//--------------
// TODO:
// - start implementations of TextDisplay and Simulation
// - finish spec for Platform
// - audio
//--------------
