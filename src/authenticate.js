const Sessions = require('../API_modules/Sessions/Sessions');
const sessions = Sessions.getInstance();

const Authenticate = async (req, res, next) => {
  const headers = req.headers;
  const authorization = headers.authorization;
  const ip = req.ip;
  const messagingToken = headers['messaging-token'];
  const body = req.body;
  console.log(`headers: ${JSON.stringify(headers)}\nip: ${ip}\nbody: ${JSON.stringify(body)}\npath: ${req.path}`); 
  const sessionExist = await sessions.setSession(authorization, ip, messagingToken);
  if (!sessionExist && req.path !== '/auth/login') {
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