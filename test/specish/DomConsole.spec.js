import { describe, it, expect, beforeEach } from "../../src/specish/specish.js";
import Mock from "../../src/specish/Mock.js";
import DomConsole from "../../src/specish/DomConsole.js";

describe("DomConsole", () => {
  const rootId = "foo";
  let mockDocument;
  let domConsole;

  function clearMocks() {
    mockDocument.getElementById.mockClear();
    mockDocument.createElement.mockClear();
  }

  beforeEach(() => {
    mockDocument = {
      getElementById: Mock.fn((id) => ({
        appendChild: Mock.fn().mockName(`#${id}.appendChild`),
      })).mockName("getElementById"),
      createElement: Mock.fn((tagName) => ({
        appendChild: Mock.fn().mockName(`${tagName}.appendChild`),
      })).mockName("createElement"),
    };

    domConsole = new DomConsole(rootId, mockDocument);
  });

  describe("constructor", () => {
    it("should invoke getElementById once with the root ID", () => {
      expect(mockDocument.getElementById).toHaveBeenCalledTimes(1);
      expect(mockDocument.getElementById).toHaveBeenCalledWithShallow(rootId);
    });

    it("should invoke createElement once with tag name 'ul'", () => {
      expect(mockDocument.createElement).toHaveBeenCalledTimes(1);
      expect(mockDocument.createElement).toHaveBeenCalledWithShallow("ul");
    });

    it("should append the new element as a child of the root element", () => {
      const rootElement = mockDocument.getElementById.mock.results[0].value;
      const newElement = mockDocument.createElement.mock.results[0].value;
      expect(rootElement.appendChild).toHaveBeenCalledTimes(1);
      expect(rootElement.appendChild).toHaveBeenCalledWithShallow(newElement);
    });
  });

  describe("isDomAvailable", () => {
    it("should return a boolean", () => {
      const result = DomConsole.isDomAvailable();
      expect(typeof result).toBe("boolean");
    });
  });

  describe("log", () => {
    const message = "bar";

    beforeEach(() => {
      clearMocks();
      domConsole.log(message);
    });

    it("should invoke createElement once with tag name 'li'", () => {
      expect(mockDocument.createElement).toHaveBeenCalledTimes(1);
      expect(mockDocument.createElement).toHaveBeenCalledWithShallow("li");
    });

    it("should set the message as the text content of the new element", () => {
      const newElement = mockDocument.createElement.mock.results[0].value;
      expect(newElement.textContent).toBe(message);
    });
  });

  describe("error", () => {
    const message = "blah";

    beforeEach(() => {
      clearMocks();
      domConsole.error(message);
    });

    it("should invoke createElement with tag name 'strong'", () => {
      expect(mockDocument.createElement).toHaveBeenCalledWithShallow("strong");
    });

    it("should set the message as the text content of the first new element", () => {
      const newElement = mockDocument.createElement.mock.results[0].value;
      expect(newElement.textContent).toBe(message);
    });

    it("should invoke createElement with tag name 'li'", () => {
      expect(mockDocument.createElement).toHaveBeenCalledWithShallow("li");
    });

    it("should append the first new element as a child of the second new element", () => {
      const firstNewElement = mockDocument.createElement.mock.results[0].value;
      const secondNewElement = mockDocument.createElement.mock.results[1].value;
      expect(secondNewElement.appendChild).toHaveBeenCalledTimes(1);
      expect(secondNewElement.appendChild).toHaveBeenCalledWithShallow(
        firstNewElement
      );
    });
  });

  describe("group", () => {
    const label = "stuff";

    beforeEach(() => {
      clearMocks();
      domConsole.group(label);
    });

    it("should invoke createElement with tag name 'ul'", () => {
      expect(mockDocument.createElement).toHaveBeenCalledWithShallow("ul");
    });

    it("should invoke createElement with tag name 'li'", () => {
      expect(mockDocument.createElement).toHaveBeenCalledWithShallow("li");
    });

    it("should set the label as the text content of the second new element", () => {
      const secondNewElement = mockDocument.createElement.mock.results[1].value;
      expect(secondNewElement.textContent).toBe(label);
    });

    it("should append the first new element as a child of the second new element", () => {
      const firstNewElement = mockDocument.createElement.mock.results[0].value;
      const secondNewElement = mockDocument.createElement.mock.results[1].value;
      expect(secondNewElement.appendChild).toHaveBeenCalledTimes(1);
      expect(secondNewElement.appendChild).toHaveBeenCalledWithShallow(
        firstNewElement
      );
    });
  });

  describe("groupEnd", () => {
    it("should throw with an appropriate message if called with no matching group()", () => {
      let message = "";
      try {
        domConsole.groupEnd();
      } catch (err) {
        message = err.message;
      }
      expect(message).toContain("group()");
    });
  });
});
