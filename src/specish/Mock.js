const ResultType = {
  RETURN: "return",
  THROW: "throw",
  INCOMPLETE: "incomplete",
};

export default class Mock {
  constructor(implementation) {
    this.implementation = implementation;
    this.name = null;
    this.calls = [];
    this.results = [];
  }

  clear() {
    this.calls = [];
    this.results = [];
  }

  start(...args) {
    this.calls.push([...args]);
    this.results.push({ type: ResultType.INCOMPLETE });
  }

  end(type, value) {
    const result = this.results[this.results.length - 1];
    result.type = type;
    result.value = value;
  }

  static fn(mockImplementation) {
    const f = (...args) => {
      f.mock.start(...args);
      try {
        const returnValue = f.mock.implementation(...args);
        f.mock.end(ResultType.RETURN, returnValue);
        return returnValue;
      } catch (err) {
        f.mock.end(ResultType.THROW, err);
        throw err;
      }
    };

    f.mockName = (name) => {
      f.mock.name = name;
      return f;
    };

    f.mockClear = () => {
      f.mock.clear();
      return f;
    };

    f.toString = () => f.mock.name || "Mock.fn()";

    f.mock = new Mock(mockImplementation || (() => {}));

    return f;
  }
}
