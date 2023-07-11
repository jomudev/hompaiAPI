const Admin = require('../Main/Main');
class Session {
  constructor(userInfo, ip, messagingToken) {
    this.user = userInfo;
    this.ip = ip;
    this.admin = new Admin(this.user.uid, messagingToken);
  }
}

module.exports = Session;