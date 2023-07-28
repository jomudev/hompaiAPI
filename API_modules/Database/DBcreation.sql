CREATE DATABASE Hompai;
USE Hompai;


DELIMITER //
CREATE PROCEDURE `getAllBatchesArticles`()
BEGIN	
    SELECT 
		BatchesArticles.expirationDate, 
        BatchesArticles.id,
        Batches.date as batchDate, 
        Articles.name,
        Articles.idUsers as userId
	FROM BatchesArticles 
	LEFT JOIN Batches ON Batches.id = BatchesArticles.idBatches 
    LEFT JOIN Articles ON Articles.id = BatchesArticles.idArticles
    WHERE BatchesArticles.expirationDate IS NOT NULL;
END //
DELIMITER ;

DELIMITER //
CREATE  PROCEDURE `addArticle`(
	IN articleName VARCHAR(50), 
    IN articleUserId VARCHAR(255), 
    IN articleDescription VARCHAR(255), 
    IN articlePhotoURL VARCHAR(255), 
    IN articleInitialPrice DECIMAL(10, 2))
BEGIN
	SET @existentArticleId = (SELECT id FROM Articles WHERE LOWER(name) = LOWER(articleName));
	IF ISNULL(@existentArticleId) THEN
		INSERT INTO Articles(name, idUsers, description, photoURL, initialPrice)
			VALUES (articleName, articleUserId, articleDescription, articlePhotoURL, articleInitialPrice);
			SELECT LAST_INSERT_ID() as articleId;
	ELSE
		SELECT @existentArticleId as articleId;
	END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `createPantry`(IN pantryName VARCHAR(50), IN userId VARCHAR(255))
BEGIN
	INSERT INTO Pantries(name, idUsers) VALUES(pantryName, userId);
    INSERT INTO Stock(idPantries) VALUES(LAST_INSERT_ID());
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `getAllFrom`(IN tablename VARCHAR(50))
BEGIN
	SELECT * FROM tablename;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `insertBatch`(IN pantryId INT)
BEGIN
	INSERT INTO Batches(idPantries) VALUES(pantryId);
    SELECT LAST_INSERT_ID() as batchId;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `setExpiredArticle`(IN batchArticleId INT)
BEGIN
	SET @existentExpiredArticle = (SELECT idBatchesArticles FROM ExpiredArticles WHERE idBatchesArticles=batchArticleId);
    IF ISNULL(@existentExpiredArticle) THEN
		INSERT INTO ExpiredArticles(idBatchesArticles, checked) VALUES (batchArticleId, 0);
        SELECT NULL;
	ELSE 
		SELECT ExpiredArticles.idBatchesArticles, Articles.name, BatchesArticles.expirationDate, Batches.date as batchDate FROM ExpiredArticles LEFT JOIN BatchesArticles ON BatchesArticles.id = ExpiredArticles.idBatchesArticles LEFT JOIN Batches ON Batches.id = BatchesArticles.idBatches LEFT JOIN Articles ON Articles.id = BatchesArticles.idArticles WHERE idBatchesArticles=batchArticleId;
	END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `verifyArticle`(
	IN articleName VARCHAR(50), 
    IN articleUserId VARCHAR(255), 
    IN articleDescription VARCHAR(255), 
    IN articlePhotoURL VARCHAR(255), 
    IN articleInitialPrice DECIMAL(10, 2))
BEGIN
	INSERT INTO Articles(name, idUsers, description, photoURL, initialPrice)
        VALUES (articleName, articleUserId, articleDescription, articlePhotoURL, articleInitialPrice);
        SET @articleId = SCOPE_IDENTITY();
        SELECT * FROM Articles WHERE id = @articleId;
END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION `getBatchArticlesQuantity`(batchId INT) RETURNS int
    DETERMINISTIC
BEGIN
	RETURN (SELECT COUNT(id) AS articlesQuantity FROM BatchesArticles WHERE idBatches=batchId);
END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION `getBatchArticlesTotal`(batchId INT) RETURNS int
    DETERMINISTIC
BEGIN
	SET @total = (SELECT CAST(SUM(price*quantity) AS DECIMAL(10,2)) AS total FROM BatchesArticles WHERE idBatches=batchId);
    IF ISNULL(@total) THEN
		RETURN 0;
	ELSE 
		RETURN @total;
	END IF;
END //
DELIMITER ;

CREATE TABLE Users (
	id VARCHAR(255) NOT NULL PRIMARY KEY UNIQUE,
    displayName VARCHAR(50),
    email VARCHAR(50) NOT NULL,
    photoURL TEXT,
    phoneNumber INT
);

SELECT * FROM Users;
TRUNCATE TABLE Users;

CREATE TABLE Measures (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    acronym VARCHAR(59)
);

CREATE TABLE Notifications (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idUsers VARCHAR(255) NOT NULL REFERENCES Users(id),
	fireDate DATE NOT NULL,
    title VARCHAR(64) NOT NULL,
	body VARCHAR(255) NOT NULL,
    imageURL TEXT NULL
);

CREATE TABLE Ubications (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idUsers VARCHAR(255) NOT NULL REFERENCES Users(id),
    name VARCHAR(50) NOT NULL
);

CREATE TABLE UsersTokens (
idUsers VARCHAR(255) NOT NULL REFERENCES Users(id),
token VARCHAR(355) NOT NULL UNIQUE
);

CREATE TABLE Articles (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idUsers VARCHAR(255) NOT NULL REFERENCES Users(id),
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    photoURL TEXT,
    initialPrice DECIMAL(10, 2),
    idMeasures INT REFERENCES Measures(id),
    idUbications INT REFERENCES Ubications(id)
);

CREATE TABLE Pantries (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    idUsers VARCHAR(255) NOT NULL REFERENCES Users(id)
);

CREATE TABLE Stock (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    idPantries INT NOT NULL REFERENCES Pantries(id)
);

CREATE TABLE Batches (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idPantries INT NOT NULL REFERENCES Pantries(id),
    date DATETIME NOT NULL DEFAULT NOW()
);

CREATE TABLE BatchesArticles (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idArticles INT NOT NULL REFERENCES Articles(id),
    idStock INT NULL REFERENCES Stock(id),
    idBatches INT NOT NULL REFERENCES Batches(id),
    expirationDate DATE DEFAULT NULL,
    quantity INT,
    price DECIMAL(10,2)
);

CREATE TABLE StockProducts (
	idBatchesArticles INT NOT NULL REFERENCES BatchesArticles(id),
    remainingPercentage DECIMAL(3,2) DEFAULT 1.00,
    quantity INT,
    expirationDate DATE
);

CREATE TABLE OutOfStockProducts (
	idBatchesArticles INT NOT NULL REFERENCES BatchesArticles(id)
);

CREATE TABLE ExpiredArticles (
	idBatchesArticles INT NOT NULL REFERENCES BatchesArticles(id),
    checked BOOLEAN DEFAULT FALSE
);