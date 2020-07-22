export default class TextDisplay {
  constructor({ timer, visualContext }) {
    this.deps = { timer, visualContext };
    this.message = "";

    // Default settings
    this.settings = {
      fontFamily: "sans-serif",
      fontSize: "16px",
      lineStride: 20,
      topMargin: 80,
    };
  }

  loadSettings(settings) {
    this.settings = { ...settings };
    return this;
  }

  start() {
    const { timer, visualContext } = this.deps;
    const settings = this.settings;

    timer.forEachAnimationFrame(() => {
      visualContext.font = `${settings.fontSize} ${settings.fontFamily}`;
      visualContext.textAlign = "center";

      const xCenter = visualContext.canvas.width / 2;
      this.message.split("\n").forEach((line, index) => {
        visualContext.fillText(
          line,
          xCenter,
          index * settings.lineStride + settings.topMargin
        );
      });
    });
  }
}
