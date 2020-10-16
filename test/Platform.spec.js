import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Mock from "../src/specish/Mock.js";
import Platform from "../src/Platform.js";

describe("Platform", () => {
  describe("run", () => {
    let mockAudioContext;
    let mockDocument;
    let mockWindow;
    let mockTimer;
    let platform;

    beforeEach(() => {
      mockAudioContext = {
        suspend: Mock.fn().mockName("suspend"),
        resume: Mock.fn().mockName("resume"),
      };

      mockDocument = {
        getElementById: Mock.fn().mockName("document.getElementById"),
        addEventListener: Mock.fn().mockName("addEventListener"),
      };

      mockWindow = {
        alert: Mock.fn().mockName("alert"),
        AudioContext: function () {
          return mockAudioContext;
        },
        console: {
          error: Mock.fn().mockName("console.error"),
        },
        document: mockDocument,
      };

      mockTimer = {
        forEachAnimationFrame: Mock.fn().mockName("forEachAnimationFrame"),
      };

      const descriptor = {
        deps: {
          Controls: function () {},
          Timer: function () {
            return mockTimer;
          },
          UiElement: function () {},
          window: mockWindow,
        },
      };

      platform = new Platform(descriptor);
    });

    describe("with an exception thrown in the callback", () => {
      let mockCallback;

      beforeEach(() => {
        mockDocument.getElementById.mock.implementation = () => ({
          getContext: () => {},
        });

        mockCallback = Mock.fn(() => {
          throw new Error();
        }).mockName("callback");

        platform.run("", mockCallback);
      });

      it("should invoke console.error once", () => {
        expect(mockWindow.console.error).toHaveBeenCalledTimes(1);
      });

      it("should invoke alert once", () => {
        expect(mockWindow.alert).toHaveBeenCalledTimes(1);
      });
    });

    describe("with no exception thrown", () => {
      const expectNoError = () => {
        expect(mockWindow.console.error).not.toHaveBeenCalled();
        expect(mockWindow.alert).not.toHaveBeenCalled();
      };
      let mockCallback;
      let mockElement;

      beforeEach(() => {
        mockElement = {
          getContext: Mock.fn().mockName("getContext"),
        };

        mockDocument.getElementById.mock.implementation = () => mockElement;

        mockCallback = Mock.fn().mockName("callback");
      });

      it("should invoke document.getElementById once with canvas ID", () => {
        const FAKE_CANVAS_ID = "fake-canvas-id";
        platform.run(FAKE_CANVAS_ID, mockCallback);

        expectNoError();
        expect(mockDocument.getElementById).toHaveBeenCalledTimes(1);
        expect(mockDocument.getElementById).toHaveBeenCalledWithShallow(
          FAKE_CANVAS_ID
        );
      });

      it("should invoke forEachAnimationFrame once", () => {
        platform.run("", mockCallback);

        expectNoError();
        expect(mockTimer.forEachAnimationFrame).toHaveBeenCalledTimes(1);
      });

      it("should invoke addEventListener once", () => {
        platform.run("", mockCallback);

        expectNoError();
        expect(mockDocument.addEventListener).toHaveBeenCalledTimes(1);
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
          mockDocument.addEventListener.mock.implementation = (
            type,
            listener
          ) => {
            listener();
          };
        });

        it("should invoke suspend once if page is hidden", () => {
          mockDocument.hidden = true;
          platform.run("", mockCallback);

          expectNoError();
          expect(mockAudioContext.suspend).toHaveBeenCalledTimes(1);
          expect(mockAudioContext.resume).not.toHaveBeenCalled();
        });

        it("should invoke resume once if page is visible", () => {
          mockDocument.hidden = false;
          platform.run("", mockCallback);

          expectNoError();
          expect(mockAudioContext.resume).toHaveBeenCalledTimes(1);
          expect(mockAudioContext.suspend).not.toHaveBeenCalled();
        });
      });
    });
  });
});
