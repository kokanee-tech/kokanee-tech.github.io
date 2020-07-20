import Platform from "../../src/Platform.js";
import App from "./App.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention

new Platform(window).run(MAIN_CANVAS_ID, (dependencies) => {
  new App(dependencies).start();
});

//--------------
// TODO:
// - gamepads becomes stale and thus we get stuck in the endless loop
//   - consider using https://developer.mozilla.org/en-US/docs/Web/API/Window/ongamepadconnected
// - better name for displayPrerequisites (eg promptForReady?) or split
// - finish implementations of TextDisplay and Simulation
// - write spec for timer.sleep
// - finish spec for Platform
// - audio
//--------------
