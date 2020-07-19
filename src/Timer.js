export default class Timer {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  sleep(millis) {
    return new Promise((resolve) => {
      this.mainWindow.setTimeout(resolve, millis);
    });
  }

  forEachAnimationFrame(callback) {
    let previousTimestamp;
    const onFrame = (timestamp) => {
      const elapsedTime = (timestamp - previousTimestamp) / 1000;
      previousTimestamp = timestamp;

      callback(elapsedTime);

      this.mainWindow.requestAnimationFrame(onFrame);
    };

    previousTimestamp = this.mainWindow.performance.now();
    this.mainWindow.requestAnimationFrame(onFrame);
  }
}
