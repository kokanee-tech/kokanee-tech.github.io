import { describe, it, expect, beforeEach } from "../src/specish/specish.js";
import Mock from "../src/specish/Mock.js";
import AudioSupport from "../src/AudioSupport.js";

describe("AudioSupport", () => {
  describe("constructor", () => {
    it("should save the audio context", () => {
      const audioContext = {};
      expect(new AudioSupport(audioContext).audioContext).toBe(audioContext);
    });
  });

  describe("audioReady", () => {
    let mockElement;

    beforeEach(() => {
      mockElement = {
        addEventListener: Mock.fn((type, listener) => listener()).mockName(
          "addEventListener"
        ),
        removeEventListener: Mock.fn().mockName("removeEventListener"),
      };
    });

    describe("for a running context", () => {
      let mockAudioContext;

      beforeEach(() => {
        mockAudioContext = {
          state: "running",
        };

        // audioReady() is an async function and
        // typically we would 'await' its return value, but here
        // we are only checking a few mock function calls.
        new AudioSupport(mockAudioContext).audioReady(mockElement);
      });

      it("should not invoke addEventListener", () => {
        expect(mockElement.addEventListener).not.toHaveBeenCalled();
      });
    });

    describe("for a suspended context", () => {
      let mockAudioContext;

      beforeEach(() => {
        mockAudioContext = {
          state: "suspended",
          resume: Mock.fn().mockName("resume"),
        };

        // audioReady() is an async function and
        // typically we would 'await' its return value, but here
        // we are only checking a few mock function calls.
        new AudioSupport(mockAudioContext).audioReady(mockElement);
      });

      it("should invoke addEventListener once", () => {
        expect(mockElement.addEventListener).toHaveBeenCalledTimes(1);
      });

      it("should invoke removeEventListener once", () => {
        expect(mockElement.removeEventListener).toHaveBeenCalledTimes(1);
      });

      it("should invoke resume once", () => {
        expect(mockAudioContext.resume).toHaveBeenCalledTimes(1);
      });
    });
  });
});
