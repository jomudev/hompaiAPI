const API = require('../API');
class ArticlesAPI extends API {
  constructor (uid) {
    super(uid, "Articles");
  }

  async addArticles(articles) {
    return await Promise.all(articles.map(async (article) => {
      let articleValues = {
        name: article.name,
        userId: this.uid,
        description: article?.description,
        photoURL: article?.photoURL,
        initialPrice: article?.price || 0.00,
      };
      const values = this.getValues(articleValues);
      let { articleId } = (await this.db.call("addArticle", values))[0];
      article.id = articleId;
      return article
    }));
  }

  async getBatch(batchId) {
    if (!batchId) {
      return [];
    }
    const batch = await this.db.query(`SELECT *, getBatchArticlesTotal(${batchId}) as total FROM Batches WHERE id=${batchId}`);
    const articles = await this.db.query(`SELECT * FROM BatchesArticles LEFT JOIN Articles ON Articles.id=BatchesArticles.idArticles WHERE idBatches=${batchId}`);
    return {
      batch: batch[0],
      articles,
    }
  }

  async getBatches(pantryId) {
    if (!pantryId) {
      return [];
    }
    return await this.db.query(`SELECT *, getBatchArticlesTotal(id) as total, getBatchArticlesQuantity(id) as articlesQuantity FROM Batches WHERE idPantries=${pantryId} ORDER BY date DESC`);
  }

  async deleteBatch(batchId) {
    await this.db.query(`DELETE FROM Batches WHERE id=${batchId}`);
    this.db.query(`DELETE FROM BatchesArticles WHERE idBatches=${batchId}`);
    this.notify();
  }

  async getPantries() {
    return await this.db.query(`SELECT * FROM Pantries WHERE isUsers='${this.uid}'`);
  }

  async createPantry(pantryName) {
    if (!pantryName) {
      return;
    }
    await this.db.query(`CALL createPantry("${pantryName}", "${this.uid}")`);
    this.notify();
  }

  async getArticles() {
    try {
      return await this.db.query(`SELECT *, (SELECT SUM(quantity) FROM BatchesArticles WHERE idArticles=Articles.id) as quantity FROM Articles WHERE idUsers='${this.uid}'`);
    } catch (err) {
      console.error(err);
      console.log("No se pudieron obtener los artículos");
      return [];
    }
  }

  async deleteArticle(id) {
    if (!id) {
      return;
    }
    await this.db.query(`DELETE FROM Articles WHERE id='${id}'`)
    this.notify();
  }

  async addBatch(batch) {
    if (!batch) {
      return null;
    }
    let { batchId } = (await this.db.call(`insertBatch`, batch.pantryId))[0];
    console.log("inserted batch id", batchId);
    return batchId;
  }

  async getPantries() {
    let pantries = await this.db.selectAllFrom("Pantries", `WHERE idUsers='${this.uid}'`);
    pantries = pantries?.length ? pantries : [pantries];
    pantries = pantries.map((pantry => ({ id: pantry.id, name: pantry.name })))
    return pantries;
  }

  async getExpirationDates() {
    return await this.db.query(`SELECT Articles.name as name, Pantries.name as pantryName, Batches.date as batchDate, BatchesArticles.expirationDate as expirationDate, BatchesArticles.id as batchArticleId, Articles.idUsers as userId FROM BatchesArticles LEFT JOIN Articles ON Articles.id = BatchesArticles.idArticles LEFT JOIN Batches on Batches.id = BatchesArticles.idBatches LEFT JOIN Pantries ON Pantries.id = Batches.idPantries WHERE Articles.idUsers="${this.uid}"`);
  }

  async setExpiredArticle(articleId) {
    const articleData = await this.db.call("setExpiredArticle", articleId)
    if (articleData[0][0].hasOwnProperty("NULL")) {
      return false;
    }
    return articleData[0][0];
  }

  async saveBatchArticles(batch) {
    if (!batch || !batch.id) {
      return;
    }
    await this.db.query(`INSERT INTO BatchesArticles(idArticles, idBatches, expirationDate, quantity, price, idStock) VALUES ${batch.articles.map(batchArticle => {
      const articleExpirationDate = batchArticle?.expirationDate && new Date(batchArticle.expirationDate).toISOString().slice(0, 19).replace('T', ' ');
      return `(${batchArticle.id}, ${batch.id}, ${articleExpirationDate ? `"${articleExpirationDate}"` : 'null'}, ${batchArticle.quantity}, ${batchArticle.price}, (SELECT id FROM Stock WHERE idPantries=${batch.pantryId}))`;
    })}`);
  }

  async createBatch(batch) {
    if (!batch || !batch?.pantryId) {
      return;
    }
    console.log("inserting batch", batch);
    batch = {
      id: await this.addBatch(batch),
      articles: await this.addArticles(batch.articles),
      ...batch,
    };
    console.log("saved Batch", batch);
    this.saveBatchArticles(batch).then(() => console.log(`articles batch with id ${batch.id} were saved`));
    this.notify();
    return batch.id; 
  }
}

module.exports = ArticlesAPI;