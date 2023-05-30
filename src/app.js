console.log("Iniciando Servidor");
const express = require("express");
const fbAdmin = require('firebase-admin');
const bodyParser = require('body-parser');
const authRouter = require('./authRouter');
const verifyAuth = require('./authenticate');
const productsRouter = require('./productsRouter');
const rateLimit = require('express-rate-limit');
const app = express();
const fbApp = require('../firebase/app');
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const GoogleAppCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccount = require(GoogleAppCredentials);

fbApp.initializeApp({
  credential: fbAdmin.credential.cert(serviceAccount),
  projectId: firebaseConfig.projectId,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(verifyAuth);
app.use(limiter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use(express.static('./public'));

module.exports = {
  app,
  express,
};