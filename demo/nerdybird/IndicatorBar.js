export default class IndicatorBar {
  constructor({ context, gaugeSize = 10 }) {
    this.context = context;
    this.gaugeSize = gaugeSize;
  }

  drawGauge(index, callback) {
    const context = this.context;

    context.visual.save();
    context.visual.translate(
      context.visual.canvas.width - (index + 0.5) * this.gaugeSize,
      0.5 * this.gaugeSize
    );
    context.visual.scale(0.4 * this.gaugeSize, 0.4 * this.gaugeSize);
    callback(context.visual);
    context.visual.restore();
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
