import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Pseudorandom from "../src/Pseudorandom.js";

describe("Pseudorandom", () => {
  let pseudorandom1;
  let pseudorandom2;

  beforeEach(() => {
    pseudorandom1 = new Pseudorandom();
    pseudorandom2 = new Pseudorandom();
  });

  describe("constructor", () => {
    it("should set a valid initial seed", () => {
      expect(() =>
        pseudorandom1.setSeed(pseudorandom1.seed)
      ).not.toThrowSomething();
    });

    it("should set the same initial seed every time", () => {
      expect(pseudorandom1.seed).toBe(pseudorandom2.seed);
    });
  });

  describe("setSeed", () => {
    it("should throw for a non-integer input", () => {
      expect(() => pseudorandom1.setSeed(3.14)).toThrowSomething();
    });

    it("should throw for an integer input less than 1", () => {
      expect(() => pseudorandom1.setSeed(0)).toThrowSomething();
    });

    it("should not throw for an input of 1", () => {
      expect(() => pseudorandom1.setSeed(1)).not.toThrowSomething();
    });

    it("should throw for an integer input greater than 2147483646", () => {
      expect(() => pseudorandom1.setSeed(2147483647)).toThrowSomething();
    });

    it("should not throw for an input of 2147483646", () => {
      expect(() => pseudorandom1.setSeed(2147483646)).not.toThrowSomething();
    });
  });

  describe("next", () => {
    it("should always return an integer greater than 0 and less than 2147483647", () => {
      const NUM_ITERATIONS = 1000; // chosen small to be fast rather than rigorous
      for (let i = 0; i < NUM_ITERATIONS; i++) {
        const underTest = pseudorandom1.next();
        expect(() => pseudorandom1.setSeed(underTest)).not.toThrowSomething();
      }
    });

    it("should return the same sequence given the same initial seed", () => {
      const initialSeed = 1234;
      pseudorandom1.setSeed(initialSeed);
      pseudorandom2.setSeed(initialSeed);

      const NUM_ITERATIONS = 1000; // chosen small to be fast rather than rigorous
      for (let i = 0; i < NUM_ITERATIONS; i++) {
        expect(pseudorandom1.next()).toBe(pseudorandom2.next());
      }
    });
  });

  describe("nextScalar", () => {
    it("should always return a scalar value greater than or equal to 0 and less than 1", () => {
      const NUM_ITERATIONS = 1000; // chosen small to be fast rather than rigorous
      for (let i = 0; i < NUM_ITERATIONS; i++) {
        const underTest = pseudorandom1.nextScalar();
        expect(Number.isFinite(underTest)).toBe(true);
        expect(underTest >= 0).toBe(true);
        expect(underTest < 1).toBe(true);
      }
    });

    it("should return the same sequence given the same initial seed", () => {
      const initialSeed = 4321;
      pseudorandom1.setSeed(initialSeed);
      pseudorandom2.setSeed(initialSeed);

      const NUM_ITERATIONS = 1000; // chosen small to be fast rather than rigorous
      for (let i = 0; i < NUM_ITERATIONS; i++) {
        expect(pseudorandom1.nextScalar()).toBe(pseudorandom2.nextScalar());
      }
    });
  });
});
