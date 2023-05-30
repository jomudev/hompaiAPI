const Authenticate = (req, res, next) => {
  const headers = req.headers;
  const ip = req.ip;
  const body = req.body;
  console.log(`headers:${JSON.stringify(headers)}\nip:${ip}\nbody:${JSON.stringify(body)}\npath:${req.path}`);
  if (headers.authorization !== "Loscaminosdelavida2023" && req.ip !== "::1") {
    console.log("unauthorized");
    res.status(401).send("Unauthorized request");
    return;
  }
  console.log("Authorized");
  next();
};

module.exports = Authenticate;