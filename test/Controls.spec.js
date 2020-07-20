import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Mock from "../src/specish/Mock.js";
import Controls from "../src/Controls.js";

describe("Controls", () => {
  describe("constructor", () => {
    it("should save the main window", () => {
      const mainWindow = {};
      expect(new Controls(mainWindow).mainWindow).toBe(mainWindow);
    });
  });

  describe("getGamepadSample", () => {
    let mockMainWindow;

    beforeEach(() => {
      mockMainWindow = {
        navigator: {
          getGamepads: Mock.fn().mockName("getGamepads"),
        },
      };
    });

    describe("with an empty array", () => {
      beforeEach(() => {
        mockMainWindow.navigator.getGamepads.mock.implementation = () => [];
      });

      it("should invoke getGamepads once", () => {
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

      it("should invoke getGamepads once", () => {
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

      it("should invoke getGamepads once", () => {
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
