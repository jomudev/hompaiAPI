console.log("initializing AuthRouter");
const express = require('express');
const auth = require('../firebase/auth');
const router = express.Router();
const Sessions = require('../API_modules/Sessions/Sessions');
const sessions = Sessions.getInstance();

router.post('/create_user', async (req, res) => {
  const admin = sessions.getSession(req.headers.authorization);
  let userEmail = req.body.email;
  console.log("request body: ", req.body);
  if (!userEmail) {
    res.status(400).send("Necesitas proporcionar los datos necesarios");
    return;
  }
  var user = null;
  try {
    user = await auth().getUserByEmail(userEmail);
  } catch(err) {
    console.error(err.stack);
    res.status(400).send("Hubo un problema al intentar obtener los datos usuario");
    return;
  }
  console.log("user to create", user);

  try {
    await admin.users.createUser(user);
    await admin.articles.createPantry("Despensa");
  } catch(err) {
    await auth().deleteUser(user.uid);
    console.error(err.stack);
    res.status(400).send("El usuario no pudo ser creado, intenta nuevamente");
  }

});

router.get('/users', async (req, res) => {
  var fbUsers = {};
  try {
    fbUsers = (await auth().listUsers()).users;
  } catch (err) {
    console.error("firebase Error: " + err.code);
    res.status(400).send(err.code.split('/')[1]);
    return;
  }
  const sqlUsers = await admin.users.getAllUsers();
  console.log(fbUsers);
  console.log(sqlUsers);

  console.log("rendering");
  res.render('users', {
    fbUsers,
    sqlUsers,
  });
});

router.get('/delete_user/:uid', async (req, res) => {
  const uid = req.params.uid;
  try {
    await auth().deleteUser(uid);
  } catch(err) {
    console.log(err);
    res.status(400).send("error trying to delete user from firebase");
  }
  try {
    await admin.users.deleteUser(uid);
  } catch(err) {
    console.log(err);
    res.status(400).send("error trying to delete user from database");
  }
  res.status(200).send("user deleted");
});

module.exports = router;