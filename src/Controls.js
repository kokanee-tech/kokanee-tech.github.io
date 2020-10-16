export default class Controls {
  constructor({ deps = { window: globalThis } } = {}) {
    this.document = deps.window.document;
    this.navigator = deps.window.navigator;

    // This is a workaround for a bug in the gamepad device drivers.
    this.document.addEventListener("visibilitychange", () => {
      if (this.document.hidden) {
        // When the page becomes hidden, poll the gamepad to clear
        // its cache. Otherwise when the page becomes visible, the
        // cache will contain a stale value due to a bug in the
        // device drivers / browser implementation.
        this.navigator.getGamepads();
      }
    });
  }

  getGamepadSample() {
    const sample = this.navigator.getGamepads()[0];
    return sample || null;
  }
}
