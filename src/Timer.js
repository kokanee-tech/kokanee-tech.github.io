export default class Timer {
  constructor({ deps = { window: globalThis } } = {}) {
    this.window = deps.window;
  }

  sleep(millis) {
    return new Promise((resolve) => {
      this.window.setTimeout(resolve, millis);
    });
  }

  forEachAnimationFrame(callback) {
    let previousTimestamp;
    const onFrame = (timestamp) => {
      const elapsedTime = (timestamp - previousTimestamp) / 1000;
      previousTimestamp = timestamp;

      callback(elapsedTime);

      this.window.requestAnimationFrame(onFrame);
    };

    previousTimestamp = this.window.performance.now();
    this.window.requestAnimationFrame(onFrame);
  }
}
