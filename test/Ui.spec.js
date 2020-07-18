import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Mock from "../src/specish/Mock.js";
import Ui from "../src/Ui.js";

describe("Ui", () => {
  describe("constructor", () => {
    it("should save the DOM element", () => {
      const domElement = {};
      expect(new Ui(domElement).domElement).toBe(domElement);
    });
  });

  describe("forUserClick", () => {
    let mockDomElement;

    beforeEach(() => {
      mockDomElement = {
        removeEventListener: Mock.fn().mockName("removeEventListener"),
      };
    });

    describe("without click event", () => {
      beforeEach(() => {
        mockDomElement.addEventListener = Mock.fn().mockName(
          "addEventListener"
        );

        new Ui(mockDomElement).forUserClick();
      });

      it("should invoke addEventListener once", () => {
        expect(mockDomElement.addEventListener).toHaveBeenCalledTimes(1);
      });

      it("should not invoke removeEventListener", () => {
        expect(mockDomElement.removeEventListener).not.toHaveBeenCalled();
      });
    });

    describe("with click event", () => {
      beforeEach(() => {
        mockDomElement.addEventListener = Mock.fn((type, listener) =>
          listener()
        ).mockName("addEventListener");

        new Ui(mockDomElement).forUserClick();
      });

      it("should invoke addEventListener once", () => {
        expect(mockDomElement.addEventListener).toHaveBeenCalledTimes(1);
      });

      it("should invoke removeEventListener once", () => {
        expect(mockDomElement.removeEventListener).toHaveBeenCalledTimes(1);
      });
    });
  });
});
