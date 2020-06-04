import Matcher from "./Matcher.js";
import Spec from "./Spec.js";
import Suite from "./Suite.js";

class Specish {
  constructor() {
    this.currentSuite = null;
    this.rootSuites = [];
  }

  throwIfRoot() {
    if (!this.currentSuite) {
      throw new Error("Invalid operation at root. Please use describe().");
    }
  }

  runAll(mockConsole) {
    const localConsole = mockConsole || console;
    let passing = 0;
    let failing = 0;

    this.rootSuites.forEach((suite) => {
      suite.run({
        suiteStart: (description) => {
          localConsole.group(description);
        },
        suiteEnd: () => {
          localConsole.groupEnd();
        },
        specPass: (description) => {
          passing++;
          localConsole.log(description);
        },
        specFail: (description, message) => {
          failing++;
          localConsole.error(`${description} ---> ${message}`);
        },
      });
    });

    localConsole.log(`Passing: ${passing}`);
    if (failing) {
      localConsole.log(`Failing: ${failing} <---`);
    }
  }

  describe(description, callback) {
    const parentSuite = this.currentSuite;
    this.currentSuite = new Suite(parentSuite, description);

    const suites = parentSuite ? parentSuite.innerSuites : this.rootSuites;
    suites.push(this.currentSuite);

    callback();

    this.currentSuite = parentSuite;
  }

  it(description, callback) {
    this.throwIfRoot();

    const spec = new Spec(description, callback);
    this.currentSuite.specs.push(spec);
  }

  beforeEach(callback) {
    this.throwIfRoot();

    this.currentSuite.preSpecs.push(callback);
  }

  afterEach(callback) {
    this.throwIfRoot();

    this.currentSuite.postSpecs.push(callback);
  }

  expect(actual) {
    return new Matcher(actual);
  }
}

Specish.defaultInstance = new Specish();

export const runAll = (...args) => Specish.defaultInstance.runAll(...args);
export const describe = (...args) => Specish.defaultInstance.describe(...args);
export const it = (...args) => Specish.defaultInstance.it(...args);
export const beforeEach = (...args) =>
  Specish.defaultInstance.beforeEach(...args);
export const afterEach = (...args) =>
  Specish.defaultInstance.afterEach(...args);
export const expect = (...args) => Specish.defaultInstance.expect(...args);
