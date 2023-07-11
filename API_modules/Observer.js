class Observer {
  constructor(observable) {
    this.observable = observable;
  }

  update() {
    console.log(`update from observable with name: ${this.observable.constructor.name}`);
  }
}

module.exports = Observer;