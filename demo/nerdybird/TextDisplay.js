export default class TextDisplay {
  constructor({
    context,
    fontFamily = "sans-serif",
    fontSize = "16px",
    lineStride = 20,
    topMargin = 80,
  }) {
    this.context = context;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.lineStride = lineStride;
    this.topMargin = topMargin;
    this.message = "";
  }

  start() {
    const context = this.context;

    context.timer.forEachAnimationFrame(() => {
      context.visual.font = `${this.fontSize} ${this.fontFamily}`;
      context.visual.textAlign = "center";

      const xCenter = context.visual.canvas.width / 2;
      this.message.split("\n").forEach((line, index) => {
        context.visual.fillText(
          line,
          xCenter,
          index * this.lineStride + this.topMargin
        );
      });
    });
  }
}
