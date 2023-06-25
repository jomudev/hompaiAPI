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
      console.log(`saved product ${articleValues.name} with returned id = "${JSON.stringify(articleId)}"`);
      article.id = id;
      console.log("article to saved in batch", article);
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
  }

  async getPantries() {
    return await this.db.query(`SELECT * FROM Pantries WHERE isUsers='${this.uid}'`);
  }

  async createPantry(pantryName) {
    if (!pantryName) {
      return;
    }
    await this.db.query(`CALL createPantry("${pantryName}", "${this.uid}")`);
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
    delete pantries.idUsers;
    return pantries;
  }

  async saveBatchArticles(batch) {
    if (!batch || !batch.id) {
      return;
    }
    await this.db.query(`INSERT INTO BatchesArticles(idArticles, idBatches, quantity, price, idStock) VALUES ${batch.articles.map(batchArticle => {
      return `(${batchArticle.id}, ${batch.id}, ${batchArticle.quantity}, ${batchArticle.price}, (SELECT id FROM Stock WHERE idPantries=${batch.idPantries}))`;
    })}`);
  }

  async createBatch(batch) {
    if (!batch || !batch.id) {
      return;
    }
    batch = {
      id: await this.addBatch(batch),
      articles: await this.addArticles(batch.articles, batchPantry),
      ...batch,
    };
    this.saveBatchArticles(batch).then(() => console.log(`articles batch with id ${batch.id} were saved`));
    return batch.id; 
  }
}

module.exports = ArticlesAPI;