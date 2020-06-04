import {
  runAll,
  describe,
  it,
  beforeEach,
  afterEach,
  expect,
} from "../../src/specish/specish.js";
import Mock from "../../src/specish/Mock.js";

describe("specish", () => {
  let mockCallback;

  beforeEach(() => {
    mockCallback = Mock.fn().mockName("mockCallback");
  });

  describe("runAll", () => {
    it("should be defined", () => {
      expect(runAll).toBeDefined();
    });
  });

  describe("describe", () => {
    const mockLocalCallback = Mock.fn().mockName("mockLocalCallback");

    describe("(under test)", mockLocalCallback);

    it("should invoke the callback once before any spec", () => {
      expect(mockLocalCallback).toHaveBeenCalledTimes(1);
      expect(mockLocalCallback).toHaveBeenCalledWithShallow();
    });
  });

  describe("it", () => {
    it("should not invoke the callback before any antecedent spec", () => {
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it("(under test)", () => mockCallback());

    it("should not invoke the callback before any subsequent spec", () => {
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe("beforeEach", () => {
    it("should invoke the callback once before any antecedent spec", () => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWithShallow();
    });

    beforeEach(() => mockCallback());

    it("should invoke the callback once before any subsequent spec", () => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWithShallow();
    });
  });

  describe("afterEach", () => {
    it("should not invoke the callback before any antecedent spec", () => {
      expect(mockCallback).not.toHaveBeenCalled();
    });

    afterEach(() => mockCallback());

    it("should not invoke the callback before any subsequent spec", () => {
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe("expect", () => {
    it("should be defined", () => {
      expect(expect).toBeDefined();
    });
  });
});
