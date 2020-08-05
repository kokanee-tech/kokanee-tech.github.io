import { describe, it, expect } from "../src/specish/specish.js";
import Scalar from "../src/Scalar.js";

describe("Scalar", () => {
  describe("lerp", () => {
    // Choose f2 to be numerically insignificant compared with f1
    // so that the second endpoint test fails for an implementation
    // that tries to use only one multiplication operation.
    const f1 = 1 / Number.EPSILON;
    const f2 = 0.25;

    it("should return first endpoint for t=0", () => {
      expect(Scalar.lerp(f1, f2, 0)).toBe(f1);
    });

    it("should return second endpoint for t=1", () => {
      expect(Scalar.lerp(f1, f2, 1)).toBe(f2);
    });
  });

  describe("tent", () => {
    it("should return 0 for t=0", () => {
      expect(Scalar.tent(0)).toBe(0);
    });

    it("should return 0 for t=1", () => {
      expect(Scalar.tent(1)).toBe(0);
    });

    it("should return 1 for t=0.5", () => {
      expect(Scalar.tent(0.5)).toBe(1);
    });
  });

  describe("integrate", () => {
    const state = 3.14;
    const rate = 100;
    const stepsize = 0.05;

    it("should return next state", () => {
      expect(Scalar.integrate(0, rate, stepsize)).toBe(rate * stepsize);
    });

    it("should return current state for zero rate", () => {
      expect(Scalar.integrate(state, 0, stepsize)).toBe(state);
    });

    it("should return current state for zero stepsize", () => {
      expect(Scalar.integrate(state, rate, 0)).toBe(state);
    });
  });

  describe("lag", () => {
    const state = 0.5;
    const target = 0.6;
    const responsiveness = 4;
    const stepsize = 4;

    it("should return current state for zero responsiveness", () => {
      expect(Scalar.lag(state, target, 0, stepsize)).toBe(state);
    });

    it("should return target for arbitrarily large responsiveness", () => {
      expect(Scalar.lag(state, target, 1 / Number.EPSILON, stepsize)).toBe(
        target
      );
    });

    it("should return current state for zero stepsize", () => {
      expect(Scalar.lag(state, target, responsiveness, 0)).toBe(state);
    });

    it("should return target for arbitrarily large stepsize", () => {
      expect(
        Scalar.lag(state, target, responsiveness, 1 / Number.EPSILON)
      ).toBe(target);
    });
  });
});
