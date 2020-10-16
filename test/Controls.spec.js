import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Mock from "../src/specish/Mock.js";
import Controls from "../src/Controls.js";

describe("Controls", () => {
  let mockDocument;
  let mockNavigator;
  let descriptor;

  beforeEach(() => {
    mockDocument = {
      addEventListener: Mock.fn().mockName("addEventListener"),
    };

    mockNavigator = {
      getGamepads: Mock.fn().mockName("navigator.getGamepads"),
    };

    descriptor = {
      deps: {
        window: {
          document: mockDocument,
          navigator: mockNavigator,
        },
      },
    };
  });

  describe("constructor", () => {
    it("should invoke addEventListener once", () => {
      new Controls(descriptor);
      expect(mockDocument.addEventListener).toHaveBeenCalledTimes(1);
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

      it("should invoke navigator.getGamepads once if page is hidden", () => {
        mockDocument.hidden = true;
        new Controls(descriptor);
        expect(mockNavigator.getGamepads).toHaveBeenCalledTimes(1);
      });

      it("should not invoke navigator.getGamepads if page is visible", () => {
        mockDocument.hidden = false;
        new Controls(descriptor);
        expect(mockNavigator.getGamepads).not.toHaveBeenCalled();
      });
    });
  });

  describe("getGamepadSample", () => {
    describe("with an empty array", () => {
      beforeEach(() => {
        mockNavigator.getGamepads.mock.implementation = () => [];
      });

      it("should invoke navigator.getGamepads once", () => {
        new Controls(descriptor).getGamepadSample();
        expect(mockNavigator.getGamepads).toHaveBeenCalledTimes(1);
      });

      it("should return null", () => {
        const result = new Controls(descriptor).getGamepadSample();
        expect(result).toBe(null);
      });
    });

    describe("with an array containing null", () => {
      beforeEach(() => {
        mockNavigator.getGamepads.mock.implementation = () => [null];
      });

      it("should invoke navigator.getGamepads once", () => {
        new Controls(descriptor).getGamepadSample();
        expect(mockNavigator.getGamepads).toHaveBeenCalledTimes(1);
      });

      it("should return null", () => {
        const result = new Controls(descriptor).getGamepadSample();
        expect(result).toBe(null);
      });
    });

    describe("with an array containing a gamepad sample", () => {
      const gamepadSample = {};

      beforeEach(() => {
        mockNavigator.getGamepads.mock.implementation = () => [gamepadSample];
      });

      it("should invoke navigator.getGamepads once", () => {
        new Controls(descriptor).getGamepadSample();
        expect(mockNavigator.getGamepads).toHaveBeenCalledTimes(1);
      });

      it("should return the gamepad sample", () => {
        const result = new Controls(descriptor).getGamepadSample();
        expect(result).toBe(gamepadSample);
      });
    });
  });
});
