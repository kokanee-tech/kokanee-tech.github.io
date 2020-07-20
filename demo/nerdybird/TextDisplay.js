export default class TextDisplay {
  constructor({ timer, visualContext }) {
    this.deps = { timer, visualContext };
    this.message = "";
  }

  start() {
    const { timer, visualContext } = this.deps;

    // set font of visualContext

    timer.forEachAnimationFrame(() => {
      // draw this.message onto visualContext
      visualContext.fillText(this.message, 10, 50);
    });
  }
}
