export default class TextDisplay {
  constructor({ timer, visualContext }) {
    this.deps = { timer, visualContext };
    this.title = "";
    this.message = "";
  }

  start() {
    const { timer, visualContext } = this.deps;

    // set font of visualContext

    timer.forEachAnimationFrame(() => {
      // draw this.title and this.message onto visualContext
    });
  }
}
