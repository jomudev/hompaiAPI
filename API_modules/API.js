const Database = require("./Database");
const Observable = require("./Observable");

class API extends Observable {
  constructor(uid, tablename) {
    super();
    this.db = Database.getInstance();
    this.uid = uid;
    this.tablename = tablename;
  }

  getValues(element) {
    return `${Object.values(element).map(value => typeof value === 'string' ? `'${value}'` : value === 0 ? 0 : !value ? 'NULL' : value)}`;
  }

  async getAllRecords() {
    console.log("providing all records from " + this.tablename);
    return await this.db.selectAllFrom(this.tablename);
  }

  hasProp(element, prop) {
    return element.hasOwnProperty(prop);
  }

  async createRecord(keys, values) {
    if (typeof keys !== "object" || typeof values !== "object") {
      return;
    }
    await this.db.insertInto(this.tablename ,keys, values, `WHERE idUsers=${this.uid}`);
  }

  async deleteRecord(recordId) {
    await this.db.deleteFrom(this.tablename, `WHERE id="${recordId}"`);
  }

  async modifyRecord(recordId, field, value) {
    await this.db.update(this.tablename, field, value, `WHERE id="${recordId}"`);
  }

  async findRecord(field, value) {
    return await this.db.findByField(this.tablename, field, value);
  }

}

module.exports = API;