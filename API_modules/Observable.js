class Observable {
  constructor() {
    this.observers = [];
  }

  attachObserver(observer) {
    this.observers.push(observer);
  }

  detachObserver(observer) {
    this.observers = this.observers.filter((o) => o.id !== observer.id);
  }

  notify() {
    for (let observer of this.observers) {
      console.log(observer);
      observer.update();
    }
  }
}

module.exports = Observable;