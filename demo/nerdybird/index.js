import Platform from "../../src/Platform.js";
import App from "./App.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention

new Platform(window).run(MAIN_CANVAS_ID, (dependencies) => {
  new App(dependencies).start();
});

/*
 TODO
 - Scalar spec tests
 - pause simulation when page becomes not visible (eg add a new dependency that issues page visibility events?)
*/
