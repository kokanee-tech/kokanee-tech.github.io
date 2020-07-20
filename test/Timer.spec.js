import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Mock from "../src/specish/Mock.js";
import Timer from "../src/Timer.js";

describe("Timer", () => {
  describe("constructor", () => {
    it("should save the main window", () => {
      const mainWindow = {};
      expect(new Timer(mainWindow).mainWindow).toBe(mainWindow);
    });
  });

  describe("sleep", () => {
    let mockMainWindow;

    beforeEach(() => {
      mockMainWindow = {
        setTimeout: Mock.fn().mockName("setTimeout"),
      };

      new Timer(mockMainWindow).sleep();
    });

    it("should invoke setTimeout once", () => {
      expect(mockMainWindow.setTimeout).toHaveBeenCalledTimes(1);
    });
  });

  describe("forEachAnimationFrame", () => {
    // Fake times (in seconds)
    const TIME_NOW = 3;
    const TIME_FRAME_EVENT = 7;

    // Simple timestamp (in milliseconds)
    const getTimestamp = (time) => time * 1000;

    let mockMainWindow;

    beforeEach(() => {
      mockMainWindow = {
        performance: {
          now: Mock.fn(() => getTimestamp(TIME_NOW)).mockName(
            "performance.now"
          ),
        },
      };
    });

    describe("without frame event", () => {
      let mockCallback;

      beforeEach(() => {
        mockMainWindow.requestAnimationFrame = Mock.fn().mockName(
          "requestAnimationFrame"
        );

        mockCallback = Mock.fn().mockName("callback");

        new Timer(mockMainWindow).forEachAnimationFrame(mockCallback);
      });

      it("should invoke performance.now once", () => {
        expect(mockMainWindow.performance.now).toHaveBeenCalledTimes(1);
      });

      it("should invoke requestAnimationFrame once", () => {
        expect(mockMainWindow.requestAnimationFrame).toHaveBeenCalledTimes(1);
      });

      it("should not invoke the callback", () => {
        expect(mockCallback).not.toHaveBeenCalled();
      });
    });

    describe("with frame event", () => {
      let mockCallback;

      beforeEach(() => {
        mockMainWindow.requestAnimationFrame = Mock.fn((onFrame) =>
          onFrame(getTimestamp(TIME_FRAME_EVENT))
        ).mockName("requestAnimationFrame");

        mockCallback = Mock.fn(() => {
          // Clear the mock rAF implementation to avoid an endless loop
          mockMainWindow.requestAnimationFrame.mock.implementation = () => {};
        }).mockName("callback");

        new Timer(mockMainWindow).forEachAnimationFrame(mockCallback);
      });

      it("should invoke performance.now once", () => {
        expect(mockMainWindow.performance.now).toHaveBeenCalledTimes(1);
      });

      it("should invoke requestAnimationFrame twice", () => {
        expect(mockMainWindow.requestAnimationFrame).toHaveBeenCalledTimes(2);
      });

      it("should invoke the callback once with the elapsed time", () => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWithShallow(
          TIME_FRAME_EVENT - TIME_NOW
        );
      });
    });
  });
});
