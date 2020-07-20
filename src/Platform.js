import Controls from "./Controls.js";
import Timer from "./Timer.js";
import UiElement from "./UiElement.js";

export default class Platform {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  run(canvasId, callback) {
    try {
      const timer = new Timer(this.mainWindow);
      const mainCanvas = this.mainWindow.document.getElementById(canvasId);
      const uiElement = new UiElement(mainCanvas);

      // Automatically resize the canvas
      timer.forEachAnimationFrame(() => uiElement.autoSize(this.mainWindow));

      const dependencies = {
        audioContext: new this.mainWindow.AudioContext(),
        controls: new Controls(this.mainWindow),
        timer,
        uiElement,
        visualContext: mainCanvas.getContext("2d"),
      };

      callback(dependencies);
    } catch (err) {
      this.mainWindow.console.error({ err }, "An unexpected error occurred");
      this.mainWindow.alert(`Unexpected error: ${err.message}`);
    }
  }
}
