import { describe, it, expect, beforeEach } from "../../src/specish/specish.js";
import Mock from "../../src/specish/Mock.js";

describe("Mock", () => {
  describe("constructor", () => {
    it("should save the implementation", () => {
      const implementation = () => {};
      expect(new Mock(implementation).implementation).toBe(implementation);
    });
  });

  describe("name", () => {
    it("should be null initially", () => {
      expect(new Mock().name).toBe(null);
    });
  });

  describe("calls", () => {
    it("should be empty initially", () => {
      expect(new Mock().calls.length).toBe(0);
    });
  });

  describe("results", () => {
    it("should be empty initially", () => {
      expect(new Mock().results.length).toBe(0);
    });
  });

  describe("fn", () => {
    describe("the mock function when called", () => {
      it("should return undefined when no mock implementation is specified", () => {
        const mockFunction = Mock.fn();
        expect(mockFunction()).toBe(undefined);
      });

      it("should not throw when no mock implementation is specified", () => {
        const mockFunction = Mock.fn();
        expect(() => mockFunction()).not.toThrowSomething();
      });

      it("should return the value that the mock implementation returns", () => {
        const returnValue = {};
        const mockFunction = Mock.fn(() => returnValue);
        expect(mockFunction()).toBe(returnValue);
      });

      it("should throw the value that the mock implementation throws", () => {
        const throwValue = {};
        const mockFunction = Mock.fn(() => {
          throw throwValue;
        });
        expect(() => mockFunction()).toThrowSomething();
        try {
          mockFunction();
        } catch (e) {
          expect(e).toBe(throwValue);
        }
      });
    });

    describe("the mock before the mock function returns", () => {
      let mockFunction;

      beforeEach(() => {
        mockFunction = Mock.fn();
      });

      it("should record the call", () => {
        const argumentValue = {};
        mockFunction.mock.implementation = () => {
          expect(mockFunction.mock.calls[0][0]).toBe(argumentValue);
        };
        mockFunction(argumentValue);
      });

      it("should record the result type as 'incomplete'", () => {
        mockFunction.mock.implementation = () => {
          expect(mockFunction.mock.results[0].type).toBe("incomplete");
        };
        mockFunction();
      });
    });

    describe("the mock after the mock function returns normally", () => {
      let mockFunction;
      const returnValue = {};

      beforeEach(() => {
        mockFunction = Mock.fn(() => returnValue);
      });

      it("should record the call", () => {
        const argumentValue = {};
        mockFunction(argumentValue);
        expect(mockFunction.mock.calls[0][0]).toBe(argumentValue);
      });

      it("should record the result type as 'return'", () => {
        mockFunction();
        expect(mockFunction.mock.results[0].type).toBe("return");
      });

      it("should record the result value", () => {
        mockFunction();
        expect(mockFunction.mock.results[0].value).toBe(returnValue);
      });
    });

    describe("the mock after the mock function throws", () => {
      let mockFunction;
      const throwValue = {};

      beforeEach(() => {
        mockFunction = Mock.fn(() => {
          throw throwValue;
        });
      });

      it("should record the call", () => {
        const argumentValue = {};
        try {
          mockFunction(argumentValue);
        } catch (e) {}
        expect(mockFunction.mock.calls[0][0]).toBe(argumentValue);
      });

      it("should record the result type as 'throw'", () => {
        try {
          mockFunction();
        } catch (e) {}
        expect(mockFunction.mock.results[0].type).toBe("throw");
      });

      it("should record the result value", () => {
        try {
          mockFunction();
        } catch (e) {}
        expect(mockFunction.mock.results[0].value).toBe(throwValue);
      });
    });

    describe("mockName", () => {
      it("should return the mock function", () => {
        const mockFunction = Mock.fn();
        expect(mockFunction.mockName("foo")).toBe(mockFunction);
      });
    });

    describe("mockClear", () => {
      it("should return the mock function", () => {
        const mockFunction = Mock.fn();
        expect(mockFunction.mockClear()).toBe(mockFunction);
      });

      it("should clear the calls array", () => {
        const mockFunction = Mock.fn();
        mockFunction();
        expect(mockFunction).toHaveBeenCalledTimes(1);
        mockFunction.mockClear();
        expect(mockFunction).not.toHaveBeenCalled();
      });

      it("should clear the results array", () => {
        const mockFunction = Mock.fn();
        mockFunction();
        expect(mockFunction.mock.results.length).toBe(1);
        mockFunction.mockClear();
        expect(mockFunction.mock.results.length).toBe(0);
      });
    });

    describe("toString", () => {
      it("should contain the mock name", () => {
        const name = "foo";
        const mockFunction = Mock.fn().mockName(name);
        expect(mockFunction.toString()).toContain(name);
      });
    });
  });
});
