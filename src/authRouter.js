const express = require('express');
const router = express.Router();
const Admin = require('../API_modules/Main/Main');
const admin = new Admin();
admin.init().then(() => console.log("db connected in auth route"));

router.post('/create_user', async (req, res) => {
  const body = req.body;
  try {
    console.log("body: ", body);

    res.send({
      message: "user created",
    });
  } catch (err) {
    console.error(err);
    res.status(400).send("Error: " + err);
  }
});

router.get('/all_users', async (req, res) => {
  try {
    const users = await admin.userAdmin.getAllUsers();
    res.send(users);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});

module.exports = router;