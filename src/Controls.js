export default class Controls {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;

    // This is a workaround for a bug in the gamepad drivers.
    this.mainWindow.document.addEventListener("visibilitychange", () => {
      if (this.mainWindow.document.hidden) {
        // Poll the gamepad to clear its cache due to a bug
        // in the device driver. Otherwise it won't contain
        // an up-to-date sample upon returning.
        this.mainWindow.navigator.getGamepads();
      }
    });
  }

  getGamepadSample() {
    const sample = this.mainWindow.navigator.getGamepads()[0];
    return sample || null;
  }
}
