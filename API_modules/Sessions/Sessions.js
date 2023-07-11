const Auth = require('../../firebase/auth');
const Session = require('./Session');
const db = require('../Database/index').getInstance();

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

  verifyIp(uid, ip) {
    if (this.sessions[uid].ip !== ip) {
      console.log(`changing ip from ${this.sessions[uid].ip} to ${ip}...`);
      this.sessions[uid].ip = ip;
    }
  }

  async setSession(uid, ip, messagingToken) {
    if (this.verifySession(uid)) {
      this.verifyIp(uid, ip);
      return this.sessions[uid];
    }
    var userInfo;
    try {
      userInfo = await Auth().getUser(uid);
      if (!userInfo) {
        throw new Error("User not exist");
      }
    } catch (err) {
      console.error(err);
      return null;
    }
    this.sessions[uid] = new Session(userInfo, ip);
    this.setSessionToken(uid, messagingToken);
    return this.sessions[uid];
  }

  async setSessionToken(uid, messagingToken) {
    try {
      await db.query(`INSERT INTO UsersTokens(idUsers, token) VALUES("${uid}", "${messagingToken}")`);
    } catch(err) {
      console.error(err.sqlMessage);
    }
  }

  verifySession(uid) {
    return !!this.sessions[uid];
  }

  endSession(uid) {
    this.sessions[uid] = null;
  }
  
}

module.exports = Sessions;