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

      // Suspend audio when page is hidden
      const audioContext = new this.mainWindow.AudioContext();
      this.mainWindow.document.addEventListener("visibilitychange", () => {
        if (this.mainWindow.document.hidden) {
          audioContext.suspend();
        } else {
          audioContext.resume();
        }
      });

      const dependencies = {
        audioContext,
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
