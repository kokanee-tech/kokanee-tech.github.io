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
    let platform;

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

      platform = new Platform(mockMainWindow);
    });

    describe("with no element found matching the specified canvas ID", () => {
      beforeEach(() => {
        mockMainWindow.document.getElementById.mock.implementation = () => null;

        platform.run();
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

        platform.run("", mockCallback);
      });

      it("should invoke console.error once", () => {
        expect(mockMainWindow.console.error).toHaveBeenCalledTimes(1);
      });

      it("should invoke alert once", () => {
        expect(mockMainWindow.alert).toHaveBeenCalledTimes(1);
      });
    });

    describe("with no exception thrown", () => {
      const expectNoError = () => {
        expect(mockMainWindow.console.error).not.toHaveBeenCalled();
        expect(mockMainWindow.alert).not.toHaveBeenCalled();
      };
      let mockCallback;
      let mockElement;

      beforeEach(() => {
        mockElement = {
          getContext: Mock.fn().mockName("getContext"),
        };

        mockMainWindow.document.getElementById.mock.implementation = () =>
          mockElement;

        mockCallback = Mock.fn().mockName("callback");
      });

      it("should invoke document.getElementById once with canvas ID", () => {
        const FAKE_CANVAS_ID = "fake-canvas-id";
        platform.run(FAKE_CANVAS_ID, mockCallback);

        expectNoError();
        expect(mockMainWindow.document.getElementById).toHaveBeenCalledTimes(1);
        expect(
          mockMainWindow.document.getElementById
        ).toHaveBeenCalledWithShallow(FAKE_CANVAS_ID);
      });

      it("should invoke addEventListener twice (see Controls constructor)", () => {
        platform.run("", mockCallback);

        expectNoError();
        expect(mockMainWindow.document.addEventListener).toHaveBeenCalledTimes(
          2
        );
      });

      it("should invoke getContext once with '2d'", () => {
        platform.run("", mockCallback);

        expectNoError();
        expect(mockElement.getContext).toHaveBeenCalledTimes(1);
        expect(mockElement.getContext).toHaveBeenCalledWithShallow("2d");
      });

      it("should invoke the callback once", () => {
        platform.run("", mockCallback);

        expectNoError();
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });

      describe("with a visibility change event", () => {
        beforeEach(() => {
          mockMainWindow.document.addEventListener.mock.implementation = (
            type,
            listener
          ) => {
            listener();
          };
        });

        it("should invoke suspend once if page is hidden", () => {
          mockMainWindow.document.hidden = true;
          platform.run("", mockCallback);

          expectNoError();
          expect(mockAudioContext.suspend).toHaveBeenCalledTimes(1);
          expect(mockAudioContext.resume).not.toHaveBeenCalled();
        });

        it("should invoke resume once if page is visible", () => {
          mockMainWindow.document.hidden = false;
          platform.run("", mockCallback);

          expectNoError();
          expect(mockAudioContext.resume).toHaveBeenCalledTimes(1);
          expect(mockAudioContext.suspend).not.toHaveBeenCalled();
        });
      });
    });
  });
});
