const MODULUS = 2147483647;
const MULTIPLIER = 48271;

/**
 * Park-Miller PRNG with the multiplier value that was suggested more recently.
 */
export default class Pseudorandom {
  constructor() {
    this.seed = 1;
  }

  /**
   * Sets the seed for the PRNG. Throws an error for invalid input.
   *
   * @param {Number} seed an integer greater than 0 and less than 2147483647
   */
  setSeed(seed) {
    const isValidSeed = Number.isInteger(seed) && seed > 0 && seed < MODULUS;
    if (!isValidSeed) {
      throw new Error(
        `Seed must be an integer greater than 0 and less than ${MODULUS}.`
      );
    }

    this.seed = seed;
  }

  /**
   * Returns the next pseudorandom integer greater than 0 and less than 2147483647
   * assuming a valid seed to begin with.
   */
  next() {
    this.seed = (MULTIPLIER * this.seed) % MODULUS;
    return this.seed;
  }

  /**
   * Returns a scalar value greater than or equal to 0 and less than 1
   * assuming a valid seed to begin with.
   */
  nextScalar() {
    return (this.next() - 1) / (MODULUS - 1);
  }
}
