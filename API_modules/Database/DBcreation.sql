DELIMITER //
CREATE PROCEDURE `getPantryStock`(IN pantryId INT)
BEGIN
	SELECT * FROM 
END //
DELIMITER ;

CREATE DATABASE Hompai;
USE Hompai;
select * FROM Articles;
select * from Batches;
select * from Pantries;
select * from BatchesArticles;
select * from Stock;
DELETE FROM Articles WHERE id != 1 OR id != 2;

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

CREATE TABLE Ubications (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idUsers VARCHAR(255) NOT NULL REFERENCES Users(id),
    name VARCHAR(50) NOT NULL
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