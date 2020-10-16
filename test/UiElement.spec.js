import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Mock from "../src/specish/Mock.js";
import UiElement from "../src/UiElement.js";

describe("UiElement", () => {
  describe("constructor", () => {
    it("should save the canvas element", () => {
      const descriptor = { canvasElement: {} };
      expect(new UiElement(descriptor).canvasElement).toBe(
        descriptor.canvasElement
      );
    });

    it("should throw for a null element", () => {
      expect(() => new UiElement({ canvasElement: null })).toThrowSomething();
    });
  });

  describe("autoSize", () => {
    const WINDOW_INNER_WIDTH = 7;
    const WINDOW_INNER_HEIGHT = 3;

    let descriptor;

    beforeEach(() => {
      descriptor = { canvasElement: {} };
      new UiElement(descriptor).autoSize({
        innerWidth: WINDOW_INNER_WIDTH,
        innerHeight: WINDOW_INNER_HEIGHT,
      });
    });

    it("should set canvas width to window inner width", () => {
      expect(descriptor.canvasElement.width).toBe(WINDOW_INNER_WIDTH);
    });

    it("should set canvas height to window inner height", () => {
      expect(descriptor.canvasElement.height).toBe(WINDOW_INNER_HEIGHT);
    });
  });

  describe("userClick", () => {
    let descriptor;

    beforeEach(() => {
      descriptor = {
        canvasElement: {
          removeEventListener: Mock.fn().mockName("removeEventListener"),
          addEventListener: Mock.fn().mockName("addEventListener"),
        },
      };
    });

    describe("without click event", () => {
      beforeEach(() => {
        new UiElement(descriptor).userClick();
      });

      it("should invoke addEventListener once", () => {
        expect(descriptor.canvasElement.addEventListener).toHaveBeenCalledTimes(
          1
        );
      });

      it("should not invoke removeEventListener", () => {
        expect(
          descriptor.canvasElement.removeEventListener
        ).not.toHaveBeenCalled();
      });
    });

    describe("with click event", () => {
      beforeEach(() => {
        descriptor.canvasElement.addEventListener.mock.implementation = (
          type,
          listener
        ) => listener();

        new UiElement(descriptor).userClick();
      });

      it("should invoke addEventListener once", () => {
        expect(descriptor.canvasElement.addEventListener).toHaveBeenCalledTimes(
          1
        );
      });

      it("should invoke removeEventListener once", () => {
        expect(
          descriptor.canvasElement.removeEventListener
        ).toHaveBeenCalledTimes(1);
      });
    });
  });
});
