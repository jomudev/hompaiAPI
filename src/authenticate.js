const auth = require('../firebase/auth');
const Sessions = require('../API_modules/Sessions/Sessions');
const sessions = Sessions.getInstance();

const Authenticate = async (req, res, next) => {
  const headers = req.headers;
  const ip = req.ip;
  const body = req.body;
  console.log(`headers:${JSON.stringify(headers)}\nip:${ip}\nbody:${JSON.stringify(body)}\npath:${req.path}`); 
  var userExist;
  var session;
  try {
    await sessions.setSession(headers.authorization);
    userExist = sessions.verifySession(headers.authorization);
  } catch(err) {
    console.log(err);
    res.status(401).send({
      data: null,
      error: "Unauthorized-request",
    });
    return;
  }
  if (!userExist && req.ip !== "::1" && req.path !== '/auth/login') {
    console.log("unauthorized");
    res.status(401).send({
      data: null,
      error: "Unauthorized-request",
    });
    return;
  }
  console.log("Request Authorized");
  next();
};

module.exports = Authenticate;