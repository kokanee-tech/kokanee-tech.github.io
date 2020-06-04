export default class Spec {
  constructor(description, callback) {
    this.description = description;
    this.callback = callback;
  }

  run(handler) {
    try {
      this.callback();
      handler.specPass(this.description);
    } catch (err) {
      handler.specFail(this.description, err.message);
    }
  }
}
