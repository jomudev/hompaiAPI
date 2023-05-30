const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
const env = process.env;
const config = JSON.parse(env.SQL_CONFIG);
class DatabaseAPI {
  constructor() {
    this.connection = mysql.createConnection(config);
  }

  async conn() {
    const handleConnect = new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    return handleConnect;
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
    console.log(query);
    const handleMakeQuery = new Promise((resolve, reject) => {
      this.connection.query(query, (err, result, fields) => {
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
    return await this.query(`SELECT * FROM ${tableName} ${joinedQuery || ''}`);
  }

  async selectFieldsFrom(fields, tableName, joinedQuery) {
    return await this.query(`SELECT (${fields}) FROM ${tableName} ${joinedQuery || ''}`);
  }

  async insertInto(tableName, fields, values, joinedQuery) {
    values = values.map(value => typeof value === 'string' || (value !== "NOW()") ? `"${value}"` : value);
    await this.query(`INSERT INTO ${tableName} (${fields}) VALUES (${values}) ${joinedQuery || ''}`);
  }

  async findByField(tablename, field, value) {
    return await this.query(`SELECT * FROM ${tablename} WHERE ${field}=${value}`);
  }

}

module.exports = DatabaseAPI;