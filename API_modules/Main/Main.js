const Articles = require('../Articles/index');
const ExpiredArticlesNotifier = require('../Articles/ExpiredArticlesNotifier');

class Main {
  constructor(uid) {
    this.articles = new Articles(uid);
    //this.ExpiredArticlesNotifier = new Articles(this.articles);
  }
}

module.exports = Main;