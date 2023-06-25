const Admin = require('../Main/Main');

class Session {
  constructor(userInfo) {
    this.user = userInfo;
    this.admin = new Admin(this.user.uid);
  }
}

module.exports = Session;