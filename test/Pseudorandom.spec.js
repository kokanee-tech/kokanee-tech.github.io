import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Pseudorandom from "../src/Pseudorandom.js";

describe("Pseudorandom", () => {
  let pseudorandom;

  beforeEach(() => {
    pseudorandom = new Pseudorandom();
  });

  describe("constructor", () => {
    it("should set a valid initial seed", () => {
      expect(() =>
        pseudorandom.setSeed(pseudorandom.seed)
      ).not.toThrowSomething();
    });
  });

  describe("setSeed", () => {
    it("should throw for a non-integer input", () => {
      expect(() => pseudorandom.setSeed(3.14)).toThrowSomething();
    });

    it("should throw for an integer input less than 1", () => {
      expect(() => pseudorandom.setSeed(0)).toThrowSomething();
    });

    it("should not throw for an input of 1", () => {
      expect(() => pseudorandom.setSeed(1)).not.toThrowSomething();
    });

    it("should throw for an integer input greater than 2147483646", () => {
      expect(() => pseudorandom.setSeed(2147483647)).toThrowSomething();
    });

    it("should not throw for an input of 2147483646", () => {
      expect(() => pseudorandom.setSeed(2147483646)).not.toThrowSomething();
    });
  });

  describe("next", () => {
    it("should always return an integer greater than 0 and less than 2147483647", () => {
      const NUM_ITERATIONS = 1000; // chosen small to be fast rather than rigorous
      for (let i = 0; i < NUM_ITERATIONS; i++) {
        const underTest = pseudorandom.next();
        expect(() => pseudorandom.setSeed(underTest)).not.toThrowSomething();
      }
    });
  });

  describe("nextScalar", () => {
    it("should always return a scalar value greater than or equal to 0 and less than 1", () => {
      const NUM_ITERATIONS = 1000; // chosen small to be fast rather than rigorous
      for (let i = 0; i < NUM_ITERATIONS; i++) {
        const underTest = pseudorandom.nextScalar();
        expect(Number.isFinite(underTest)).toBe(true);
        expect(underTest >= 0).toBe(true);
        expect(underTest < 1).toBe(true);
      }
    });
  });
});
