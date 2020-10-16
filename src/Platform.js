import Controls from "./Controls.js";
import Timer from "./Timer.js";
import UiElement from "./UiElement.js";

export default class Platform {
  constructor({
    deps = {
      Controls,
      Timer,
      UiElement,
      window: globalThis,
    },
  } = {}) {
    this.deps = deps;
    this.window = deps.window;
    this.document = deps.window.document;
  }

  run(canvasId, callback) {
    try {
      const timer = new this.deps.Timer();
      const canvasElement = this.document.getElementById(canvasId);
      const uiElement = new this.deps.UiElement({ canvasElement });

      // Automatically resize the canvas
      timer.forEachAnimationFrame(() => uiElement.autoSize(this.window));

      // Suspend audio when page is hidden
      const audio = new this.window.AudioContext();
      this.document.addEventListener("visibilitychange", () => {
        if (this.document.hidden) {
          audio.suspend();
        } else {
          audio.resume();
        }
      });

      const context = {
        audio,
        controls: new this.deps.Controls(),
        timer,
        uiElement,
        visual: canvasElement.getContext("2d"),
      };

      callback(context);
    } catch (err) {
      this.window.console.error({ err }, "An unexpected error occurred");
      this.window.alert(`Unexpected error: ${err.message}`);
    }
  }
}
