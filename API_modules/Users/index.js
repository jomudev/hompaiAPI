const API = require('../API');

class UsersAPI extends API {
  constructor() {
    super();
    super.tablename = "Users";
  }

  async getAllUsers() {
    return await this.getAllRecordsFrom();
  }

  userElementIsValid(user) {
    let validator = false;
    validator = this.hasProp(user, 'id');
    validator = validator && this.hasProp(user, 'email');
    validator = validator && user.email.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm);
    return validator;
  }

  async saveUser(user) {
    console.log("creating user")
    const filter = {
      true: async () => {
        const keys = Object.keys(user);
        const values = Object.values(user);
        await this.createRecord(keys, values);
      },
      false: async () => {}
    }
    return filter[this.userElementIsValid(user)]();
  }
  
};

module.exports = UsersAPI;