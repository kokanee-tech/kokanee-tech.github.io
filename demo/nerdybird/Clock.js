export default class Clock {
  constructor({ visualContext }) {
    this.deps = { visualContext };
    this.time = 0;
  }

  indicate() {
    const { visualContext } = this.deps;
    const angle = (2 * Math.PI * this.time) / 60;

    visualContext.moveTo(0, 0);
    visualContext.lineTo(Math.sin(angle), -Math.cos(angle));
  }

  update(stepsize) {
    this.time += stepsize;
  }
}
