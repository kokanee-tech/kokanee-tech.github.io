import { describe, it, expect, beforeEach } from "../../src/specish/specish.js";
import Mock from "../../src/specish/Mock.js";
import Spec from "../../src/specish/Spec.js";

describe("Spec", () => {
  describe("run", () => {
    let mockHandler;

    beforeEach(() => {
      mockHandler = {
        specPass: Mock.fn().mockName("specPass"),
        specFail: Mock.fn().mockName("specFail"),
      };
    });

    it("should invoke the callback once", () => {
      const mockCallback = Mock.fn().mockName("mockCallback");
      const spec = new Spec({}, mockCallback);

      spec.run(mockHandler);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWithShallow();
    });

    it("should invoke specPass once for a callback that returns normally", () => {
      const description = {};
      const spec = new Spec(description, () => {});

      spec.run(mockHandler);

      expect(mockHandler.specPass).toHaveBeenCalledTimes(1);
      expect(mockHandler.specPass).toHaveBeenCalledWithShallow(description);
    });

    it("should invoke specFail once for a callback that throws", () => {
      const description = {};
      const message = {};
      const spec = new Spec(description, () => {
        throw { message };
      });

      spec.run(mockHandler);

      expect(mockHandler.specFail).toHaveBeenCalledTimes(1);
      expect(mockHandler.specFail).toHaveBeenCalledWithShallow(
        description,
        message
      );
    });
  });
});
