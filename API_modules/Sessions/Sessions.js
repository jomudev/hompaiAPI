const Auth = require('../../firebase/auth');
const Session = require('./Session');

class Sessions {
  constructor() {
    this.sessions = {};
  }

  static instance = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Sessions();
    }

    return this.instance;
  }

  getSession(uid) {
    return this.sessions[uid];
  }

  async setSession(uid) {
    if (this.verifySession(uid)) {
      return;
    }
    var userInfo;
    try {
      userInfo = await Auth().getUser(uid);
    } catch (err) {
      console.error(err);
      return;
    }
    this.sessions[uid] = new Session(userInfo);
  }

  verifySession(uid) {
    return !!this.sessions[uid];
  }

  endSession(uid) {
    this.sessions[uid] = null;
  }
  
}

module.exports = Sessions;