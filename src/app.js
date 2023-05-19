const express = require("express");
const bodyParser = require('body-parser');
const authRouter = require('./authRouter');
const router = require("./authRouter");
const rateLimit = require('express-rate-limit');
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);
app.use('/auth', authRouter);
app.use(express.static('./public'));

app.use(router);

module.exports = {
  app,
  express,
};