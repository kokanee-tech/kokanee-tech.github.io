import Platform from "../../src/Platform.js";
import App from "./App.js";

const MAIN_CANVAS_ID = "main-canvas"; // by convention

new Platform(window).run(MAIN_CANVAS_ID, (dependencies) => {
  new App(dependencies).start();
});

/*
TODO: Consider a more general re-write of createGrainConvolver() that takes
a Promise<AudioBuffer> instead of a callback to allow an OfflineAudioContext
or the current frame-by-frame callback. Then, provide a fillBuffer() utilty
to adapt the latter into the Promise<AudioBuffer> as appropriate.
*/
