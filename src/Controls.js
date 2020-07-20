export default class Controls {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  getGamepadSample() {
    const sample = this.mainWindow.navigator.getGamepads()[0];
    return sample || null;
  }
}
