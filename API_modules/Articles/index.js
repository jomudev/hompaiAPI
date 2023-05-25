const API = require('../API');

class ArticlesAPI extends API {
  constructor () {
    super();
    this.tablename = "Articles";
  }

  articleElementIsValid(article) {
    
  }

  async saveArticle(article) {

  }
}

module.exports = ArticlesAPI;