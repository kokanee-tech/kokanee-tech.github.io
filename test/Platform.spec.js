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
    /*
    with no exceptions thrown:
    - should invoke document.getElementById once with canvas ID
    - should invoke getContext once with a literal "2d"
    - should invoke the callback once

    with no element found for that canvas ID:
    - should invoke console.error once
    - should invoke alert once

    with a callback that throws an exception:
    - should invoke console.error once
    - should invoke alert once
    */
  });
});
