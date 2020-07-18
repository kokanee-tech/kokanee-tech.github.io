const EVENT_TYPE_CLICK = "click";

export default class Ui {
  constructor(domElement) {
    this.domElement = domElement;
  }

  async forUserClick() {
    return new Promise((resolve) => {
      const listener = () => {
        this.domElement.removeEventListener(EVENT_TYPE_CLICK, listener);
        resolve();
      };

      this.domElement.addEventListener(EVENT_TYPE_CLICK, listener);
    });
  }
}
