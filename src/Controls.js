export default class Controls {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;

    // This is a workaround for a bug in the gamepad device drivers.
    this.mainWindow.document.addEventListener("visibilitychange", () => {
      if (this.mainWindow.document.hidden) {
        // When the page becomes hidden, poll the gamepad to clear
        // its cache. Otherwise when the page becomes visible, the
        // cache will contain a stale value due to a bug in the
        // device drivers / browser implementation.
        this.mainWindow.navigator.getGamepads();
      }
    });
  }

  getGamepadSample() {
    const sample = this.mainWindow.navigator.getGamepads()[0];
    return sample || null;
  }
}
