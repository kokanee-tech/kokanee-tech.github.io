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
    let mockAudioContext;

    beforeEach(() => {
      mockAudioContext = {
        suspend: Mock.fn().mockName("suspend"),
        resume: Mock.fn().mockName("resume"),
      };

      mockMainWindow = {
        alert: Mock.fn().mockName("alert"),
        AudioContext: function () {
          return mockAudioContext;
        },
        console: {
          error: Mock.fn().mockName("console.error"),
        },
        document: {
          getElementById: Mock.fn().mockName("document.getElementById"),
          addEventListener: Mock.fn().mockName("addEventListener"),
        },
        navigator: {
          getGamepads: () => {}, // see Controls constructor
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
      let mockCallback;
      let mockElement;

      beforeEach(() => {
        mockElement = {
          getContext: Mock.fn().mockName("getContext"),
        };

        mockMainWindow.document.getElementById.mock.implementation = () =>
          mockElement;

        mockMainWindow.document.addEventListener.mock.implementation = (
          type,
          listener
        ) => {
          listener();
        };

        mockCallback = Mock.fn().mockName("callback");
      });

      it("should invoke document.getElementById once with canvas ID", () => {
        const FAKE_CANVAS_ID = "fake-canvas-id";
        new Platform(mockMainWindow).run(FAKE_CANVAS_ID, mockCallback);
        expect(mockMainWindow.document.getElementById).toHaveBeenCalledTimes(1);
        expect(
          mockMainWindow.document.getElementById
        ).toHaveBeenCalledWithShallow(FAKE_CANVAS_ID);

        expect(mockMainWindow.console.error).not.toHaveBeenCalled();
        expect(mockMainWindow.alert).not.toHaveBeenCalled();
      });

      it("should invoke addEventListener twice (see Controls constructor)", () => {
        new Platform(mockMainWindow).run("", mockCallback);
        expect(mockMainWindow.document.addEventListener).toHaveBeenCalledTimes(
          2
        );

        expect(mockMainWindow.console.error).not.toHaveBeenCalled();
        expect(mockMainWindow.alert).not.toHaveBeenCalled();
      });

      it("should invoke getContext once with '2d'", () => {
        new Platform(mockMainWindow).run("", mockCallback);
        expect(mockElement.getContext).toHaveBeenCalledTimes(1);
        expect(mockElement.getContext).toHaveBeenCalledWithShallow("2d");

        expect(mockMainWindow.console.error).not.toHaveBeenCalled();
        expect(mockMainWindow.alert).not.toHaveBeenCalled();
      });

      it("should invoke the callback once", () => {
        new Platform(mockMainWindow).run("", mockCallback);
        expect(mockCallback).toHaveBeenCalledTimes(1);

        expect(mockMainWindow.console.error).not.toHaveBeenCalled();
        expect(mockMainWindow.alert).not.toHaveBeenCalled();
      });

      describe("with a page hidden event", () => {
        beforeEach(() => {
          mockMainWindow.document.hidden = true;

          new Platform(mockMainWindow).run("", mockCallback);
        });

        it("should invoke suspend once", () => {
          expect(mockAudioContext.suspend).toHaveBeenCalledTimes(1);

          expect(mockMainWindow.console.error).not.toHaveBeenCalled();
          expect(mockMainWindow.alert).not.toHaveBeenCalled();
        });
      });

      describe("with a page visible event", () => {
        beforeEach(() => {
          mockMainWindow.document.hidden = false;

          new Platform(mockMainWindow).run("", mockCallback);
        });

        it("should invoke resume once", () => {
          expect(mockAudioContext.resume).toHaveBeenCalledTimes(1);

          expect(mockMainWindow.console.error).not.toHaveBeenCalled();
          expect(mockMainWindow.alert).not.toHaveBeenCalled();
        });
      });
    });
  });
});
