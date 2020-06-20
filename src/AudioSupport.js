export default class AudioSupport {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  async audioReady(domElement, eventType) {
    if (this.audioContext.state !== "running") {
      return new Promise((resolve) => {
        const onUserGesture = async () => {
          domElement.removeEventListener(eventType, onUserGesture);
          await this.audioContext.resume();
          resolve();
        };
        domElement.addEventListener(eventType, onUserGesture);
      });
    }
  }
}
