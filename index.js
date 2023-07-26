const { app } = require('./src/app.js');
const Database = require('./API_modules/Database/index.js');
const dotenv = require('dotenv').config();
Database.getInstance();
//const ExpiredArticlesNotifier = require('./API_modules/Articles/ExpiredArticlesNotifier.js');
//ExpiredArticlesNotifier.getInstance();
const port = process.env.PORT || 800;

const fbAdmin = require('firebase-admin');
const fbApp = require('./firebase/app');
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const GoogleAppCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccount = require(GoogleAppCredentials);

const fb = fbApp.initializeApp({
  credential: fbAdmin.credential.cert(serviceAccount),
  projectId: firebaseConfig.projectId,
});

app.listen(port, () => {
  console.log(`server running at port ${port}`);
})