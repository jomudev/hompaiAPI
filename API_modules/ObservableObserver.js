module.exports = class ObservableObserver {
  constructor(observable) {
    this.observers = [];
    this.observable = observable;
  }

  attachObserver(observer) {
    this.observers.push(observer);
  }

  detachObserver(observer) {
    this.observers = this.observers.filter(o => o.id !== observer.id);
  }

  notify() {
    this.observers.forEach(observer => observer.update());
  }

  update() { 
    console.log(`update from observable with name: ${this.observable.constructor.name}`);
  }
}