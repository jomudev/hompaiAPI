class API {
  constructor(tablename) {
    this.db;
    this.tablename = tablename;
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
    await this.db.insertInto(this.tablename ,keys, values);
  }

  async deleteRecord(recordId) {
    await this.db.deleteFrom(this.tablename, `WHERE id=${recordId}`);
  }

  async modifyRecord() {

  }

  async findRecord(field, value) {
    return await this.db.findByField(this.tablename, field, value);
  }

}

module.exports = API;