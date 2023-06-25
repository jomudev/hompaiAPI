console.log("Iniciando Servidor");
const express = require("express")
const bodyParser = require('body-parser');
const authRouter = require('./authRouter');
const articlesRouter = require('./articlesRouter');
const verifyAuth = require('./authenticate');
const rateLimit = require('express-rate-limit');
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(verifyAuth);
app.use(limiter);
app.use('/auth', authRouter);
app.use('/articles', articlesRouter);
app.use(express.static('./public'));

module.exports = {
  app,
  express,
};