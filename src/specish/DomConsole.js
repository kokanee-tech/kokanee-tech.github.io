export default class DomConsole {
  constructor(rootId, mockDocument) {
    this.document = mockDocument || document;
    const rootElement = this.document.getElementById(rootId);
    this.currentList = this.createElement("ul");
    rootElement.appendChild(this.currentList);
  }

  static isDomAvailable() {
    try {
      document;
      return true;
    } catch (err) {
      return false;
    }
  }

  createElement(tagName, text, childElement) {
    const newElement = this.document.createElement(tagName);
    if (text) {
      newElement.textContent = text;
    }

    if (childElement) {
      newElement.appendChild(childElement);
    }

    return newElement;
  }

  log(message) {
    const item = this.createElement("li", message);
    this.currentList.appendChild(item);
  }

  error(message) {
    const strong = this.createElement("strong", message);
    const item = this.createElement("li", null, strong);
    this.currentList.appendChild(item);
  }

  group(label) {
    const childList = this.createElement("ul");
    const item = this.createElement("li", label, childList);
    this.currentList.appendChild(item);
    this.currentList = childList;
  }

  groupEnd() {
    const parent = this.currentList.parentElement;
    if (!parent || !parent.parentElement) {
      throw new Error("Missing parent DOM element(s). Please use group().");
    }

    this.currentList = parent.parentElement;
  }
}
