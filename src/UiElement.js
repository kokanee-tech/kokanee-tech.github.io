const EVENT_TYPE_CLICK = "click";

export default class UiElement {
  constructor(canvasElement) {
    this.canvasElement = canvasElement;
  }

  autoSize(mainWindow) {
    this.canvasElement.width = mainWindow.innerWidth;
    this.canvasElement.height = mainWindow.innerHeight;
  }

  async userClick() {
    return new Promise((resolve) => {
      const listener = () => {
        this.canvasElement.removeEventListener(EVENT_TYPE_CLICK, listener);
        resolve();
      };

      this.canvasElement.addEventListener(EVENT_TYPE_CLICK, listener);
    });
  }
}
