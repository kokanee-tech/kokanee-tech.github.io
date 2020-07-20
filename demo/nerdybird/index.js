import Platform from "../../src/Platform.js";
import App from "./App.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention

new Platform(window).run(MAIN_CANVAS_ID, (dependencies) => {
  new App(dependencies).start();
});

//--------------
// TODO:
// - Controls, getGamepadSample(), spec
// - better name for displayPrerequisites (eg promptForReady?) or split
// - finish implementations of TextDisplay and Simulation
// - write spec for timer.sleep
// - finish spec for Platform
// - audio
//--------------
