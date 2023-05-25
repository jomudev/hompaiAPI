const express = require('express');
const router = express.Router();
const Admin = require('../API_modules/Main/Main');
const admin = new Admin();
admin.init().then(() => console.log("db connected in products route"));

router.post('/create_product', (req, res) => {
  const body = req.body;
  console.log(body);
  res.send("user created");
});

router.get('/', (req, res) => {
  res.send('products');
});

module.exports = router;