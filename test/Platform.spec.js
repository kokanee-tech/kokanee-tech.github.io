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
    // TODO
  });
});
