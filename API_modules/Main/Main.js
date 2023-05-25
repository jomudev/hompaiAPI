const Database = require('../Database/index');
const Users = require('../Users/index');
const Articles = require('../Articles/index');

class Main {
  constructor() {
    this.db = new Database();
    this.userAdmin = new Users();
    this.articlesAdmin = new Articles();
  }

  async init() {
    await this.db.conn();
    this.userAdmin.db = this.db;
    this.articlesAdmin.db = this.db;
  }

  async end() {
    await this.db.end();
  }
}

module.exports = Main;