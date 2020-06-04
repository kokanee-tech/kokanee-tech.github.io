import { describe, it, expect, beforeEach } from "../../src/specish/specish.js";
import Mock from "../../src/specish/Mock.js";
import Suite from "../../src/specish/Suite.js";

describe("Suite", () => {
  describe("constructor", () => {
    describe("specs", () => {
      it("should be empty initially", () => {
        expect(new Suite().specs.length).toBe(0);
      });
    });

    describe("innerSuites", () => {
      it("should be empty initially", () => {
        expect(new Suite().innerSuites.length).toBe(0);
      });
    });

    describe("preSpecs", () => {
      it("should be empty initially", () => {
        expect(new Suite().preSpecs.length).toBe(0);
      });
    });

    describe("postSpecs", () => {
      it("should be empty initially", () => {
        expect(new Suite().postSpecs.length).toBe(0);
      });
    });
  });

  describe("run", () => {
    const description = {};
    let mockHandler;
    let mockSpec;
    let mockInnerSuite;
    let mockPreSpec;
    let mockPostSpec;
    let rootSuite;

    beforeEach(() => {
      mockHandler = {
        suiteStart: Mock.fn().mockName("suiteStart"),
        suiteEnd: Mock.fn().mockName("suiteEnd"),
      };

      mockSpec = { run: Mock.fn().mockName("run") };
      mockInnerSuite = { run: Mock.fn().mockName("run") };
      mockPreSpec = Mock.fn().mockName("mockPreSpec");
      mockPostSpec = Mock.fn().mockName("mockPostSpec");

      rootSuite = new Suite(null, description);
      rootSuite.specs.push(mockSpec);
      rootSuite.innerSuites.push(mockInnerSuite);
      rootSuite.preSpecs.push(mockPreSpec);
      rootSuite.postSpecs.push(mockPostSpec);
      rootSuite.run(mockHandler);
    });

    it("should invoke suiteStart once with description", () => {
      expect(mockHandler.suiteStart).toHaveBeenCalledTimes(1);
      expect(mockHandler.suiteStart).toHaveBeenCalledWithShallow(description);
    });

    it("should invoke suiteEnd once with no arguments", () => {
      expect(mockHandler.suiteEnd).toHaveBeenCalledTimes(1);
      expect(mockHandler.suiteEnd).toHaveBeenCalledWithShallow();
    });

    it("should run the spec once with handler", () => {
      expect(mockSpec.run).toHaveBeenCalledTimes(1);
      expect(mockSpec.run).toHaveBeenCalledWithShallow(mockHandler);
    });

    it("should run the inner suite once with handler", () => {
      expect(mockInnerSuite.run).toHaveBeenCalledTimes(1);
      expect(mockInnerSuite.run).toHaveBeenCalledWithShallow(mockHandler);
    });

    it("should run the pre-spec once with no arguments", () => {
      expect(mockPreSpec).toHaveBeenCalledTimes(1);
      expect(mockPreSpec).toHaveBeenCalledWithShallow();
    });

    it("should run the post-spec once with no arguments", () => {
      expect(mockPostSpec).toHaveBeenCalledTimes(1);
      expect(mockPostSpec).toHaveBeenCalledWithShallow();
    });

    describe("for an inner suite", () => {
      let innerSuite;

      beforeEach(() => {
        mockPreSpec.mockClear();
        mockPostSpec.mockClear();

        innerSuite = new Suite(rootSuite);
        innerSuite.specs.push({ run: () => {} });
        innerSuite.run({ suiteStart: () => {}, suiteEnd: () => {} });
      });

      it("should run the pre-spec of the parent", () => {
        expect(mockPreSpec).toHaveBeenCalledTimes(1);
        expect(mockPreSpec).toHaveBeenCalledWithShallow();
      });

      it("should run the post-spec of the parent", () => {
        expect(mockPostSpec).toHaveBeenCalledTimes(1);
        expect(mockPostSpec).toHaveBeenCalledWithShallow();
      });
    });
  });
});
