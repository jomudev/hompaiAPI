const express = require("express");
const bodyParser = require('body-parser');
const authRouter = require('./authRouter');
const productsRouter = require('./productsRouter');
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
app.use('/products', productsRouter);
app.use(express.static('./public'));

module.exports = {
  app,
  express,
};