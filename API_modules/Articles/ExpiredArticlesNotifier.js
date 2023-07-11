const fbAdmin = require('firebase-admin');
const Database = require('../Database/index');
const Observer = require('../Observer');
const schedule = require('node-schedule');
const db = Database.getInstance();

module.exports = class ExpiredArticlesNotifier extends Observer {
  constructor (observable) {
    super(observable);
    this.data = {};
    this.init();
  }

  static instance = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new ExpiredArticlesNotifier();
    }
    return this.instance;
  }

  async getBatchesArticles() {
    return await db.call("getAllBatchesArticles");
  }

  async getUsersTokens() {
    return await db.query("SELECT idUsers as userId, token FROM UsersTokens");
  }

  async init() {
    await this.setTokens();
    await this.setArticles();
  }

  async update() {
    this.init();
  }

  async setTokens() {
    const tokens = await this.getUsersTokens();
    tokens.forEach(({ userId, token }) => {
      if (this.data[userId]) {
        if (this.data[userId]?.tokens[token]) {
          return;
        }
      }
      this.data[userId] = {
        ...this.data[userId],
        tokens: {
          ...this.data[userId]?.tokens,
          [token] : true,
        },
      };
    });
  }

  isArticleInMemory(article) {
    if (this.data[article.userId]) {
      if (this.data[article.userId]?.articles) {
        if (this.data[article.userId]?.articles[article.id]) {
          return true;
        }
      }
    }
    this.data[article.userId] = {
      ...this.data[article.userId],
      articles: {
        ...this.data[article.userId]?.articles,
        [article.id] : true,
      },
    };
    return false;
  }

  getArticleDateInfo(article) {
    const expirationDate = new Date(article.expirationDate);
    const batchDate = new Date(article.batchDate);
    const remainingDateTime = expirationDate - new Date();
    return () => ({
      expirationDate,
      batchDate,
      legibleExpirationDate: expirationDate.toLocaleDateString(),
      legibleBatchDate: batchDate.toLocaleDateString(),
      remainingDateTime,
      remainingDays: parseInt((remainingDateTime) / (1000 * 60 * 60 * 24)),
    });
  }

  async setArticles() {
    const articles = await this.getBatchesArticles();
    articles.forEach((article) => {
      const articleIsInMemory = this.isArticleInMemory(article);
      if (articleIsInMemory) {
        return false;
      }
      const { 
        legibleExpirationDate,
        legibleBatchDate,
        remainingDateTime, 
        remainingDays, 
        expirationDate, 
        batchDate
      } = this.getArticleDateInfo(article);
      const tokens = Object.keys(this.data[article.userId].tokens);
      var notification = {
        tokens,
      };
      if (remainingDays > 0 && remainingDays <= 7) {
        notification = {
          ...notification,
          title: `Pronto Caducará`,
          body: `${article.name}, caducará dentro de ${daysUntilExpire} días, el ${legibleBatchDate} `,
        };
      }
      if (remainingDateTime > 0) {
        console.log("scheduling notification for article", article.name, "will fired in ", legibleExpirationDate);
        const job = schedule.scheduleJob(legibleExpirationDate, () => {
          this.sendMessagingNotification({
            tokens,
            title: `Ha caducado`,
            body: `${article.name}, registrado el ${legibleBatchDate} ha caducado ${legibleExpirationDate}`,
          });
        });
        return;
      }
      notification = {
        ...notification,
        title: `Un artículo ha caducado`,
        body: `${article.name}, caducó el ${legibleExpirationDate}`,
      };
      this.sendMessagingNotification(notification);
    });
  }
  
  removeWatcher() {
    clearInterval(this.watcherId);
  }

  sendMessagingNotification(notification) {
    if (!notification || !notification.tokens.length) {
      return;
    }
    try {
      console.log("sending notification to ", notification);
      fbAdmin.messaging().sendEachForMulticast(notification);
    } catch(err) {
      console.error("Error trying to sending notification to user");
    }
  }

}