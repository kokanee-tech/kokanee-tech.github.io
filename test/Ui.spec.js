import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Mock from "../src/specish/Mock.js";
import Ui from "../src/Ui.js";

describe("Ui", () => {
  describe("constructor", () => {
    it("should save the canvas element", () => {
      const canvasElement = {};
      expect(new Ui(canvasElement).canvasElement).toBe(canvasElement);
    });
  });

  describe("autoSize", () => {
    const WINDOW_INNER_WIDTH = 7;
    const WINDOW_INNER_HEIGHT = 3;

    let mockCanvasElement;

    beforeEach(() => {
      mockCanvasElement = {};
      new Ui(mockCanvasElement).autoSize({
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

  describe("forUserClick", () => {
    let mockCanvasElement;

    beforeEach(() => {
      mockCanvasElement = {
        removeEventListener: Mock.fn().mockName("removeEventListener"),
      };
    });

    describe("without click event", () => {
      beforeEach(() => {
        mockCanvasElement.addEventListener = Mock.fn().mockName(
          "addEventListener"
        );

        new Ui(mockCanvasElement).forUserClick();
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
        mockCanvasElement.addEventListener = Mock.fn((type, listener) =>
          listener()
        ).mockName("addEventListener");

        new Ui(mockCanvasElement).forUserClick();
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
