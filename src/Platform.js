import Timer from "./Timer.js";
import Ui from "./Ui.js";

export default class Platform {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  run(canvasId, callback) {
    try {
      const timer = new Timer(this.mainWindow);
      const mainCanvas = this.mainWindow.document.getElementById(canvasId);
      const ui = new Ui(mainCanvas);
      const visualContext = mainCanvas.getContext("2d");

      // Automatically resize the canvas
      timer.forEachAnimationFrame(() => ui.autoSize(this.mainWindow));

      const dependencies = {
        audioContext: new this.mainWindow.AudioContext(),
        gamepads: this.mainWindow.navigator.getGamepads(),
        timer,
        ui,
        visualContext,
      };

      callback(dependencies);
    } catch (err) {
      this.mainWindow.console.error({ err }, "An unexpected error occurred");
      this.mainWindow.alert(`Unexpected error: ${err.message}`);
    }
  }
}
