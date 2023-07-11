const API = require('../API');
const Database = require('../Database');
class UsersAPI extends API {
  constructor() {
    super("Users");
  }

  async getAllUsers() {
    return await this.getAllRecords();
  }

  userElementIsValid(user) {
    let validator = false;
    validator = this.hasProp(user, 'id') && ((user.id !== null) || user.id !== undefined);
    validator = validator && this.hasProp(user, 'email') && ((user.email !== null) || user.email !== undefined);
    validator = validator && (user.email.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm) !== null);
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

  async createUserMessagingToken(userId, messagingToken) {
    await this.db.query(`INSERT INTO MessagingTokens(idUsers, token) VALUES(${userId}, ${messagingToken})`);
  }

  async createUser(user, messagingToken) {
    console.log("creating user", user);
    const isUserElementValid = this.userElementIsValid(user);
    try {
      if (isUserElementValid) {
        const {keys, values} = this.depurate(user);
        await this.createRecord(keys, values);
      } else {
        throw new Error("El formato del usuario no es válido.");
      }
    } catch (err) {
      console.log(err);
      return err;
    }
    this.createUserMessagingToken(user.uid, messagingToken);
  }

  async getUserByEmail(email) {
    return await this.db.findByField(this.tablename, "email", email);
  }

  async getUserById(id) {
    return await this.db.findByField(this.tablename, "id", id);
  }

  async deleteUser(uid) {
    await this.deleteRecord(uid);
  }
  
};

module.exports = UsersAPI;