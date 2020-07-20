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
    // TODO
  });
});
