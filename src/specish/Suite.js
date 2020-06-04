export default class Suite {
  constructor(parentSuite, description) {
    this.parentSuite = parentSuite;
    this.description = description;
    this.specs = [];
    this.innerSuites = [];
    this.preSpecs = [];
    this.postSpecs = [];
  }

  forEachAncestor(callback) {
    if (this.parentSuite) {
      this.parentSuite.forEachAncestor(callback);
    }
    callback(this);
  }

  run(handler) {
    handler.suiteStart(this.description);

    this.specs.forEach((spec) => {
      this.forEachAncestor((suite) =>
        suite.preSpecs.forEach((preSpec) => preSpec())
      );

      spec.run(handler);

      this.forEachAncestor((suite) =>
        suite.postSpecs.forEach((postSpec) => postSpec())
      );
    });

    this.innerSuites.forEach((innerSuite) => innerSuite.run(handler));

    handler.suiteEnd();
  }
}
