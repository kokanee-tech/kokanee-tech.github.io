import Platform from "../../src/Platform.js";
import App from "./App.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention

new Platform(window).run(MAIN_CANVAS_ID, (dependencies) => {
  new App(dependencies).start();
});

//--------------
// TODO:
// - write spec for controls.getGamepadSample()
// - finish implementations of TextDisplay and Simulation
// - write spec for timer.sleep
// - finish spec for Platform
// - audio
//--------------
