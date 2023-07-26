const mysql = require('mysql');
const config = require('./sql.config.js');
class DatabaseAPI {
  constructor() {
    this.connection = mysql.createPool(config)
    this.conn();
  }

  static instance = null;

  static getInstance() {
    if (this.instance === null) {
      this.instance = new DatabaseAPI();
      delete this.constructor;
    }
    return this.instance;
  }

  async conn() {
    console.log("Connecting to database");
    return new Promise((resolve, reject) => {
      this.connection.getConnection((err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log("Connected successfully with id", this.connection._allConnections[0].threadId);
        resolve();
      });
    });
  }

  async end() {
    const handleDisconnect = new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    return handleDisconnect;
  }

  async query (query) {
    const handleMakeQuery = new Promise((resolve, reject) => {
      this.connection.query(query, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
    return handleMakeQuery;
  }

  async selectAllFrom(tableName, joinedQuery) {
    return await this.query(`SELECT * FROM ${tableName} ${joinedQuery}`);
  }

  async call(procedure, args) {
    const returnedData = await this.query(`CALL ${procedure}(${args || ''})`);
    return returnedData[0];
  }

  async selectFieldsFrom(tableName, fields, joinedQuery) {
    return await this.query(`SELECT (${fields}) FROM ${tableName} ${joinedQuery || ''}`);
  }

  async insertInto(tableName, fields, values, joinedQuery) {
    values = values.map(value => typeof value === 'string' || (value !== "NOW()") ? `"${value}"` : value);
    await this.query(`INSERT INTO ${tableName} (${fields}) VALUES (${values}) ${joinedQuery || ''}`);
  }

  async findByField(tablename, field, value) {
    return await this.query(`SELECT * FROM ${tablename} WHERE ${field}=${value}`);
  }

  async deleteFrom(tablename, condition) {
    await this.query(`DELETE FROM ${tablename} ${condition ? condition : ''}`);
  }

}

module.exports = DatabaseAPI;