import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Mock from "../src/specish/Mock.js";
import UiElement from "../src/UiElement.js";

describe("UiElement", () => {
  describe("constructor", () => {
    it("should save the canvas element", () => {
      const canvasElement = {};
      expect(new UiElement(canvasElement).canvasElement).toBe(canvasElement);
    });

    it("should throw for a null element", () => {
      expect(() => new UiElement(null)).toThrowSomething();
    });
  });

  describe("autoSize", () => {
    const WINDOW_INNER_WIDTH = 7;
    const WINDOW_INNER_HEIGHT = 3;

    let mockCanvasElement;

    beforeEach(() => {
      mockCanvasElement = {};
      new UiElement(mockCanvasElement).autoSize({
        innerWidth: WINDOW_INNER_WIDTH,
        innerHeight: WINDOW_INNER_HEIGHT,
      });
    });

    it("should set canvas width to window inner width", () => {
      expect(mockCanvasElement.width).toBe(WINDOW_INNER_WIDTH);
    });

    it("should set canvas height to window inner height", () => {
      expect(mockCanvasElement.height).toBe(WINDOW_INNER_HEIGHT);
    });
  });

  describe("userClick", () => {
    let mockCanvasElement;

    beforeEach(() => {
      mockCanvasElement = {
        removeEventListener: Mock.fn().mockName("removeEventListener"),
        addEventListener: Mock.fn().mockName("addEventListener"),
      };
    });

    describe("without click event", () => {
      beforeEach(() => {
        new UiElement(mockCanvasElement).userClick();
      });

      it("should invoke addEventListener once", () => {
        expect(mockCanvasElement.addEventListener).toHaveBeenCalledTimes(1);
      });

      it("should not invoke removeEventListener", () => {
        expect(mockCanvasElement.removeEventListener).not.toHaveBeenCalled();
      });
    });

    describe("with click event", () => {
      beforeEach(() => {
        mockCanvasElement.addEventListener.mock.implementation = (
          type,
          listener
        ) => listener();

        new UiElement(mockCanvasElement).userClick();
      });

      it("should invoke addEventListener once", () => {
        expect(mockCanvasElement.addEventListener).toHaveBeenCalledTimes(1);
      });

      it("should invoke removeEventListener once", () => {
        expect(mockCanvasElement.removeEventListener).toHaveBeenCalledTimes(1);
      });
    });
  });
});
