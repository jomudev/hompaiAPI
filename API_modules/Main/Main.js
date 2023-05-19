const Database = require('../Database/index');
const Users = require('../Users/index');

class Main {
  constructor() {
    this.db = new Database();
    this.userAdmin = new Users();
  }

  async init() {
    await this.db.conn();
    this.userAdmin.db = this.db;
  }

  async end() {
    await this.db.end();
  }
}

module.exports = Main;