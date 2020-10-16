import Platform from "../../src/Platform.js";
import App from "./App.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention

new Platform().run(MAIN_CANVAS_ID, (context) => {
  new App({ context }).start();
});
