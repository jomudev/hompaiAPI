const Database = require('../Database/index');
const Articles = require('../Articles/index');
class Main {
  constructor(uid) {
    this.articles = new Articles(uid);
  }
  
}

module.exports = Main;