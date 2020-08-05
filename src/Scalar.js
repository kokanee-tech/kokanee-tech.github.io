export default class Scalar {
  static lerp(f1, f2, t) {
    return (1 - t) * f1 + t * f2;
  }

  static tent(t) {
    return 2 * Math.min(t, 1 - t);
  }

  static integrate(state, rate, stepsize) {
    return state + rate * stepsize;
  }

  static lag(state, target, responsiveness, stepsize) {
    const k = responsiveness * stepsize;
    return (k * target + state) / (k + 1);
  }
}
