import Platform from "../../src/Platform.js";
import App from "./App.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention

new Platform(window).run(MAIN_CANVAS_ID, (dependencies) => {
  new App(dependencies).start();
});

/*
 TODO
 - lerp, lag, and tent functions for scalars
 - pause simulation when page becomes not visible (eg add a new dependency that issues page visibility events?)
 - proper motor spool-up sound or perhaps a starting "stutter"
*/
