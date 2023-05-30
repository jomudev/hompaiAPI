const API = require('../API');

class UsersAPI extends API {
  constructor() {
    super("Users");
  }

  async getAllUsers() {
    return await this.getAllRecords();
  }

  userElementIsValid(user) {
    let validator = false;
    validator = this.hasProp(user, 'id');
    validator = validator && this.hasProp(user, 'email');
    validator = validator && (user.email.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm) !== null);
    console.log("is user valid: " + validator);
    return validator;
  }

  depurate(element) {
    let values = [];
    const keys = Object.keys(element).filter((key) => {
      const value = element[key];
      if (value) {
        values.push(value);
        return true;
      }
    });

    return { keys, values };
  }

  async createUser(user) {
    console.log("creating user", user);
    const isUserElementValid = this.userElementIsValid(user);
    if (isUserElementValid) {
      const {keys, values} = this.depurate(user);
      await this.createRecord(keys, values);
    } else {
      throw new Error("El formato del usuario no es válido.");
    }
  }

  async getUserByEmail(email) {
    return await this.db.findByField(this.tablename, "email", email);
  }

  async getUserById(id) {
    return await this.db.findByField(this.tablename, "id", id);
  }
  
};

module.exports = UsersAPI;