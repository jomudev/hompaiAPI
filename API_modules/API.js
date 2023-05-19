class API {
  constructor() {
    this.db;
    this.tableName;
  }

  async getAllRecordsFrom(tablename) {
    if (tablename.includes(" ")) {
      return;
    }
    return await this.db.selectAllFrom(tablename);
  }

  async createRecord(tablename, keys, values) {
    if (tablename.includes(" ")) {
      return;
    }
    if (typeof keys !== "object" || typeof values !== "object") {
      return;
    }
    await this.db.insertInto(tablename ,keys, values);
  }

  async deleteRecord(tablename, id) {
    await this.db.deleteFrom(`DELETE FROM ${tablename} WHERE id=${id}`);
  }

  async modifyRecord() {

  }

  async findRecord() {

  }

}

module.exports = API;