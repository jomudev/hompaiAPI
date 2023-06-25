console.log('initializing ArticlesRouter');
const express = require('express');
const router = express.Router();
const Sessions = require('../API_modules/Sessions/Sessions');
const sessions = Sessions.getInstance();
const errorHandler = (data, error) => {
  return ({
    data, 
    error,
  })
}

function getAdmin(req) {
  const key = req.headers.authorization;
  return sessions.getSession(key).admin;
}

router.post('/createBatch', (req, res) => {
  const admin = getAdmin(req);
  console.log("batch", req.body);
  const batchId = admin.articles.createBatch(req.body);
  res.status(200).json(errorHandler({ batchId }, null));
});

router.post('/createArticle', (req, res) => {
  res.status(200).json({
    data: "Article Created",
    error: null,
  })
})

router.get('/pantries', async (req, res) => {
  const admin = getAdmin(req);
  const pantries = await admin.articles.getPantries();
  console.table(pantries);
  res.status(200).json({
    data: pantries,
    error: null,
  });
});

router.get('/getBatches/:pantryId', async (req, res) => {
  const pantryId = req.params.pantryId;
  const admin = getAdmin(req);
  const batches = await admin.articles.getBatches(pantryId);
  console.table(batches);
  res.status(200).json({
    data: batches,
    error: null,
  })
});

router.get('/getBatchArticles/:batchId', async (req, res) => {
  const batchId = req.params.batchId;
  const admin = getAdmin(req);
  const articles = await admin.articles.getBatchArticles(batchId);
  console.table(articles);
  res.status(200).json(errorHandler(articles, null));
})

router.get('/getBatch/:batchId', async (req, res) => {
  const batchId = req.params.batchId;
  const admin = getAdmin(req);
  const batch = await admin.articles.getBatch(batchId);
  console.table(batch);
  res.status(200).json(errorHandler(batch, null));
})

router.post('/deleteBatch', async (req, res) => {
  const {batchId} = req.body;
  const admin = getAdmin(req);
  await admin.articles.deleteBatch(batchId);
  res.status(200).json(errorHandler("Batch deleted successfully", null));
});

router.post('/createPantry', async (req, res) => {
  const admin = getAdmin(req);
  await admin.articles.createPantry(req.body.pantryName);
  res.status(200).json({
    data: "Pantry saved",
    error: null,
  });
});

router.get('/', async (req, res) => {
  const admin = getAdmin(req);
  const articles = await admin.articles.getArticles();
  console.table(articles);
  res.status(200).json({
    data: articles,
    error: null,
  });
});

router.post('/deleteArticle', async (req, res) => {
  const admin = getAdmin(req);
  await admin.articles.deleteArticle(req.body.articleId);
  res.status(200).json({
    data: "Article deleted",
    error: null,
  })
});

module.exports = router;