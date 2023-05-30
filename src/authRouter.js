console.log("initializing AuthRouter");
const express = require('express');
const auth = require('../firebase/auth');
const router = express.Router();
const Admin = require('../API_modules/Main/Main');
const admin = new Admin();
admin.init()
.then(() => console.log("db connected in auth route"));

router.post('/create_user', async (req, res) => {
  const body = req.body;
  let user = {};
  Object.keys(body).forEach(key => body[key] !== null ? user[key] = body[key] : null);
  let authRes;
  try {
    authRes = await auth().createUser(user);
  } catch (err) {
    console.log(err.stack);
    res.status(400).send("Error al crear el usuario contacte al administrador de la API");
    return;
  }
  try {
    await admin.userAdmin.createUser({
      id: authRes.uid,
      email: authRes.email,
      photoURL: authRes.photoURL,
      displayName: authRes.displayName,
      phoneNumber: authRes.phoneNumber
    });
  } catch (err) {
      await auth().deleteUser(authRes.uid);
      console.log(err.stack);
      res.status(400).send("Error al crear el usuario contacte al administrador de la API");
      return;
  }
  await auth().generateSignInWithEmailLink(authRes.email);
  res.status(200).send(authRes); 
});

router.post('login', async (req, res, next) => {
  const email = req.body.email;
  const fbUser = await auth().getUserByEmail(email);
  const dbUser = await admin.userAdmin.getUserByEmail(email);
  console.log(fbUser, dbUser);
  res.status(200).send({ user: fbUser });
});

module.exports = router;