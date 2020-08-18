export default class IndicatorBar {
  constructor({ visualContext }) {
    this.deps = { visualContext };

    this.settings = {
      gaugeSize: 10,
    };
  }

  loadSettings(settings) {
    Object.assign(this.settings, settings);
    return this;
  }

  drawGauge(index, callback) {
    const { visualContext } = this.deps;
    const { gaugeSize } = this.settings;

    visualContext.save();
    visualContext.translate(
      visualContext.canvas.width - (index + 0.5) * gaugeSize,
      0.5 * gaugeSize
    );
    visualContext.scale(0.4 * gaugeSize, 0.4 * gaugeSize);
    callback(visualContext);
    visualContext.restore();
  }

  drawAngularGauge(index, angle) {
    this.drawGauge(index, (visualContext) => {
      visualContext.arc(0, 0, 1, 0, 2 * Math.PI);
      visualContext.rotate(angle);
      visualContext.moveTo(0, 0);
      visualContext.lineTo(0, -1);
    });
  }

  drawLinearGauge(index, value) {
    this.drawGauge(index, (visualContext) => {
      visualContext.moveTo(0, 1);
      visualContext.lineTo(0, -1);
      visualContext.moveTo(-0.2, 1 - 2 * value);
      visualContext.lineTo(0.2, 1 - 2 * value);
    });
  }
}
