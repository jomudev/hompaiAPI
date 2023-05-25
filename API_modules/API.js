class API {
  constructor() {
    this.db;
    this.tablename;
  }

  async getAllRecordsFrom() {
    if (this.tablename.includes(" ")) {
      return;
    }
    return await this.db.selectAllFrom();
  }

  hasProp(element, prop) {
    return element.hasOwnProperty(prop);
  }

  async createRecord(keys, values) {
    if (this.tablename.includes(" ")) {
      return;
    }
    if (typeof keys !== "object" || typeof values !== "object") {
      return;
    }
    await this.db.insertInto(this.tablename ,keys, values);
  }

  async deleteRecord(recordId) {
    await this.db.deleteFrom(`DELETE FROM ${this.tablename} WHERE id=${recordId}`);
  }

  async modifyRecord() {

  }

  async findRecord() {

  }

}

module.exports = API;