import Platform from "../../src/Platform.js";
import App from "./App.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention

new Platform(window).run(MAIN_CANVAS_ID, (dependencies) => {
  new App(dependencies).start();
});

/*
TODO:
 - a canvas-size-aware DrawingContext with efficient transforms (translate and scale) to manage stroke
 - remove the visualContext dependency from Clock and instead pass-in the DrawingContext as a parameter to indicate()
 - consider a better name for indicate()
*/
