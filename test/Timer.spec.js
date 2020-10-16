import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Mock from "../src/specish/Mock.js";
import Timer from "../src/Timer.js";

describe("Timer", () => {
  describe("sleep", () => {
    let mockWindow;

    beforeEach(() => {
      mockWindow = {
        setTimeout: Mock.fn().mockName("setTimeout"),
      };

      const descriptor = {
        deps: {
          window: mockWindow,
        },
      };

      new Timer(descriptor).sleep();
    });

    it("should invoke setTimeout once", () => {
      expect(mockWindow.setTimeout).toHaveBeenCalledTimes(1);
    });
  });

  describe("forEachAnimationFrame", () => {
    // Fake times (in seconds)
    const TIME_NOW = 3;
    const TIME_FRAME_EVENT = 7;

    // Simple timestamp (in milliseconds)
    const getTimestamp = (time) => time * 1000;

    let mockWindow;
    let descriptor;
    let mockCallback;

    beforeEach(() => {
      mockWindow = {
        performance: {
          now: Mock.fn(() => getTimestamp(TIME_NOW)).mockName(
            "performance.now"
          ),
        },
        requestAnimationFrame: Mock.fn().mockName("requestAnimationFrame"),
      };

      descriptor = {
        deps: {
          window: mockWindow,
        },
      };

      mockCallback = Mock.fn().mockName("callback");
    });

    describe("without frame event", () => {
      beforeEach(() => {
        new Timer(descriptor).forEachAnimationFrame(mockCallback);
      });

      it("should invoke performance.now once", () => {
        expect(mockWindow.performance.now).toHaveBeenCalledTimes(1);
      });

      it("should invoke requestAnimationFrame once", () => {
        expect(mockWindow.requestAnimationFrame).toHaveBeenCalledTimes(1);
      });

      it("should not invoke the callback", () => {
        expect(mockCallback).not.toHaveBeenCalled();
      });
    });

    describe("with frame event", () => {
      beforeEach(() => {
        mockWindow.requestAnimationFrame.mock.implementation = (onFrame) =>
          onFrame(getTimestamp(TIME_FRAME_EVENT));

        mockCallback.mock.implementation = () => {
          // Reset the mock rAF implementation to avoid an endless loop
          mockWindow.requestAnimationFrame.mock.implementation = () => {};
        };

        new Timer(descriptor).forEachAnimationFrame(mockCallback);
      });

      it("should invoke performance.now once", () => {
        expect(mockWindow.performance.now).toHaveBeenCalledTimes(1);
      });

      it("should invoke requestAnimationFrame twice", () => {
        expect(mockWindow.requestAnimationFrame).toHaveBeenCalledTimes(2);
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
