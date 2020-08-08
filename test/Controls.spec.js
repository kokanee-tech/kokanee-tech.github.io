import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Mock from "../src/specish/Mock.js";
import Controls from "../src/Controls.js";

describe("Controls", () => {
  let mockMainWindow;

  beforeEach(() => {
    mockMainWindow = {
      navigator: {
        getGamepads: Mock.fn().mockName("navigator.getGamepads"),
      },
      document: {
        addEventListener: Mock.fn().mockName("addEventListener"),
      },
    };
  });

  describe("constructor", () => {
    let underTest;

    beforeEach(() => {
      underTest = new Controls(mockMainWindow);
    });

    it("should save the main window", () => {
      expect(underTest.mainWindow).toBe(mockMainWindow);
    });

    it("should invoke addEventListener once", () => {
      expect(mockMainWindow.document.addEventListener).toHaveBeenCalledTimes(1);
    });
  });

  describe("getGamepadSample", () => {
    describe("with an empty array", () => {
      beforeEach(() => {
        mockMainWindow.navigator.getGamepads.mock.implementation = () => [];
      });

      it("should invoke navigator.getGamepads once", () => {
        new Controls(mockMainWindow).getGamepadSample();
        expect(mockMainWindow.navigator.getGamepads).toHaveBeenCalledTimes(1);
      });

      it("should return null", () => {
        const result = new Controls(mockMainWindow).getGamepadSample();
        expect(result).toBe(null);
      });
    });

    describe("with an array containing null", () => {
      beforeEach(() => {
        mockMainWindow.navigator.getGamepads.mock.implementation = () => [null];
      });

      it("should invoke navigator.getGamepads once", () => {
        new Controls(mockMainWindow).getGamepadSample();
        expect(mockMainWindow.navigator.getGamepads).toHaveBeenCalledTimes(1);
      });

      it("should return null", () => {
        const result = new Controls(mockMainWindow).getGamepadSample();
        expect(result).toBe(null);
      });
    });

    describe("with an array containing a gamepad sample", () => {
      const gamepadSample = {};

      beforeEach(() => {
        mockMainWindow.navigator.getGamepads.mock.implementation = () => [
          gamepadSample,
        ];
      });

      it("should invoke navigator.getGamepads once", () => {
        new Controls(mockMainWindow).getGamepadSample();
        expect(mockMainWindow.navigator.getGamepads).toHaveBeenCalledTimes(1);
      });

      it("should return the gamepad sample", () => {
        const result = new Controls(mockMainWindow).getGamepadSample();
        expect(result).toBe(gamepadSample);
      });
    });
  });
});
