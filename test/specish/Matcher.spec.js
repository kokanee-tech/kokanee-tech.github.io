import { describe, it, expect, beforeEach } from "../../src/specish/specish.js";
import Mock from "../../src/specish/Mock.js";
import Matcher from "../../src/specish/Matcher.js";

describe("Matcher", () => {
  describe("constructor", () => {
    it("should not throw for a positive match", () => {
      expect(() => new Matcher(true).toBe(true)).not.toThrowSomething();
    });

    it("should throw for a positive mismatch", () => {
      expect(() => new Matcher(undefined).toBeDefined()).toThrowSomething();
    });
  });

  describe("not", () => {
    it("should not throw for a negative mismatch", () => {
      expect(() =>
        new Matcher(undefined).not.toBeDefined()
      ).not.toThrowSomething();
    });

    it("should throw for a negative match", () => {
      expect(() => new Matcher(true).not.toBe(true)).toThrowSomething();
    });
  });

  describe("toBe", () => {
    it("should not throw for a matching boolean", () => {
      expect(() => new Matcher(true).toBe(true)).not.toThrowSomething();
    });

    it("should throw for a non-matching boolean", () => {
      expect(() => new Matcher(true).toBe(false)).toThrowSomething();
    });

    it("should not throw for a matching number", () => {
      expect(() => new Matcher(7).toBe(7)).not.toThrowSomething();
    });

    it("should throw for a non-matching number", () => {
      expect(() => new Matcher(7).toBe(13)).toThrowSomething();
    });

    it("should not throw for a matching string", () => {
      expect(() => new Matcher("foo").toBe("foo")).not.toThrowSomething();
    });

    it("should throw for a non-matching string", () => {
      expect(() => new Matcher("foo").toBe("bar")).toThrowSomething();
    });

    it("should not throw for a matching reference", () => {
      const obj = {};
      expect(() =>
        new Matcher(undefined).toBe(undefined)
      ).not.toThrowSomething();
      expect(() => new Matcher(null).toBe(null)).not.toThrowSomething();
      expect(() => new Matcher(obj).toBe(obj)).not.toThrowSomething();
    });

    it("should throw for a non-matching reference", () => {
      const obj = {};
      expect(() => new Matcher(undefined).toBe(null)).toThrowSomething();
      expect(() => new Matcher(null).toBe(obj)).toThrowSomething();
      expect(() => new Matcher(obj).toBe({})).toThrowSomething();
    });
  });

  describe("toBeDefined", () => {
    it("should not throw for matching comparisons", () => {
      expect(() => new Matcher(null).toBeDefined()).not.toThrowSomething();
      expect(() => new Matcher(true).toBeDefined()).not.toThrowSomething();
      expect(() => new Matcher(7).toBeDefined()).not.toThrowSomething();
      expect(() => new Matcher("foo").toBeDefined()).not.toThrowSomething();
    });

    it("should throw for non-matching comparisons", () => {
      expect(() => new Matcher(undefined).toBeDefined()).toThrowSomething();
    });
  });

  describe("toContain", () => {
    it("should not throw for a matching string", () => {
      expect(() =>
        new Matcher("this is a test").toContain("is")
      ).not.toThrowSomething();
    });

    it("should throw for a non-matching string", () => {
      expect(() =>
        new Matcher("this is a test").toContain("foo")
      ).toThrowSomething();
    });

    it("should not throw for a matching array", () => {
      expect(() => new Matcher([7, 13]).toContain(13)).not.toThrowSomething();
    });

    it("should throw for a non-matching array", () => {
      expect(() => new Matcher([1, 2, 3]).toContain(0)).toThrowSomething();
    });
  });

  describe("toThrowSomething", () => {
    it("should not throw for an expected throw", () => {
      expect(() =>
        new Matcher(() => {
          throw "foo";
        }).toThrowSomething()
      ).not.toThrowSomething();
    });

    it("should throw for an unexpected normal return", () => {
      expect(() => new Matcher(() => {}).toThrowSomething()).toThrowSomething();
    });
  });

  describe("toHaveBeenCalled", () => {
    it("should not throw for a mock function that was called and returned normally", () => {
      const mockFunction = Mock.fn().mockName("mockFunction");

      mockFunction();

      expect(() =>
        new Matcher(mockFunction).toHaveBeenCalled()
      ).not.toThrowSomething();
    });

    it("should not throw for a mock function that was called and threw", () => {
      const mockFunction = Mock.fn(() => {
        throw "foo";
      }).mockName("mockFunction");

      try {
        mockFunction();
      } catch (e) {}

      expect(() =>
        new Matcher(mockFunction).toHaveBeenCalled()
      ).not.toThrowSomething();
    });

    it("should throw for a mock function that was not called", () => {
      const mockFunction = Mock.fn().mockName("mockFunction");

      expect(() =>
        new Matcher(mockFunction).toHaveBeenCalled()
      ).toThrowSomething();
    });
  });

  describe("toHaveBeenCalledTimes", () => {
    const callTimes = (f, n) => {
      for (let i = 0; i < n; i++) {
        f();
      }
    };

    let mockFunction;

    beforeEach(() => {
      mockFunction = Mock.fn().mockName("mockFunction");
    });

    it("should not throw for a mock function that was invoked the specified number of times", () => {
      const times = 7;
      callTimes(mockFunction, times);
      expect(() =>
        new Matcher(mockFunction).toHaveBeenCalledTimes(times)
      ).not.toThrowSomething();
    });

    it("should throw for a mock function that was not invoked the specified number of times", () => {
      const times = 7;
      callTimes(mockFunction, times + 13);
      expect(() =>
        new Matcher(mockFunction).toHaveBeenCalledTimes(times)
      ).toThrowSomething();
    });
  });

  describe("toHaveBeenCalledWithShallow", () => {
    let mockFunction;

    beforeEach(() => {
      mockFunction = Mock.fn().mockName("mockFunction");
    });

    it("should not throw for matching empty argument lists", () => {
      mockFunction();
      expect(() =>
        new Matcher(mockFunction).toHaveBeenCalledWithShallow()
      ).not.toThrowSomething();
    });

    it("should not throw for matching scalars", () => {
      const firstArg = 7;
      const secondArg = "foo";
      mockFunction(firstArg, secondArg);
      expect(() =>
        new Matcher(mockFunction).toHaveBeenCalledWithShallow(
          firstArg,
          secondArg
        )
      ).not.toThrowSomething();
    });

    it("should not throw for the same array reference", () => {
      const theArray = [];
      mockFunction(theArray);
      expect(() =>
        new Matcher(mockFunction).toHaveBeenCalledWithShallow(theArray)
      ).not.toThrowSomething();
    });

    it("should throw for only a partial argument match", () => {
      const firstArg = 7;
      const secondArg = "foo";
      mockFunction(firstArg);
      expect(() =>
        new Matcher(mockFunction).toHaveBeenCalledWithShallow()
      ).toThrowSomething();
      expect(() =>
        new Matcher(mockFunction).toHaveBeenCalledWithShallow(
          firstArg,
          secondArg
        )
      ).toThrowSomething();
    });

    it("should throw for the same arguments but in the wrong order", () => {
      const firstArg = 7;
      const secondArg = "foo";
      mockFunction(firstArg, secondArg);
      expect(() =>
        new Matcher(mockFunction).toHaveBeenCalledWithShallow(
          secondArg,
          firstArg
        )
      ).toThrowSomething();
    });

    it("should throw for distinct object references", () => {
      mockFunction({});
      expect(() =>
        new Matcher(mockFunction).toHaveBeenCalledWithShallow({})
      ).toThrowSomething();
    });
  });
});
