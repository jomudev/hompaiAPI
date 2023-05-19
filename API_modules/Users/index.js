const API = require('../API');

class UsersAPI extends API {
  constructor() {
    super();
    super.tableName = "Users";
  }

  async getAllUsers() {
    return await this.getAllRecordsFrom(this.tableName);
  }

  userElementIsValid(user) {
    const hasProp = (prop) => user.hasOwnProperty(prop);
    return hasProp('id')
    && hasProp('email')
    && hasProp('authorization');
  }

  async saveUser(user) {
    console.log("creating user")
    const filter = {
      true: async () => {
        const keys = Object.keys(user);
        const values = Object.values(user);
        await this.createRecord(this.tableName, keys, values);
      },
      false: async () => {}
    }
    return filter[this.userElementIsValid(user)]();
  }
  
};

module.exports = UsersAPI;