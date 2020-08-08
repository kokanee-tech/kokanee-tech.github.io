import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Mock from "../src/specish/Mock.js";
import Platform from "../src/Platform.js";

describe("Platform", () => {
  describe("constructor", () => {
    it("should save the main window", () => {
      const mainWindow = {};
      expect(new Platform(mainWindow).mainWindow).toBe(mainWindow);
    });
  });

  describe("run", () => {
    let mockMainWindow;

    beforeEach(() => {
      mockMainWindow = {
        alert: Mock.fn().mockName("alert"),
        AudioContext: function () {},
        console: {
          error: Mock.fn().mockName("console.error"),
        },
        document: {
          getElementById: Mock.fn().mockName("document.getElementById"),
          addEventListener: Mock.fn().mockName("addEventListener"),
        },
        performance: {
          now: () => {},
        },
        requestAnimationFrame: () => {},
      };
    });

    describe("with no element found matching the specified canvas ID", () => {
      beforeEach(() => {
        mockMainWindow.document.getElementById.mock.implementation = () => null;

        new Platform(mockMainWindow).run();
      });

      it("should invoke console.error once", () => {
        expect(mockMainWindow.console.error).toHaveBeenCalledTimes(1);
      });

      it("should invoke alert once", () => {
        expect(mockMainWindow.alert).toHaveBeenCalledTimes(1);
      });
    });

    describe("with an exception thrown in the callback", () => {
      let mockCallback;

      beforeEach(() => {
        mockMainWindow.document.getElementById.mock.implementation = () => ({
          getContext: () => {},
        });

        mockCallback = Mock.fn(() => {
          throw new Error();
        }).mockName("callback");

        new Platform(mockMainWindow).run("", mockCallback);
      });

      it("should invoke console.error once", () => {
        expect(mockMainWindow.console.error).toHaveBeenCalledTimes(1);
      });

      it("should invoke alert once", () => {
        expect(mockMainWindow.alert).toHaveBeenCalledTimes(1);
      });
    });

    describe("with no exception thrown", () => {
      const FAKE_CANVAS_ID = "fake-canvas-id";
      let mockCallback;
      let mockElement;

      beforeEach(() => {
        mockElement = {
          getContext: Mock.fn().mockName("getContext"),
        };

        mockMainWindow.document.getElementById.mock.implementation = () =>
          mockElement;

        mockCallback = Mock.fn().mockName("callback");

        new Platform(mockMainWindow).run(FAKE_CANVAS_ID, mockCallback);
      });

      it("should invoke document.getElementById once with canvas ID", () => {
        expect(mockMainWindow.document.getElementById).toHaveBeenCalledTimes(1);
        expect(
          mockMainWindow.document.getElementById
        ).toHaveBeenCalledWithShallow(FAKE_CANVAS_ID);
      });

      it("should invoke addEventListener twice (see Controls)", () => {
        expect(mockMainWindow.document.addEventListener).toHaveBeenCalledTimes(
          2
        );
      });

      it("should invoke getContext once with '2d'", () => {
        expect(mockElement.getContext).toHaveBeenCalledTimes(1);
        expect(mockElement.getContext).toHaveBeenCalledWithShallow("2d");
      });

      it("should invoke the callback once", () => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
    });
  });
});
